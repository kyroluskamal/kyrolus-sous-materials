import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
} from '@angular/core';
import { ButtonAppearance, ButtonSize, ButtonVariant } from './button.types';
import {
  BUTTON_APPEARANCE,
  BUTTON_BORDER_RADIUS_CLASS,
  BUTTON_IS_RAISED,
  BUTTON_RAISE_CLASS,
  BUTTON_SHAPE,
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '../../Tokens/button.tokens';

@Directive({
  selector: '[ksButton]',
  host: {
    '[class]': 'classes()',
  },
  standalone: true,
})
export class ButtonDirective {
  readonly size = input<ButtonSize>(inject(BUTTON_SIZE));
  readonly variant = input<ButtonVariant>(inject(BUTTON_VARIANT));
  readonly appearance = input<ButtonAppearance>(inject(BUTTON_APPEARANCE));
  readonly isRaised = input<boolean, string>(inject(BUTTON_IS_RAISED), {
    transform: booleanAttribute,
  });
  readonly borderRadius = input(inject(BUTTON_BORDER_RADIUS_CLASS));
  readonly shape = input(inject(BUTTON_SHAPE));
  readonly disabled = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  readonly RaisedClass = input(inject(BUTTON_RAISE_CLASS));

  classes = computed(() =>
    [
      'd-inline-flex',
      'f-align-items-center',
      'f-justify-content-center',
      'br-none',
      'cursor-pointer',
      'btn',
      this.borderRadius(),
      `btn${
        this.variant() !== 'solid' ? '-' + this.variant() : ''
      }-${this.appearance()}`,
      `btn-${this.size()}`,
      `${this.isRaised() ? this.RaisedClass() : 'elevation-0'}`,
      `btn-${this.shape()}`,
    ]
      .filter(Boolean)
      .join(' ')
  );
}
