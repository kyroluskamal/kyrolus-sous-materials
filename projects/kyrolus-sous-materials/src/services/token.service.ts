import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CryptoService } from './crypto.service';
import { isPlatformBrowser } from '@angular/common';
import { TOKENS_LOCAL_STORAGE_KEYS } from '../Tokens/tokeservice.tokens';
export enum TokenTypes {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  ID_TOKEN = 'ID_TOKEN',
}
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly cryptoService = inject(CryptoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly AccessToken = signal<string | null>(null);
  private readonly RefreshToken = signal<string | null>(null);
  private readonly IdToken = signal<string | null>(null);
  private readonly AuthTokenKeys = inject(TOKENS_LOCAL_STORAGE_KEYS);
  private tokenUpdatedPromise: Promise<void> | null = null;
  private tokenUpdatedResolve: (() => void) | null = null;
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.AccessToken.set(
        localStorage.getItem(this.AuthTokenKeys.ACCESS_TOKEN)
      );
      this.RefreshToken.set(
        localStorage.getItem(this.AuthTokenKeys.REFRESH_TOKEN)
      );
      this.IdToken.set(localStorage.getItem(this.AuthTokenKeys.ID_TOKEN));
    }
  }

  async initialize(): Promise<void> {
    if (![null, undefined, ''].includes(this.AccessToken())) {
      await this.initializeEncryptionKey();
    } else {
      await this.cryptoService.initialize();
    }
  }

  async storeToken(
    token: string,
    type: TokenTypes = TokenTypes.ACCESS_TOKEN
  ): Promise<void> {
    let encrypytedToken = await this.cryptoService.encrypt(token);
    if (isPlatformBrowser(this.platformId)) {
      let _type = '';
      switch (type) {
        case TokenTypes.ACCESS_TOKEN: {
          this.AccessToken.set(encrypytedToken);
          _type = this.AuthTokenKeys.ACCESS_TOKEN;
          break;
        }
        case TokenTypes.REFRESH_TOKEN: {
          this.RefreshToken.set(encrypytedToken);
          _type = this.AuthTokenKeys.REFRESH_TOKEN;
          break;
        }
        case TokenTypes.ID_TOKEN: {
          this.IdToken.set(encrypytedToken);
          _type = this.AuthTokenKeys.ID_TOKEN;
          break;
        }
        default: {
          throw new Error('Invalid token type.');
        }
      }

      if (this.rememberMe) {
        localStorage.setItem(_type, encrypytedToken!);
      } else {
        sessionStorage.setItem(_type, encrypytedToken!);
      }

      if (this.tokenUpdatedResolve) {
        this.tokenUpdatedResolve();
        this.tokenUpdatedPromise = null;
        this.tokenUpdatedResolve = null;
      }
    }
  }
  set rememberMe(value: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      if (value) {
        localStorage.setItem('rememberMe', 'true');
        sessionStorage.removeItem('rememberMe');
      } else {
        sessionStorage.setItem('rememberMe', 'false');
        localStorage.removeItem('rememberMe');
      }
    }
  }
  async waitForTokenUpdate(): Promise<void> {
    const token = await this.getToken(TokenTypes.ACCESS_TOKEN);
    if (token) return Promise.resolve();
    if (!this.tokenUpdatedPromise) {
      this.tokenUpdatedPromise = new Promise<void>((resolve) => {
        this.tokenUpdatedResolve = resolve;
      });
    }
    return this.tokenUpdatedPromise;
  }
  async getToken(tokenType: TokenTypes): Promise<string | null> {
    if (this.tokenUpdatedPromise) {
      await this.tokenUpdatedPromise;
    }
    let token: string | null = null;
    switch (tokenType) {
      case TokenTypes.ACCESS_TOKEN: {
        token = this.AccessToken();
        break;
      }
      case TokenTypes.REFRESH_TOKEN: {
        token = this.RefreshToken();
        break;
      }
      case TokenTypes.ID_TOKEN: {
        token = this.IdToken();
        break;
      }
      default: {
        throw new Error('Invalid token type.');
      }
    }

    return token ? await this.cryptoService.decrypt(token) : null;
  }

  async logout(): Promise<void> {
    this.AccessToken.set(null);
    this.RefreshToken.set(null);
    this.IdToken.set(null);
    localStorage.clear();
    this.cryptoService.encryptionKey = null;
  }
  private async initializeEncryptionKey(): Promise<void> {
    const keyBase64 = this.AccessToken()?.split('.')[2];
    if (!keyBase64) {
      throw new Error('Invalid token format: Key is missing.');
    }

    const keyData = Uint8Array.from(atob(keyBase64), (char) =>
      char.charCodeAt(0)
    );

    this.cryptoService.encryptionKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  get rememberMe(): boolean {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('rememberMe') === 'true'
      : false;
  }
}
