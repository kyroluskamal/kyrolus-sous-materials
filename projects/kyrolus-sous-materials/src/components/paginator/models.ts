export interface PaginatorState {
  page: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginatorOptions {
  pageSizeOptions?: number[];
  showFirstLastButtons?: boolean;
  showPageSizeSelector?: boolean;
  theme?: 'light' | 'dark';
}
