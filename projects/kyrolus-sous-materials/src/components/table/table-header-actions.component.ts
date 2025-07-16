import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { ButtonDirective } from '../button/button.directive';
import { IconDirective, TableHeaderActionsDirective } from '../../public-api';

@Component({
  selector: 'ks-table-actions',
  imports: [],
  hostDirectives: [
    {
      directive: ButtonDirective,
      inputs: [
        'size',
        'variant',
        'appearance',
        'isRaised',
        'BorderRadius',
        'disabled',
        'RaisedClass',
        'ButtonShape',
      ],
    },
    {
      directive: IconDirective,
      inputs: ['ksIcon', 'iconType'],
    },
  ],
  template: `{{ label() }}`,
  styles: ``,
})
export class TableHeaderActionsComponent {
  readonly label = input<string>('');
  readonly el = inject(ElementRef);
  readonly directive = inject(TableHeaderActionsDirective, {
    optional: true,
  });
  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    this.directive?.onHeaderActionClick.emit({
      label: this.label(),
      elmentRef: this.el,
      event: event,
    });
  }
}
