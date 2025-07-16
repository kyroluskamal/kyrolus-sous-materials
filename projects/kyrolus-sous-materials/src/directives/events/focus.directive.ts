import {
  Directive,
  HostBinding,
  HostListener,
  input,
  output,
} from '@angular/core';
import { StopEvent } from '../stop-event';

@Directive({
  selector: '[ksFocus]',
})
export class FocusDirective extends StopEvent<FocusEvent> {
  useFocus = input<boolean>(true);
  focusClasses = input.required<string>();
  onFocus = output<FocusEvent>();
  onBlur = output<FocusEvent>();
  constructor() {
    super();
  }
  @HostBinding('class')
  get focusClass() {
    return this.toggler() ? this.focusClasses() : '';
  }
  @HostListener('focus', ['$event'])
  private on_Focus(event: FocusEvent) {
    if (this.useFocus()) this.toggler.set(true);
    else {
      this.toggler.set(false);
      this.stopEvent(event);
    }
    this.onFocus.emit(event);
  }

  @HostListener('blur', ['$event']) private on_Blur(event: FocusEvent) {
    this.toggler.set(false);
    this.onBlur.emit(event);
  }
}
