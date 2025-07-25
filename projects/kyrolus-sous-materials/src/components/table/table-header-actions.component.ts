import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { ButtonDirective } from '../../directives/button/button.directive';
import { TableHeaderActionsDirective } from '../../public-api';
import { IconDirective } from '../../directives/icon/icon.directive';

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
        'borderRadius',
        'disabled',
        'RaisedClass',
        'shape',
      ],
    },
    {
      directive: IconDirective,
      inputs: ['ksIcon', 'iconOptions'],
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
