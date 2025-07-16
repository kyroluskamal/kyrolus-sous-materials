import { Component, computed, input, output } from '@angular/core';
import { PaginatorOptions, PaginatorState } from './models';
@Component({
  selector: 'ks-paginator',
  imports: [],
  templateUrl: './paginator.component.html',
  styles: ``,
})
export class PaginatorComponent {
  readonly pageChange = output<PaginatorState>();

  readonly state = input<PaginatorState>({
    page: 0,
    pageSize: 10,
    totalItems: 0,
  });

  readonly options = input<PaginatorOptions>({
    pageSizeOptions: [10, 25, 50, 100],
    showFirstLastButtons: true,
    showPageSizeSelector: true,
    theme: 'light',
  });

  protected readonly totalPages = computed(() =>
    Math.ceil(this.state().totalItems / this.state().pageSize)
  );

  protected goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages()) return;

    const newState = {
      ...this.state(),
      page,
    };
    this.pageChange.emit(newState);
  }

  protected changePageSize(pageSize: number): void {
    const newState = {
      ...this.state(),
      pageSize,
      page: 0, // Reset to first page when changing page size
    };
    this.pageChange.emit(newState);
  }

  protected goToFirst(): void {
    this.goToPage(0);
  }

  protected goToLast(): void {
    this.goToPage(this.totalPages() - 1);
  }
}
