import { afterNextRender, Directive, inject } from '@angular/core';
import { SimpleKeyEventDirective } from '../simple-key-event/simple-key-event.directive';

@Directive({
  selector: '[ksSpaceKeyEvent]',
  hostDirectives: [
    {
      directive: SimpleKeyEventDirective,
      inputs: ['actions', 'targetToFocus', 'preventDefault'],
    },
  ],
})
export class SpaceKeyEventDirective {
  private readonly keyBindings = inject(SimpleKeyEventDirective);

  constructor() {
    afterNextRender(() => {
      this.keyBindings.key.set(' ');
    });
  }
}
