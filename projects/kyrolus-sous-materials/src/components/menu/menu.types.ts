import { inject } from '@angular/core';
import {
  BUTTON_APPEARANCE,
  BUTTON_BORDER_RADIUS_CLASS,
  BUTTON_IS_RAISED,
  BUTTON_SHAPE,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ButtonAppearance,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  IconOptions,
} from '../../public-api';
import { ICON_OPTIONS } from '../../Tokens/icon.tokens';
import { MENU_BUTTON_CONFIG } from '../../Tokens/menu.tokens';
export type KsMenuConfig = IMenuSection | IMenuItem | IMenuSeparator;
export type ButtonConfig = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  isRaised?: boolean;
  borderRadius?: string;
  shape?: ButtonShape;
  disabled?: boolean;
  RaisedClass?: string;
  iconName?: string;
  iconOptions?: IconOptions;
  id?: string;
};
export type KsMenuItemButtonConfig = Omit<
  ButtonConfig,
  'disabled' | 'iconOptions' | 'isNotDecorativeIcon' | 'iconName'
>;
export class KsMenu {
  constructor(
    public menuConfig: KsMenuConfig[],

    public options: {
      iconOptions: IconOptions;
      menuClasses?: string;
      itemClasses?: string;
      separatorClasses?: string;
      floatngUiOffset?: string;
    } = {
      iconOptions: inject(ICON_OPTIONS),
    },
    public toggleButtonConfig: ButtonConfig = {
      size: inject(BUTTON_SIZE),
      variant: inject(BUTTON_VARIANT),
      appearance: inject(BUTTON_APPEARANCE),
      isRaised: inject(BUTTON_IS_RAISED) || false,
      borderRadius: inject(BUTTON_BORDER_RADIUS_CLASS),
      shape: inject(BUTTON_SHAPE),
      iconOptions: inject(ICON_OPTIONS),
      disabled: false,
      iconName: 'menu',
      id: `menu-button-${Math.random().toString(36).substring(2, 15)}`,
    },
    public menuItemButtonConfig: KsMenuItemButtonConfig = inject(
      MENU_BUTTON_CONFIG
    )
  ) {}
}

export interface IMenuItem<T = any> {
  id?: string;
  label: string;
  href?: string;
  routerLink?: string;
  action?: (event: ItemClickEvent, itemRef: HTMLElement) => T;
  icon?: string;
  iconOptions?: IconOptions;
  classes?: string;
  disabled?: boolean;
  separator?: never;
  title?: never;
  items?: never;
}

export interface IMenuSection {
  title?: string;
  id?: string;
  items: IMenuItem[];
  classes?: string;
  routerLink?: never;
  label?: never;
  icon?: never;
  href?: never;
  iconOptions?: never;
  separator?: never;
  disabled?: never;
  isDecorative?: never;
}

export interface IMenuSeparator {
  separator: true;
  isDecorative?: boolean;
}

export type ItemClickEvent = {
  event: MouseEvent | PointerEvent | TouchEvent;
  itemRef: HTMLElement;
  buttonRef?: HTMLButtonElement;
};
