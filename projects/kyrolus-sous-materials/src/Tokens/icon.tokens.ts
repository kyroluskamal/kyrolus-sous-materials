import { InjectionToken } from '@angular/core';
import { IconOptions } from '../public-api';

export const ICON_OPTIONS = new InjectionToken<IconOptions>('FORM_COLOR', {
  providedIn: 'any',
  factory: () => {
    return {
      provider: 'google',
      options: {
        type: 'outlined',
      },
    };
  },
});
