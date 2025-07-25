import { KsIConEvent } from '../../public-api';
export interface GoogleIcon {
  type: 'normal' | 'round' | 'outlined' | 'sharp' | 'two-tone';
}
export type IconProvider = 'bi' | 'fa' | 'google';

export interface IconOptions {
  provider: IconProvider;
  options?: GoogleIcon | BootstrapIcon;
}
export interface BootstrapIcon {}

export type Icon = {
  options: IconOptions;
  name: string;
  onClick?: (event: KsIConEvent) => void;
  onHover?: (event: KsIConEvent) => void;
  onKeyDown?: (event: KsIConEvent) => void;
};
