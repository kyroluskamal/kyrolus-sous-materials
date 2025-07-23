import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TableHeaderActionsComponent } from './table-header-actions.component';
import {
  ButtonAppearance,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '../../directives/button/button.types';
import { TableActionsBaseDirective } from './table-actions-base.directive';
import { TABLE_HEADER_ACTIONS_BUTTON } from './table.tokens';
export type KsTableButtonConfig = {
  label: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  isRaised?: boolean;
  BorderRadius?: string;
  disabled?: boolean;
  RaisedClass?: string;
  ButtonShape?: ButtonShape;
  ksIcon?: string;
  iconType?: string;
  order: number;
};
export type KsTableHeaderActionClickEvent = {
  label: string;
  elmentRef: ElementRef;
  event?: MouseEvent;
};
export enum TableHeaderActions {
  ADD = 'Add',
  DELETE = 'Delete',
  EDIT = 'Edit',
  VIEW = 'View',
}
@Directive({
  selector: '[ksTableHeaderActions]',
})
export class TableHeaderActionsDirective extends TableActionsBaseDirective {
  readonly headerActions = input<KsTableButtonConfig[]>(
    inject(TABLE_HEADER_ACTIONS_BUTTON)
  );
  onHeaderActionClick = output<KsTableHeaderActionClickEvent>();
  private readonly isReady = signal<boolean>(false);
  constructor() {
    super();
  }
  eff = effect(() => {
    if (this.isReady()) {
      this.addButtons();
    }
  });
  ngAfterViewChecked() {
    this.isReady.set(true);
  }

  addButtons() {
    if (!this.tableComponent.actionsButtons()) return;
    this.headerActions().forEach((config) => {
      const componentRef = this.tableComponent
        .actionsButtons()
        ?.createComponent(TableHeaderActionsComponent);

      this.buttonInputs.forEach((key) => {
        componentRef?.setInput(key, this.getInputValue(key, config));
      });
    });
  }
}
