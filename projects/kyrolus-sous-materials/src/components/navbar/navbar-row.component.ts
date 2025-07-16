import { Component } from '@angular/core';

@Component({
  selector: 'ks-navbar-row',
  imports: [],
  template: ` <ng-content /> `,
  styles: ``,
  host: { class: 'd-flex flex-row' },
})
export class NavbarRowComponent {}
