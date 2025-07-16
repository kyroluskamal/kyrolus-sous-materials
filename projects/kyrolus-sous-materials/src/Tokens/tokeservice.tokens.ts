import { InjectionToken } from '@angular/core';
export class AuthTokensKeys {
  ACCESS_TOKEN = 'ACCESS_TOKEN';
  ID_TOKEN = 'ID_TOKEN';
  REFRESH_TOKEN = 'REFRESH_TOKEN';
}
export const TOKENS_LOCAL_STORAGE_KEYS = new InjectionToken<AuthTokensKeys>(
  'FORM_APPEARANCE',
  {
    providedIn: 'any',
    factory: () => new AuthTokensKeys(),
  }
);
