import { Component } from '@angular/core';

@Component({
  selector: 'ks-dashboard-content',
  template: ` <ng-content /> `,
  host: { class: 'h-100 w-100 d-flex p-19' },
  styles: `

  `,
})
export class DashboardContentComponent {}
