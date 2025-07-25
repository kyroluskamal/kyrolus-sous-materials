import { KsIConEvent } from '../../public-api';
export interface GoogleIcon extends FsNotCommonIconType {
  type: 'normal' | 'round' | 'outlined' | 'sharp' | 'two-tone';
}
export type IconProvider = 'bi' | 'fa' | 'google';

export interface FsNotCommonIconType {
  family?: never;
  size?: never;
  animation?: never;
  rotate?: never;
  flip?: never;
  isFixedWidth?: never;
}
export interface IconOptions {
  provider: IconProvider;
  options?: GoogleIcon | BootstrapIcon | FontAwesomeIcon;
}
export interface BootstrapIcon extends FsNotCommonIconType {}

export interface FontAwesomeIcon {
  family:
    | 'classic'
    | 'duotone'
    | 'sharp'
    | 'sharp-duotone'
    | 'chisel'
    | 'etch'
    | 'jelly'
    | 'notdog'
    | 'slab'
    | 'thumpring'
    | 'whiteboard';
  type: 'solid' | 'light' | 'regular' | 'thin';
  size?: 'xs' | 'sm' | 'lg' | '2x' | '3x' | '5x' | '10x';
  animation?: 'spin' | 'pulse';
  rotate?: '90' | '180' | '270';
  flip?: 'horizontal' | 'vertical' | 'both';
  isFixedWidth?: boolean;
}

export type Icon = {
  options: IconOptions;
  name: string;
  onClick?: (event: KsIConEvent) => void;
  onHover?: (event: KsIConEvent) => void;
  onKeyDown?: (event: KsIConEvent) => void;
};
