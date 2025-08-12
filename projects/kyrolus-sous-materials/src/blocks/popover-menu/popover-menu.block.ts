import { animate, style, transition, trigger } from '@angular/animations';
import {
  afterEveryRender,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  Renderer2,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  ButtonDirective,
  FloatingUIDirective,
  IconDirective,
  KsMenu,
  MenuComponent,
  MenuModule,
  SeparatorDirective,
  ToggleButtonDirective,
} from '../../public-api';
import { UtilitiesService } from '../../services/utilities.service';
import { PopoverPlacement } from './popover.types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ks-popover-menu',
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.25)',
        }),
        animate(
          '100ms ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '75ms ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.25)',
          })
        ),
      ]),
    ]),
  ],
  imports: [
    ToggleButtonDirective,
    MenuModule,
    SeparatorDirective,
    IconDirective,
    ButtonDirective,
    FloatingUIDirective,
    NgTemplateOutlet,
  ],
  templateUrl: './popover-menu.block.html',
  host: {
    '[attr.role]': '"none"',
  },
  styles: ``,
})
export class PopoverMenuBlock {
  readonly elementRef = inject(ElementRef).nativeElement as HTMLElement;
  readonly toggleButton = viewChild(ToggleButtonDirective, {
    read: ElementRef,
  });

  private readonly menuElement = viewChild(MenuComponent, {
    read: ElementRef,
  });
  readonly ksMenu = input<KsMenu>(new KsMenu([]));
  readonly toggleButtonTemplate = input<TemplateRef<any>>();
  private readonly renderer2 = inject(Renderer2);
  readonly utilitiesService = inject(UtilitiesService);
  id = this.utilitiesService.generateUniqueId('popover-menu');
  readonly placement = model<PopoverPlacement>('top-start');
  constructor() {
    afterEveryRender(() => {
      this.adjusePlacement();
    });
  }

  readonly isOpen = model<boolean>(false);
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  private adjusePlacement() {
    let isRightOrLeft = ['right', 'left'].includes(this.placement());
    let isTopOrBottom = ['top', 'bottom'].includes(this.placement());
    let styleName: string | null;
    if (isRightOrLeft) {
      styleName = 'top';
    } else if (isTopOrBottom) {
      styleName = 'left';
    } else {
      styleName = null;
    }
    let offsetName: string | null;
    if (isRightOrLeft) {
      offsetName = 'offsetWidth';
    } else if (isTopOrBottom) {
      offsetName = 'offsetHeight';
    } else {
      offsetName = null;
    }
    if (!styleName || !offsetName) return;
    if (this.menuElement()?.nativeElement)
      this.renderer2.setStyle(
        this.menuElement()?.nativeElement,
        styleName,
        `${
          this.toggleButton()?.nativeElement[offsetName] / 2 -
          this.menuElement()?.nativeElement[offsetName] / 2
        }px`
      );
  }
}
