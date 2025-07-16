import { Component } from '@angular/core';

@Component({
  selector: 'ks-dialog-header',
  imports: [],
  template: ` <ng-content select="[ksDialogTitle]" /> `,
  host: { class: 'dialog-header' },
  styles: [],
})
export class DialogHeaderComponent {}
