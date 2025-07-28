import {
  booleanAttribute,
  Directive,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import {
  KeyAction,
  KeyBindingsDirective,
} from '../key-bindings/key-bindings.directive';

@Directive({
  selector: '[ksSimpleKeyEvent]',
  hostDirectives: [KeyBindingsDirective],
  standalone: true,
})
export class SimpleKeyEventDirective {
  private readonly keyBindings = inject(KeyBindingsDirective);
  readonly key = model<string>(' ');
  readonly actions = input<KeyAction | KeyAction[]>('click');
  readonly targetToFocus = input<string>();
  readonly preventDefault = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  constructor() {
    effect(() => {
      this.keyBindings.ksKeyBindings.set([
        {
          key: this.key(),
          keyAction: this.actions(),
          targetToFocus: this.targetToFocus(),
          preventDefault: this.preventDefault(),
        },
      ]);
    });
  }
}
