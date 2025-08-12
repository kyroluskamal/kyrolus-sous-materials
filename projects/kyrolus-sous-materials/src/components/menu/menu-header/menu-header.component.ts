import { booleanAttribute, Component, inject, input } from '@angular/core';
import {
  isNgDevMode,
  MenuComponent,
  PopoverMenuBlock,
  SeparatorDirective,
} from '../../../public-api';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';

@Component({
  selector: 'ks-menu-header',
  imports: [SeparatorDirective],
  template: `
    <ng-content />
    @if (useSeparator() && decorativeSeparator()) {
    <hr ksSeparator isDecorative class="flex-basis-100" />
    }@else if (useSeparator() && !decorativeSeparator()) {
    <hr ksSeparator class="flex-basis-100" />
    }
  `,
  styles: ``,
  host: {
    class: 'w-100 d-flex flex-wrap-wrap gap-2 py-5 fw-bold align-items-center',
    '[attr.role]': '"none"',
  },
})
export class MenuHeaderComponent {
  useSeparator = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  decorativeSeparator = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  ksMenu = inject(MenuComponent, { host: true, optional: true });
  ksPopOverMenu = inject(PopoverMenuBlock, { host: true, optional: true });

  constructor() {
    if (isNgDevMode && !this.ksMenu && !this.ksPopOverMenu) {
      throw new Error(getErrorMessageForMenuItemNotInMenu('Header'), {
        cause: this.ksMenu,
      });
    }
  }
}
