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
import { UtilitiesService } from '../../services/utilities.service';
import { PopoverPlacement } from './popover.types';
import { NgTemplateOutlet } from '@angular/common';
import { ToggleButtonDirective } from '../../directives/toggle-button/toggle-button.directive';
import { MenuModule } from '../../components/menu/menu-module';
import { SeparatorDirective } from '../../directives/separator/separator.directive';
import { IconDirective } from '../../directives/icon/icon.directive';
import { ButtonDirective } from '../../directives/button/button.directive';
import { FloatingUIDirective } from '../../directives/floating-ui/floating-ui.directive';
import { KsMenu } from '../../components/menu/menu.types';
import { MenuComponent } from '../../components/menu/menu/menu.component';
import { MenuAriaHandlingDirective } from '../../components/menu/menu-aria-handling/menu-aria-handling.directive';

@Component({
  selector: 'ks-popover-menu',
  imports: [
    ToggleButtonDirective,
    MenuModule,
    SeparatorDirective,
    IconDirective,
    ButtonDirective,
    FloatingUIDirective,
    NgTemplateOutlet,
    MenuAriaHandlingDirective
],
  templateUrl: './popover-menu.block.html',
  host: {
    '[attr.role]': '"none"',
    class: 'position-relative d-inline-block',
  },
  styles: ``,
})
export class PopoverMenuBlock {
  /* v8 ignore start */
  readonly elementRef = inject(ElementRef).nativeElement as HTMLElement;
  readonly ksMenu = input<KsMenu>(new KsMenu([]));
  readonly isOpen = model<boolean>(false);

  readonly toggleButton = viewChild(ToggleButtonDirective, {
    read: ElementRef,
  });

  private readonly menuElement = viewChild(MenuComponent, {
    read: ElementRef,
  });
  readonly toggleButtonTemplate = input<TemplateRef<any>>();
  readonly customToggleButtonTemplate = viewChild(
    'customToggleButtonTemplate',
    {
      read: ElementRef,
    }
  );
  private readonly renderer2 = inject(Renderer2);
  readonly utilitiesService = inject(UtilitiesService);
  readonly ariaMenuid = this.utilitiesService.generateUniqueId('popover-menu');
  readonly placement = model<PopoverPlacement>('top-start');
  /* v8 ignore end */
  constructor() {
    afterEveryRender(() => {
      if (this.toggleButtonTemplate() && this.customToggleButtonTemplate()) {
        this.renderer2.setAttribute(
          this.customToggleButtonTemplate()?.nativeElement.children[0],
          'aria-controls',
          this.ariaMenuid
        );
      }
      if (this.ksMenu()?.options?.separatorClasses && this.elementRef) {
        const separators = this.elementRef.querySelectorAll('hr[ksSeparator]');
        let classes = this.ksMenu()?.options?.separatorClasses?.split(' ');
        separators.forEach((separator) => {
          classes?.forEach((cls) => {
            this.renderer2.addClass(separator, cls);
          });
        });
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }
}
