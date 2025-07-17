import { Directive, HostBinding, HostListener, input } from '@angular/core';
import { StopEvent } from '../stop-event';

@Directive({
  selector: '[ksHover]',
})
export class HoverDirective extends StopEvent<MouseEvent> {
  hoverClasses = input.required<string>();
  useHoverEffect = input<boolean>(true);

  constructor() {
    super();
  }

  @HostBinding('class')
  private get hoverClass() {
    return this.toggler() ? this.hoverClasses : '';
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    if (this.useHoverEffect()) this.toggler.set(true);
    else {
      this.toggler.set(false);
      this.stopEvent(event);
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.toggler.set(false);
  }
}
