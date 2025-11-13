import {
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'ks-menu',
  imports: [],
  template: `
      <ng-content select="ks-menu-header" />
      <ng-content select="ks-menu-section" />
      <ng-content select="ks-menu-item" />
      <ng-content select="[ksSeparator]" />
      <ng-content select="ks-menu-footer" />
      <ng-content />
  `,
  styles: [``],
  host: {
    class:
      'w-60 w-md-15rem h-fit-content bg-white br-r-3 br-grey-38 br-w-2 br-s-solid p-1',
    role: 'menu',
    '[aria-label]': 'ariaLabel()',
    '[aria-orientation]': '"vertical"',
  },
  standalone: true,
})
export class MenuComponent {
  /* v8 ignore next */
  readonly ariaLabel = input('Menu');
  el = inject(ElementRef);
}
