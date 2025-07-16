import { signal } from '@angular/core';

export class StopEvent<TEventType extends Event> {
  protected toggler = signal<boolean>(false);
  stopEvent(event: TEventType) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}
