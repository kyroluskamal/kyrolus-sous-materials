import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  PLATFORM_ID,
  signal,
  viewChild,
  viewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  KsColumn,
  KsTableAppearance,
  KsTableGridAppearance,
  KsTableHeaderAppearance,
  KsTableHoverAppearance,
  KsTableOptions,
  KsTableState,
  KsTableStripedAppearance,
} from './models';
import { PaginatorState } from '../paginator/models';
import { PaginatorComponent } from '../paginator/paginator.component';
import { TABLE_APPEARANCE, TABLE_OPTIONS, TABLE_STATE } from './table.tokens';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { TableColumnHoverDirective } from './table-column-hover.directive';
import { IconDirective } from '../../directives/icon/icon.directive';
@Component({
  selector: 'ks-table',
  imports: [
    PaginatorComponent,
    NgTemplateOutlet,
    IconDirective,
    TableColumnHoverDirective,
  ],
  templateUrl: './table.component.html',
  styles: ``,
})
export class TableComponent<T> {
  columns = input.required<KsColumn<T>[]>();
  actionsButtons = viewChild('tableActions', {
    read: ViewContainerRef,
  });
  actionColumnHeader = viewChild('actionColumnHeader', {
    read: ElementRef<HTMLDivElement>,
  });
  columnActions = viewChildren('columnActions', {
    read: ViewContainerRef,
  });
  data = input.required<T[]>();
  tableOptions = input<KsTableOptions>(inject(TABLE_OPTIONS));
  options = linkedSignal(() => this.tableOptions());
  useAddButton = input<boolean>(true);
  appearance = input<KsTableAppearance>(inject(TABLE_APPEARANCE));
  gridAppearance = input<KsTableGridAppearance>({});
  headerAppearance = input<KsTableHeaderAppearance>({});
  stripedAppearance = input<KsTableStripedAppearance>({});
  hoverAppearance = input<KsTableHoverAppearance>({});
  // Signals for reactive state management
  tableClasses = signal<string>('');
  tableStyle = signal<{ [k in keyof CSSStyleDeclaration]?: string }>({});
  protected state = signal<KsTableState<T>>(inject(TABLE_STATE));
  gridStyle = computed(() => {
    const gridStyle =
      this.gridAppearance().gridStyle ??
      this.appearance().grid?.gridStyle ??
      'row';
    const color =
      this.gridAppearance().color ?? this.appearance().grid?.color ?? 'dark';
    return {
      'grid-row': gridStyle === 'row',
      'grid-column': gridStyle === 'column',
      'grid-both': gridStyle === 'both',
      'grid-none': gridStyle === 'none',
      [`br-${color}`]: !!color,
    };
  });
  hoverStyle = computed(() => {
    const hoverStyle =
      this.hoverAppearance().hoverStyle ??
      this.appearance().hover?.hoverStyle ??
      'none';
    return hoverStyle;
  });
  isRowHover = computed(() => this.hoverStyle() === 'row');
  isColumnHover = computed(() => this.hoverStyle() === 'column');
  isCellHover = computed(() => this.hoverStyle() === 'cell');
  isRowColumnHover = computed(() => this.hoverStyle() === 'row-column');

  hoverColor = computed(() => {
    if (this.isHoverDisabled()) return '';
    const color =
      this.hoverAppearance().color ?? this.appearance().hover?.color ?? 'dark';
    return `bg-hover-${color}${this.isLightHoverStyle() ? '-36' : ''}`;
  });
  isDarkhoverStyle = computed(() => {
    return this.hoverColorStyle() === 'dark-white-text';
  });
  isHoverDisabled = computed(() => {
    return this.hoverStyle() === 'none';
  });
  isLightHoverStyle = computed(() => {
    return this.hoverColorStyle() === 'light-black-text';
  });
  hoverColorStyle = computed(() => {
    const colorStyle =
      this.hoverAppearance().colorStyle ?? this.appearance().hover?.colorStyle;
    return colorStyle;
  });
  tdStyle = computed(() => {
    return {
      ...this.gridStyle(),
      [this.hoverColor()]: this.isCellHover(),
    };
  });
  // Computed values
  protected displayData = computed(() => {
    if (!this.data()) return [];
    let data = [...this.data()];

    // Apply filters
    data = this.applyFilters(data);

    // Apply sorting
    data = this.applySorting(data);

    // Apply pagination
    return this.applyPagination(data);
  });

  protected paginatorState = computed<PaginatorState>(() => ({
    page: this.currentPage(),
    pageSize: this.pageSize(),
    totalItems: this.filteredData().length,
  }));

  // New signals for pagination
  protected currentPage = signal(0);
  protected pageSize = signal(10);
  protected filteredData = computed(() => {
    if (!this.data()) return [];
    let data = [...this.data()];
    data = this.applyFilters(data);
    data = this.applySorting(data);
    return data;
  });

  // Table operations
  protected sort(column: KsColumn<T>): void {
    if (!column.options?.sortable) return;

    const currentState = this.state();
    const newState = { ...currentState };

    if (newState.sortField === column.key) {
      newState.sortOrder = newState.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      newState.sortField = column.key;
      newState.sortOrder = 'asc';
    }

    this.state.set(newState);
  }

  protected filter(column: KsColumn<T>, value: any): void {
    const currentState = this.state();
    const newState = {
      ...currentState,
      filters: {
        ...currentState.filters,
        [column.key]: value,
      },
    };
    this.state.set(newState);
  }

  protected selectRow(row: any): void {
    const currentState = this.state();
    const selectedRows = [...currentState.selectedRows];
    const index = selectedRows.indexOf(row);

    if (index === -1) {
      selectedRows.push(row);
    } else {
      selectedRows.splice(index, 1);
    }

    this.state.set({ ...currentState, selectedRows });
  }

  protected toggleExpand(row: any): void {
    const currentState = this.state();
    const expandedRows = [...currentState.expandedRows];
    const index = expandedRows.indexOf(row);

    if (index === -1) {
      expandedRows.push(row);
    } else {
      expandedRows.splice(index, 1);
    }

    this.state.set({ ...currentState, expandedRows });
  }

  // Pagination handler
  protected onPageChange(newState: PaginatorState): void {
    this.currentPage.set(newState.page);
    this.pageSize.set(newState.pageSize);
  }

  // Helper methods
  private applyFilters(data: any[]): any[] {
    const filters = this.state().filters;
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key])
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });
  }

  private applySorting(data: any[]): any[] {
    const { sortField, sortOrder } = this.state();
    if (!sortField || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  private applyPagination(data: any[]): any[] {
    const start = this.currentPage() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  }

  // Export methods
  exportCSV(): void {
    if (!this.data()) return;
    const data = this.data();
    const columns = this.columns();
    const csvContent = this.generateCSV(data, columns);
    if (isPlatformBrowser(inject(PLATFORM_ID)))
      this.downloadFile(csvContent, 'table-export.csv', 'text/csv');
  }

  private generateCSV(data: any[], columns: KsColumn<T>[]): string {
    const header = columns.map((col) => col.label).join(',');
    const rows = data.map((row) =>
      columns.map((col) => row[col.key]).join(',')
    );
    return [header, ...rows].join('\n');
  }

  private downloadFile(
    content: string,
    fileName: string,
    contentType: string
  ): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
