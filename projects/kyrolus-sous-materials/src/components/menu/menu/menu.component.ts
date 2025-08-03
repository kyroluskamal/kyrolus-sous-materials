import { Component } from '@angular/core';

@Component({
  selector: 'ks-menu',
  imports: [],
  template: `
    <ng-content selector="ks-menu-header"></ng-content>
    <ng-content selector="ks-menu-section" />

    <ng-content selector="ks-menu-item" />
    <ng-content selector="[ksSeparator]" />
    <ng-content selector=".ks-menu-footer"></ng-content>
  `,
  styles: [``],
  host: {
    class:
      'w-60 w-md-15rem h-fit-content bg-white br-r-3 br-grey-38 br-w-2 br-s-solid p-1',
  },
  standalone: true,
})
export class MenuComponent {}
