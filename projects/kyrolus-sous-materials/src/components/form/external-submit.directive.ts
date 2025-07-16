import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { FormComponent } from './form.component';

@Directive({
  selector: '[ksExternalSubmit]',
})
export class ExternalSubmitDirective {
  ksExternalSubmit = input<FormComponent | null>(null);
  el = inject(ElementRef);

  @HostListener('click', ['$event'])
  handleClick(event: Event): void {
    event.preventDefault();
    if (this.ksExternalSubmit) {
      const formElement =
        this.ksExternalSubmit()?.formElementRef()?.nativeElement;

      if (formElement instanceof HTMLFormElement) {
        // التحقق من صحة النموذج إذا كان صالحًا قبل الإرسال
        formElement.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true })
        );
      }
    }
  }
}
