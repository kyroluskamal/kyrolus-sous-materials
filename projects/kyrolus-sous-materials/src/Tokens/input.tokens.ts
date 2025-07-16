import { InjectionToken } from '@angular/core';
import {
  InputAppearance,
  InputColor,
  InputSize,
} from '../components/form/input.types';
export const FORM_APPEARANCE = new InjectionToken<InputAppearance>(
  'FORM_APPEARANCE',
  {
    providedIn: 'any',
    factory: () => 'outline',
  }
);

export const FORM_COLOR = new InjectionToken<InputColor>('FORM_COLOR', {
  providedIn: 'any',
  factory: () => 'primary',
});
export const FORM_SIZE = new InjectionToken<InputSize>('FORM_SIZE', {
  providedIn: 'any',
  factory: () => 'md',
});
