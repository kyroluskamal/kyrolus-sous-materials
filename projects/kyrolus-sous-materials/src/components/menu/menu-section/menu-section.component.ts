import { Component, input } from '@angular/core';

@Component({
  selector: 'ks-menu-section',
  imports: [],
  template: ` {{ title() }} `,
  styles: ``,
  host: {
    class: 'd-block fw-bold',
    '[attr.role]': '"heading"',
  },
})
export class MenuSectionComponent {
  readonly title = input.required<string>();
}
