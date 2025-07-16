import { Component } from '@angular/core';

@Component({
  selector: 'ks-dialog-content',
  imports: [],
  template: ` <ng-content /> `,
  host: { class: 'dialog-content' },
  styles: ``,
})
export class DialogContentComponent {}
