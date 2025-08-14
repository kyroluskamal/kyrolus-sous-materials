import { inject, InjectionToken } from '@angular/core';
import { BUTTON_BORDER_RADIUS_CLASS, ButtonConfig } from '../public-api';

export const MENU_BUTTON_CONFIG = new InjectionToken<
  Omit<
    ButtonConfig,
    'disabled' | 'iconOptions' | 'isNotDecorative' | 'iconName'
  >
>('BUTTON_BORDER_RADIUS_CLASS', {
  providedIn: 'any',
  factory: () => {
    return {
      size: 'sm',
      variant: 'text',
      appearance: 'dark',
      isRaised: false,
      shape: 'default',
      borderRadius: inject(BUTTON_BORDER_RADIUS_CLASS),
    };
  },
});
