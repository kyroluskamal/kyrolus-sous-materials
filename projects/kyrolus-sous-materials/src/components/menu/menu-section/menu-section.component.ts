import { Component, computed, inject, input } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { isNgDevMode } from '../../../helpers/constants/constants.exports';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'ks-menu-section',
  imports: [],
  template: `
    @if(title()) {
    <p [id]="_id()">{{ title() }}</p>
    }
    <div role="group" [attr.arialabelledby]="title() ? _id() : null">
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

  ksMenu = inject(MenuComponent, { host: true, optional: true });
  constructor() {
    if (isNgDevMode && !this.ksMenu) {
      throw new Error(getErrorMessageForMenuItemNotInMenu('Section'));
    }
  }
}
