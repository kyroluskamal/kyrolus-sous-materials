import { inject, Renderer2, signal, ViewContainerRef } from '@angular/core';
import {
  BUTTON_APPEARANCE,
  BUTTON_BORDER_RADIUS_CLASS,
  BUTTON_IS_RAISED,
  BUTTON_RAISE_CLASS,
  BUTTON_SHAPE,
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '../../Tokens/button.tokens';
import { KsTableButtonConfig, TableComponent } from './table.exports';
import {
  ButtonAppearance,
  ButtonShape,
  ButtonVariant,
} from '../../directives/button/button.types';

export class TableActionsBaseDirective {
  readonly RaisedClass = signal(inject(BUTTON_RAISE_CLASS));
  readonly size = signal(inject(BUTTON_SIZE));
  readonly isRaised = signal<boolean>(inject(BUTTON_IS_RAISED));
  readonly BorderRadius = signal(inject(BUTTON_BORDER_RADIUS_CLASS));
  readonly variant = signal<ButtonVariant>(inject(BUTTON_VARIANT));
  readonly ButtonShape = signal<ButtonShape>(inject(BUTTON_SHAPE));
  readonly appearance = signal<ButtonAppearance>(inject(BUTTON_APPEARANCE));
  protected readonly tableComponent = inject(TableComponent);
  protected readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly renderer = inject(Renderer2);
  buttonInputs = [
    'label',
    'size',
    'variant',
    'appearance',
    'isRaised',
    'BorderRadius',
    'disabled',
    'RaisedClass',
    'ksIcon',
    'iconType',
    'ButtonShape',
  ];

  protected getInputValue(input: string, config: KsTableButtonConfig) {
    switch (input) {
      case 'label':
        return config.label;
      case 'size':
        return config.size ?? this.size() ?? 'med';
      case 'variant':
        return config.variant ?? this.variant() ?? 'solid';
      case 'appearance':
        return config.appearance ?? this.appearance() ?? 'primary';
      case 'isRaised':
        return config.isRaised ?? this.isRaised() ?? false;
      case 'BorderRadius':
        return config.BorderRadius ?? this.BorderRadius() ?? 'br-r-2';
      case 'disabled':
        return config.disabled ?? false;
      case 'RaisedClass':
        return config.RaisedClass ?? this.RaisedClass() ?? 'elevation-2';
      case 'ksIcon':
        return config.ksIcon ?? '';
      case 'iconType':
        return config.iconType ?? 'bi';
      case 'ButtonShape':
        return config.ButtonShape ?? this.ButtonShape() ?? 'rounded';
      default:
        return '';
    }
  }
}
