import {
  booleanAttribute,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  ButtonConfig,
  ButtonDirective,
  isNgDevMode,
} from '../../../public-api';
import { NgTemplateOutlet } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';
import { MENU_BUTTON_CONFIG } from '../../../Tokens/menu.tokens';
@Component({
  selector: 'ks-menu-item',
  imports: [ButtonDirective, NgTemplateOutlet],
  template: `
    @let btnConfig = buttonConfig();
    <!-- -->
    @if(!href() && !routerLink()) {
    <button
      ksButton
      disabled="{{ disabled() }}"
      [size]="btnConfig.size"
      [variant]="btnConfig.variant"
      [appearance]="btnConfig.appearance"
      isRaised="{{ btnConfig.isRaised }}"
      [borderRadius]="btnConfig.borderRadius ?? ''"
      [RaisedClass]="btnConfig.RaisedClass ?? ''"
      [shape]="btnConfig.shape"
      [attr.id]="btnConfig?.id ?? null"
      class="w-100 justify-content-between px-4"
    >
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    </button>
    }@else {
    <a
      ksButton
      disabled="{{ disabled() }}"
      [size]="btnConfig.size"
      [variant]="btnConfig.variant"
      [appearance]="btnConfig.appearance"
      isRaised="{{ btnConfig.isRaised }}"
      [borderRadius]="btnConfig.borderRadius ?? ''"
      [shape]="btnConfig.shape"
      [attr.id]="btnConfig?.id ?? null"
      [attr.routerLink]="routerLink() ? routerLink() : null"
      [attr.href]="href() ? href() : null"
      class="w-100 justify-content-between px-4"
      [RaisedClass]="btnConfig.RaisedClass ?? ''"
    >
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    </a>
    }

    <ng-template #content
      ><div class="d-flex flex-1 gap-3 align-items-center">
        <ng-content select="[ksIcon]"></ng-content>
        <ng-content select="*:not([ksIcon]):not(ks-badge)"></ng-content>
      </div>
      <ng-content select="ks-badge"></ng-content>
    </ng-template>
  `,
  styles: [``],
  host: {
    class: 'text-dark d-content',
    '[attr.role]': '"menuitem"',
  },

  standalone: true,
})
export class MenuItemComponent {
  readonly el = inject(ElementRef);
  readonly routerLink = input<string | any[]>();
  readonly href = input<string>();
  readonly buttonConfig = input<
    Omit<
      ButtonConfig,
      'disabled' | 'iconOptions' | 'isNotDecorativeIcon' | 'iconName'
    >
  >(inject(MENU_BUTTON_CONFIG));
  readonly disabled = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  readonly button = viewChild(ButtonDirective, {
    read: ElementRef,
  });
  readonly ksMenu = inject(MenuComponent, { host: true, optional: true });
  ngOnInit(): void {
    if (isNgDevMode && this.href() && this.routerLink())
      throw new Error(
        'MenuItem has both href and routerLink. Please choose one.'
      );
  }
  constructor() {
    if (isNgDevMode && !this.ksMenu) {
      throw new Error(
        this.el.nativeElement.outerHTML +
          '\n' +
          getErrorMessageForMenuItemNotInMenu('Item')
      );
    }
  }
}
