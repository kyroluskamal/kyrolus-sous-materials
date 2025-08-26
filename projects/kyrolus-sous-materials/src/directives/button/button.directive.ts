import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import {
  ButtonAppearance,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from './button.types';
import {
  BUTTON_APPEARANCE,
  BUTTON_BORDER_RADIUS_CLASS,
  BUTTON_IS_RAISED,
  BUTTON_RAISE_CLASS,
  BUTTON_SHAPE,
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '../../Tokens/button.tokens';
import { isNgDevMode } from '../../public-api';

@Directive({
  selector: '[ksButton]',
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'disabled() ? true : null',
    '[attr.aria-disabled]': 'disabled() ? true : null',
    '(click)': 'onClick($event)',
    '(keyup)': 'removeActiveAndFocus($event)',
  },
  standalone: true,
})
export class ButtonDirective {
  private readonly hostElement: HTMLElement = inject(ElementRef).nativeElement;
  private readonly renderer2 = inject(Renderer2);
  readonly size = input<ButtonSize>(inject(BUTTON_SIZE));
  readonly variant = input<ButtonVariant>(inject(BUTTON_VARIANT));
  readonly appearance = input<ButtonAppearance>(inject(BUTTON_APPEARANCE));
  readonly isRaised = input<boolean, string>(inject(BUTTON_IS_RAISED), {
    transform: booleanAttribute,
  });
  readonly borderRadius = input<string>(inject(BUTTON_BORDER_RADIUS_CLASS));
  readonly shape = input<ButtonShape>(inject(BUTTON_SHAPE));
  readonly disabled = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  readonly RaisedClass = input<string>(inject(BUTTON_RAISE_CLASS));
  onClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  removeActiveAndFocus(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.renderer2.removeClass(this.hostElement, 'active');
      this.renderer2.removeClass(this.hostElement, 'focus');
    }
  }
  classes = computed(() =>
    [
      'd-inline-flex',
      'align-items-center',
      'justify-content-center',
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
      .concat(this.disabled() ? ' disabled' : '')
  );
  ngOnInit(): void {
    if (isNgDevMode) {
      const tagName = this.hostElement.tagName.toUpperCase();
      if (tagName !== 'BUTTON' && tagName !== 'A') {
        console.warn(
          `[ksButton] Accessibility Warning:\n` +
            `You are using the 'ksButton' directive on a <${tagName.toLowerCase()}> element.\n\n` +
            `For proper accessibility, you MUST manually add the following:\n` +
            `  1. Role: role="button"\n` +
            `  2. Focus: tabindex="0"\n` +
            `  3. Keyboard Events: Handle (keydown.enter) and (keydown.space).\n` +
            `  4. Labeling: Use 'aria-label' if the button has no visible text.\n\n
            (use KsEnterKeyEventDirective and KsSpaceKeyKeyEventDirective)` +
            `Example:\n` +
            `<div ksButton role="button" tabindex="0" (keydown.enter)="..." aria-label="..."></div>\n\n` +
            `It is highly recommended to use <button> or <a> instead.`
        );
      }
    }
  }
}
