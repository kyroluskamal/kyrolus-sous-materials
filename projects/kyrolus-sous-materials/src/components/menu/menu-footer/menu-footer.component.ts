import { booleanAttribute, Component, inject, input } from '@angular/core';
import {
  isNgDevMode,
  MenuComponent,
  PopoverMenuBlock,
  SeparatorDirective,
} from '../../../public-api';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';

@Component({
  selector: 'ks-menu-footer',
  imports: [SeparatorDirective],
  template: `
    @if (useSeparator() ) {
    <hr
      ksSeparator
      isDecorative="{{ decorativeSeparator() }}"
      class="flex-basis-100"
    />
    }
    <ng-content select="*:not([ksSeparator]),*:not(hr)" />
  `,
  styles: ``,
  host: {
    class: 'w-100 d-flex flex-wrap-wrap gap-2 py-5 fw-bold align-items-center',
    role: 'none',
  },
})
export class MenuFooterComponent {
  /* v8 ignore start */
  useSeparator = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  decorativeSeparator = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  /* v8 ignore end */

  readonly ksMenu = inject(MenuComponent, { host: true, optional: true });
  readonly ksPopOverMenu = inject(PopoverMenuBlock, {
    host: true,
    optional: true,
  });

  constructor() {
    if (isNgDevMode && !this.ksMenu && !this.ksPopOverMenu) {
      throw new Error(getErrorMessageForMenuItemNotInMenu('Footer'));
    }
  }
}
