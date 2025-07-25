import { Directive } from '@angular/core';
import { ButtonDirective } from '../button/button.directive';
import { IconDirective } from '../icon/icon.directive';

@Directive({
  selector: '[ksToggleButton]',
  hostDirectives: [
    {
      directive: ButtonDirective,
      inputs: [
        'size',
        'variant',
        'appearance',
        'isRaised',
        'borderRadius',
        'shape',
        'disabled',
        'RaisedClass',
      ],
    },
    {
      directive: IconDirective,
      inputs: ['iconType', 'ksIcon'],
    },
  ],
  standalone: true,
})
export class ToggleButtonDirective {
  constructor() {}
}
