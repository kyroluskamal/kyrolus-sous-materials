export class KsColumnOptions {
  sortable?: boolean = true;
  filterable?: boolean = true;
  width?: string = 'auto';
  template?: any = null;
}
export type KsThemeColors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'light'
  | 'dark'
  | 'grey'
  | 'custom';
export type KsColumn<T> = {
  key: keyof T;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'date'
    | 'currency'
    | 'percent'
    | 'boolean'
    | 'action'
    | 'image'
    | 'link'
    | 'button'
    | 'icon'
    | 'custom';
  options?: KsColumnOptions;
};
export class KsTableOptions {
  sortable?: boolean = true;
  filterable?: boolean = true;
  pageable?: boolean = true;
  selectable?: boolean = false;
  expandable?: boolean = false;
  resizable?: boolean = true;
  reorderable?: boolean = false;
  exportable?: boolean = false;
  useActionColumn?: boolean = false;
  theme?: 'light' | 'dark' = 'light';
  layout?: 'compact' | 'comfortable' | 'full-width' = 'compact';
}
export class KsTableState<T> {
  sortField?: keyof T;
  sortOrder?: 'asc' | 'desc' = 'asc';
  filters: { [key: string]: any } = {};
  page: number = 0;
  pageSize: number = 10;
  selectedRows: any[] = [];
  expandedRows: any[] = [];
}

export type KsGridStyle =
  | 'row'
  | 'column'
  | 'both'
  | 'none'
  | 'first-column'
  | 'last-column'
  | 'first-last-column';
export type KsTableHoverStyle =
  | 'row'
  | 'column'
  | 'cell'
  | 'row-column'
  | 'none';
export type KsTableStripedStyle = 'row' | 'column' | 'both' | 'none';
export type KsTableHeaderStyle = 'background' | 'border' | 'both' | 'none';

export type KsTableGridAppearance = {
  gridStyle?: KsGridStyle;
  color?: KsThemeColors;
};

export type KsTableHoverAppearance = {
  hoverStyle?: KsTableHoverStyle;
  colorStyle?: 'dark-white-text' | 'light-black-text';
  color?: KsThemeColors;
};
export type KsTableStripedAppearance = {
  stripedStyle?: KsTableStripedStyle;
  color?: KsThemeColors;
};

export type KsTableHeaderAppearance = {
  headerStyle?: KsTableHeaderStyle;
  color?: KsThemeColors;
};

export class KsTableAppearance {
  grid?: KsTableGridAppearance = { gridStyle: 'row', color: 'dark' };
  hover?: KsTableHoverAppearance = {
    hoverStyle: 'row',
    color: 'dark',
    colorStyle: 'light-black-text',
  };
  striped?: KsTableStripedAppearance = { stripedStyle: 'row', color: 'light' };
  header?: KsTableHeaderAppearance = {
    headerStyle: 'background',
    color: 'dark',
  };
}
