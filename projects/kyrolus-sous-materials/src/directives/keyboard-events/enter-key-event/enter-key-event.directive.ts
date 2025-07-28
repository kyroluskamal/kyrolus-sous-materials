import { afterNextRender, Directive, inject } from '@angular/core';
import { SimpleKeyEventDirective } from '../simple-key-event/simple-key-event.directive';

@Directive({
  selector: '[ksEnterKeyEvent]',
  hostDirectives: [
    {
      directive: SimpleKeyEventDirective,
      inputs: ['actions', 'targetToFocus', 'preventDefault'],
    },
  ],
  standalone: true,
})
export class EnterKeyEventDirective {
  private readonly keyBindings = inject(SimpleKeyEventDirective);

  constructor() {
    afterNextRender(() => {
      this.keyBindings.key.set('enter');
    });
  }
}
