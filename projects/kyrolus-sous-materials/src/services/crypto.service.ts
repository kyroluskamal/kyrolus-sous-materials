import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  readonly key = signal<CryptoKey | null>(null);
  private readonly platformId = inject(PLATFORM_ID);

  async initialize(): Promise<void> {
    if (!this.key()) {
      const generatedKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      this.key.set(generatedKey);
    }
  }

  // Encrypt the token and store it in the signal
  async encrypt(textToEncrypt: string): Promise<string | null> {
    if (!this.key()) {
      throw new Error(
        'CryptoService is not initialized. Call initialize() first.'
      );
    }
    if (isPlatformBrowser(this.platformId)) {
      const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate IV
      const encoded = new TextEncoder().encode(textToEncrypt);

      const cipher = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        this.key()!,
        encoded
      );

      // Export the key as raw binary
      const rawKey = await crypto.subtle.exportKey('raw', this.key()!);
      const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)));

      // Combine encrypted token, IV, and Key as Base64 strings
      const encryptedToken = btoa(
        String.fromCharCode(...new Uint8Array(cipher))
      );
      const ivBase64 = btoa(String.fromCharCode(...iv));

      return `${encryptedToken}.${ivBase64}.${keyBase64}`;
      // return textToEncrypt;
    }
    return null;
  }

  // Decrypt the token from the signal
  async decrypt(textToDecode: string): Promise<string | null> {
    if (!this.key()) {
      throw new Error(
        'CryptoService is not initialized. Call initialize() first.'
      );
    }

    const [encryptedTokenBase64, ivBase64] = textToDecode.split('.');
    if (!ivBase64 || !encryptedTokenBase64) {
      throw new Error('Invalid encrypted token format.');
    }

    // Decode Base64 to binary data
    const iv = Uint8Array.from(atob(ivBase64), (char) => char.charCodeAt(0));
    const encryptedToken = Uint8Array.from(atob(encryptedTokenBase64), (char) =>
      char.charCodeAt(0)
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      this.key()!,
      encryptedToken
    );

    return new TextDecoder().decode(decrypted);
    // return textToDecode;
  }
  set encryptionKey(value: CryptoKey | null) {
    this.key.set(value);
  }
}
