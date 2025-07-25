import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { TableActionsColumnDirective } from './table-actions-column.directive';
import { IconDirective } from '../../directives/icon/icon.directive';
import { ButtonDirective } from '../../public-api';

@Component({
  selector: 'ks-table-actions-column',
  imports: [],
  template: `{{ label() }}`,
  styles: ``,
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
})
export class TableActionsColumnComponent<T> {
  readonly label = input<string>('');
  readonly el = inject(ElementRef);
  readonly data = signal<T>({} as T);
  private readonly directive = inject(TableActionsColumnDirective, {
    optional: true,
  });
  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    if (this.directive) {
      this.directive?.onColumnActionClick.emit({
        label: this.label(),
        elmentRef: this.el,
        data: this.data(),
        event: event,
      });
    }
  }
}
