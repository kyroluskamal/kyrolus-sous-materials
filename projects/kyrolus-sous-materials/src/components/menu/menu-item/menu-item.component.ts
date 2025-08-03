import {
  booleanAttribute,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ButtonDirective } from '../../../public-api';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ks-menu-item',
  imports: [ButtonDirective, NgTemplateOutlet],
  template: `
    @if(type() === 'button') {
    <button
      ksButton
      disabled="{{ disabled() }}"
      size="sm"
      variant="text"
      appearance="dark"
      class="w-100 justify-content-between px-4"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </button>
    }@else {
    <a
      ksButton
      disabled="{{ disabled() }}"
      size="sm"
      variant="text"
      appearance="dark"
      class="w-100 justify-content-between px-4"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </a>
    }

    <ng-template #content
      ><div class="d-flex flex-1 gap-3 align-items-center">
        <ng-content select="[ksIcon]"></ng-content>
        <ng-content select="*:not([ksicon]):not(ks-badge)"></ng-content>
      </div>
      <ng-content select="ks-badge"></ng-content>
    </ng-template>
  `,
  styles: [``],
  host: {
    class: 'text-dark d-block',
  },

  standalone: true,
})
export class MenuItemComponent {
  readonly type = input<'button' | 'a'>('button');
  readonly el = inject(ElementRef);
  readonly disabled = input<boolean, string>(false, {
    transform: booleanAttribute,
  });

  readonly button = viewChild(ButtonDirective, {
    read: ElementRef,
  });
}
