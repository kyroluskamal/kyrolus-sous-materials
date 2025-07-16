import { Directive } from '@angular/core';

@Directive({
  selector: '[ksDialogTitle]',
  host: { class: 'dialog-title' },
})
export class DialogTitleDirective {
  constructor() {}
}
