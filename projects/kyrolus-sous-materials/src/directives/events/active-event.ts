import {
  Directive,
  HostBinding,
  HostListener,
  Inject,
  input,
  DOCUMENT,
} from '@angular/core';
import { StopEvent } from '../stop-event';

@Directive({
  selector: '[ksActive]',
})
export class ActiveDirective extends StopEvent<Event> {
  useActiveEvent = input<boolean>(true);
  activeClasses = input<string>('');
  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    super();
    this.document.addEventListener('mouseup', (e) => {
      this.onMouseUp(e);
    });
  }

  @HostBinding('class')
  get activeClass() {
    return this.toggler() ? this.activeClasses() : '';
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: Event) {
    if (this.useActiveEvent()) this.toggler.set(true);
    else {
      this.toggler.set(false);
      this.stopEvent(event);
    }
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  onMouseUp(event: Event) {
    this.toggler.set(false);
  }
}
