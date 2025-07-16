import { InjectionToken } from '@angular/core';
import { DialogConfig } from './dialog.types';

export const DIALOG_DEFAULT_CONFIG = new InjectionToken<DialogConfig>(
  'DIALOG_DEFAULT_CONFIG',
  {
    providedIn: 'any',
    factory: () => new DialogConfig(),
  }
);
