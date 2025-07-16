import { Component } from '@angular/core';

@Component({
  selector: 'ks-navbar-container',
  imports: [],
  template: ` <ng-content selector="ks-navbar-row" />`,
  host: {
    class: 'w-100 d-flex flex-column',
  },
  styles: ``,
})
export class NavbarContainerComponent {}
