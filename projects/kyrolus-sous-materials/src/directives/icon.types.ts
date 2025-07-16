import { KsIConEvent } from '../public-api';

export type IconType =
  | 'fa'
  | 'fas'
  | 'fal'
  | 'far'
  | 'fab'
  | 'fad'
  | 'bi'
  | 'google'
  | 'google-round'
  | 'google-outlined'
  | 'google-sharp'
  | 'google-two-tone';

export type Icon = {
  type: IconType;
  name: string;
  onClick?: (event: KsIConEvent) => void;
  onHover?: (event: KsIConEvent) => void;
  onKeyDown?: (event: KsIConEvent) => void;
};
