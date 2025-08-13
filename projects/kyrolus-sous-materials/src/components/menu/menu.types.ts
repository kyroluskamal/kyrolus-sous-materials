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
// readonly size = input<ButtonSize>(inject(BUTTON_SIZE));
//   readonly variant = input<ButtonVariant>(inject(BUTTON_VARIANT));
//   readonly appearance = input<ButtonAppearance>(inject(BUTTON_APPEARANCE));
//   readonly isRaised = input<boolean, string>(inject(BUTTON_IS_RAISED), {
//     transform: booleanAttribute,
//   });
//   readonly borderRadius = input(inject(BUTTON_BORDER_RADIUS_CLASS));
//   readonly shape = input(inject(BUTTON_SHAPE));
//   readonly disabled = input<boolean, string>(false, {
//     transform: booleanAttribute,
//   });
//   readonly RaisedClass = input(inject(BUTTON_RAISE_CLASS));
export type KsMenuConfig = IMenuSection | IMenuItem | IMenuSeparator;
export class KsMenu {
  constructor(
    public menuConfig: KsMenuConfig[],

    public options: {
      iconOptions: IconOptions;
      menuClasses?: string;
      itemClasses?: string;
      separatorClasses?: string;
    } = {
      iconOptions: inject(ICON_OPTIONS),
    },
    public buttonConfig: {
      size: ButtonSize;
      variant: ButtonVariant;
      appearance: ButtonAppearance;
      isRaised?: boolean;
      borderRadius?: string;
      shape: ButtonShape;
      disabled?: boolean;
      RaisedClass?: string;
      iconName?: string;
      isNotDecorative?: boolean;
      iconOptions?: IconOptions;
      id?: string;
    } = {
      size: inject(BUTTON_SIZE),
      variant: inject(BUTTON_VARIANT),
      appearance: inject(BUTTON_APPEARANCE),
      isRaised: inject(BUTTON_IS_RAISED) || false,
      borderRadius: inject(BUTTON_BORDER_RADIUS_CLASS),
      shape: inject(BUTTON_SHAPE),
      disabled: false,
      iconName: 'menu',
      isNotDecorative: true,
      id: `menu-button-${Math.random().toString(36).substring(2, 15)}`,
    }
  ) {}
}

export interface IMenuItem {
  id?: string;
  label: string;
  href?: string;
  routerLink?: string;
  action?: () => void;
  type: 'a' | 'button';
  icon?: string;
  iconOptions?: IconOptions;
  classes?: string;
  disabled?: boolean;
  tooltip?: string;
  separator?: never;
  title?: never;
  items?: never;
}

export interface IMenuSection {
  title?: string;
  items: IMenuItem[];
  classes?: string;
  icon?: string;
  separator?: never;
  isDecorative?: never;
}

export interface IMenuSeparator {
  separator: true;
  isDecorative?: boolean;
}
