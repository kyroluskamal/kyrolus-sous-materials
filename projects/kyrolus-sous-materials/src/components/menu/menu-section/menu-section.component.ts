import { Component, computed, ElementRef, inject, input } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { isNgDevMode } from '../../../helpers/constants/constants.exports';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';
import { UtilitiesService } from '../../../services/utilities.service';
import { PopoverMenuBlock } from '../../../public-api';

@Component({
  selector: 'ks-menu-section',
  imports: [],
  template: `
    @if(title()) {
    <span [id]="_id()">{{ title() }}</span>
    }
    <div role="group" [attr.aria-labelledby]="title() ? _id() : null">
      <ng-content select="ks-menu-item" />
      <ng-content select="[ksSeparator]" />
    </div>
  `,
  styles: ``,
  host: {
    class: 'd-block fw-bold',
    '[attr.role]': '"none"',
  },
})
export class MenuSectionComponent {
  readonly el = inject(ElementRef).nativeElement as HTMLElement;
  /* v8 ignore start */

  readonly title = input<string>();
  private readonly utitlitiesService = inject(UtilitiesService);
  readonly id = input<string>();
  _id = computed(() => {
    return (
      this.id()?.toLowerCase().replace(/\s/g, '-') ||
      this.utitlitiesService.generateUniqueId(
        this.title()?.replace(/\s/g, '-').toLowerCase()
      )
    );
  });
  /* v8 ignore end */

  readonly ksMenu = inject(MenuComponent, { host: true, optional: true });
  readonly popOverMenu = inject(PopoverMenuBlock, {
    host: true,
    optional: true,
  });
  constructor() {
    if (isNgDevMode) {
      if (!this.ksMenu && !this.popOverMenu) {
        throw new Error(getErrorMessageForMenuItemNotInMenu('Section'));
      }
    }
  }
}
