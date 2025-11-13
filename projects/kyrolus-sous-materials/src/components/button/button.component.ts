import { Component } from '@angular/core';
import { ButtonDirective } from '../../public-api';

@Component({
  selector: 'ks-button',
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
  ],
  template: ``,
  styles: ``,
})
export class ButtonComponent {}
