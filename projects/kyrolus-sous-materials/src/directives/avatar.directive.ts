import { Directive } from '@angular/core';

@Directive({
  selector: '[ksAvatar]',
  host: {
    class: 'br-full object-fit-cover d-flex align-items-center flex-row',
  },
})
export class AvatarDirective {}
