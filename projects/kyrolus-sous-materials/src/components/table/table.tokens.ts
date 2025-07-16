import { InjectionToken } from '@angular/core';
import { KsTableAppearance, KsTableOptions, KsTableState } from './models';
import {
  KsTableButtonConfig,
  TableHeaderActions,
} from './table-header-actions.directive';
import { TableColumnActions } from './table-actions-column.directive';

export const TABLE_OPTIONS = new InjectionToken<KsTableOptions>(
  'TABLE_OPTIONS',
  {
    providedIn: 'any',
    factory: () => new KsTableOptions(),
  }
);
export const TABLE_STATE = new InjectionToken<KsTableState<any>>(
  'TABLE_STATE',
  {
    providedIn: 'any',
    factory: () => new KsTableState(),
  }
);
export const TABLE_APPEARANCE = new InjectionToken<KsTableAppearance>(
  'TABLE_APPEARANCCE',
  {
    providedIn: 'any',
    factory: () => new KsTableAppearance(),
  }
);
export const TABLE_COL_ACTIONS_BUTTON = new InjectionToken<
  KsTableButtonConfig[]
>('TABLE_COL_ACTIONS_BUTTON', {
  providedIn: 'any',
  factory: () => [
    {
      label: TableColumnActions.EDIT,
      ksIcon: 'pen',
      size: 'sm',
      ButtonShape: 'circle',
      variant: 'ghost',
      order: 1,
    },
    {
      label: TableColumnActions.DELETE,
      ksIcon: 'trash',
      size: 'sm',
      variant: 'ghost',
      appearance: 'danger',
      ButtonShape: 'circle',
      order: 2,
    },
    {
      label: TableColumnActions.VIEW,
      ksIcon: 'eye',
      size: 'sm',
      variant: 'ghost',
      ButtonShape: 'circle',
      order: 0,
    },
  ],
});
export const TABLE_HEADER_ACTIONS_BUTTON = new InjectionToken<
  KsTableButtonConfig[]
>('TABLE_HEADER_ACTIONS_BUTTON', {
  providedIn: 'any',
  factory: () => [
    {
      label: TableHeaderActions.ADD,
      size: 'sm',
      order: 0,
    },
  ],
});
