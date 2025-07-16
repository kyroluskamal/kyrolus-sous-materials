import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';

export interface ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: ControlContainer | null
  ): boolean;
}

export class KsErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: ControlContainer | null
  ): boolean {
    const isSubmitted =
      form instanceof NgForm || form instanceof FormGroupDirective
        ? form.submitted
        : form ?? true;

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
