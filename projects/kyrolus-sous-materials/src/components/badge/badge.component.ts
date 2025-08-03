import { Component } from '@angular/core';
import { IconDirective } from '../../public-api';

@Component({
  selector: 'ks-badge',
  imports: [IconDirective],
  template: `
    <div
      ksBadge
      class="d-flex align-items-center bg-grey-37 p-3 br-r-2 text-dark-18"
    >
      <span
        class="fsi-2"
        ksIcon="keyboard_command_key"
        [iconOptions]="{ provider: 'google' }"
      ></span
      >+N
    </div>
  `,
  styles: ``,
  host: {
    class: 'd-block py-2',
  },
})
export class BadgeComponent {}
