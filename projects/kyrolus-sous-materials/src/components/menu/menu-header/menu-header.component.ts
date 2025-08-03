import { booleanAttribute, Component, input } from '@angular/core';
import { SeparatorDirective } from '../../../public-api';

@Component({
  selector: 'ks-menu-header',
  imports: [SeparatorDirective],
  template: `
    <ng-content />
    @if (useSeparator()) {
    <hr ksSeparator isDecorative class="flex-basis-100" />
    }
  `,
  styles: ``,
  host: {
    class: 'w-100 d-flex flex-wrap-wrap gap-2 py-5 fw-bold align-items-center',
    '[attr.role]': '"heading"',
    '[attr.aria-label]': '"Menu Header"',
  },
})
export class MenuHeaderComponent {
  useSeparator = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
}
