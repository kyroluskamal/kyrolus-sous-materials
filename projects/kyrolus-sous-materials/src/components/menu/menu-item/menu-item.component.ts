import {
  booleanAttribute,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import {
  KsMenuItemButtonConfig,
  ButtonDirective,
  isNgDevMode,
  ItemClickEvent,
} from '../../../public-api';
import { NgTemplateOutlet } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';
import { MENU_BUTTON_CONFIG } from '../../../Tokens/menu.tokens';
import { PopoverMenuBlock } from '../../../blocks/popover-menu/popover-menu.block';
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
      [size]="btnConfig.size!"
      [variant]="btnConfig.variant!"
      [appearance]="btnConfig.appearance!"
      isRaised="{{ btnConfig.isRaised }}"
      [borderRadius]="btnConfig.borderRadius ?? ''"
      [RaisedClass]="btnConfig.RaisedClass ?? ''"
      [shape]="btnConfig.shape!"
      [attr.id]="btnConfig.id ?? null"
      class="w-100 justify-content-between px-4"
      (click)="clicked($event)"
    >
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    </button>
    }@else {
    <a
      ksButton
      disabled="{{ disabled() }}"
      [size]="btnConfig.size!"
      [variant]="btnConfig.variant!"
      [appearance]="btnConfig.appearance!"
      isRaised="{{ btnConfig.isRaised }}"
      [borderRadius]="btnConfig.borderRadius ?? ''"
      [shape]="btnConfig.shape!"
      [attr.routerLink]="routerLink() ? routerLink() : null"
      [attr.href]="href() ? href() : null"
      [attr.id]="btnConfig.id ?? null"
      (click)="clicked($event)"
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
export class MenuItemComponent implements OnInit {
  readonly el = inject(ElementRef);
  /* v8 ignore start */
  readonly routerLink = input<string | any[]>();
  readonly href = input<string>();
  readonly itemClcik = output<ItemClickEvent>();
  readonly buttonConfig = input<KsMenuItemButtonConfig>(
    inject(MENU_BUTTON_CONFIG)
  );
  readonly disabled = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  readonly button = viewChild(ButtonDirective, {
    read: ElementRef,
  });
  /* v8 ignore end */

  readonly ksMenu = inject(MenuComponent, { host: true, optional: true });
  readonly popOverMenu = inject(PopoverMenuBlock, {
    host: true,
    optional: true,
  });
  clicked(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.itemClcik.emit({
        event,
        itemRef: this.el.nativeElement,
        buttonRef: this.button()?.nativeElement,
      });
    }
  }
  ngOnInit(): void {
    if (isNgDevMode && this.href() && this.routerLink())
      throw new Error(
        'MenuItem has both href and routerLink. Please choose one.'
      );
  }
  constructor() {
    if (isNgDevMode && !this.ksMenu && !this.popOverMenu) {
      throw new Error(
        this.el.nativeElement.outerHTML +
          '\n' +
          getErrorMessageForMenuItemNotInMenu('Item')
      );
    }
  }
}
