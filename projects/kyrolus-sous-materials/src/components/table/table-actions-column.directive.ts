import {
  AfterViewChecked,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { TableActionsBaseDirective } from './table-actions-base.directive';
import { KsTableButtonConfig, TABLE_COL_ACTIONS_BUTTON } from './table.exports';
import { TableActionsColumnComponent } from './table-actions-column.component';
export type KsTableColumnActionClickEvent<T> = {
  label: string;
  elmentRef: ElementRef;
  data: T;
  event?: MouseEvent;
};

export enum TableColumnActions {
  EDIT = 'edit',
  DELETE = 'delete',
  VIEW = 'view',
}
@Directive({
  selector: '[ksTableActionsColumn]',
})
export class TableActionsColumnDirective<T>
  extends TableActionsBaseDirective
  implements AfterViewChecked
{
  colActionsButtons = input<KsTableButtonConfig[]>(
    inject(TABLE_COL_ACTIONS_BUTTON)
  );
  buttons = linkedSignal(() =>
    this.colActionsButtons().sort((a, b) => a.order - b.order)
  );
  isReady = signal<boolean>(false);
  onColumnActionClick = output<KsTableColumnActionClickEvent<T>>();
  constructor() {
    super();
    this.tableComponent.options.update((options) => {
      return {
        ...options,
        useActionColumn: true,
      };
    });
  }
  dataSignal = computed(() => this.tableComponent.data());

  eff = effect(() => {
    if (this.isReady() && this.dataSignal()?.length > 0) {
      this.drawEveryThing();
    }
  });
  ngAfterViewChecked() {
    this.isReady.set(true);
  }
  drawEveryThing() {
    if (
      !this.tableComponent.actionColumnHeader()?.nativeElement ||
      this.tableComponent.columnActions().length === 0
    )
      return;
    this.tableComponent.columnActions().forEach((container, index) => {
      const rowData = this.tableComponent.data()[index];
      this.addActionButtons(container, rowData);
    });
  }

  private addActionButtons(container: ViewContainerRef, rowData: any) {
    container.clear();
    this.buttons().forEach((config) => {
      const componentRef = container.createComponent(
        TableActionsColumnComponent
      );

      // ضبط خصائص الزر
      this.buttonInputs.forEach((key) => {
        componentRef.setInput(key, this.getInputValue(key, config));
      });
      componentRef.instance.data.set(rowData);
    });
  }
}
