import { booleanAttribute, Component, inject, input } from '@angular/core';
import {
  isNgDevMode,
  MenuComponent,
  SeparatorDirective,
} from '../../../public-api';

@Component({
  selector: 'ks-menu-footer',
  imports: [SeparatorDirective],
  template: `
    @if (useSeparator() && decorativeSeparator()) {
    <hr ksSeparator isDecorative class="flex-basis-100" />
    }@else if (useSeparator() && !decorativeSeparator()) {
    <hr ksSeparator class="flex-basis-100" />
    }
    <ng-content />
  `,
  styles: ``,
  host: {
    class: 'w-100 d-flex flex-wrap-wrap gap-2 py-5 fw-bold align-items-center',
  },
})
export class MenuFooterComponent {
  useSeparator = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  decorativeSeparator = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  ksMenu = inject(MenuComponent, { host: true, optional: true });
  constructor() {
    if (isNgDevMode && !this.ksMenu) {
      throw new Error(
        'MenuFooterComponent must be used within a ks-menu component. Please ensure it is placed inside a ks-menu element.'
      );
    }
  }
}
