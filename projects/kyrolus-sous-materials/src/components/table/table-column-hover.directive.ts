import {
  Directive,
  ElementRef,
  HostListener,
  input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[ksTableColumnHover]',
})
export class TableColumnHoverDirective {
  readonly ksTableColumnHover = input<string>(''); // Default class
  readonly colorStyle = input<'dark-white-text' | 'light-black-text'>(
    'light-black-text'
  ); // Default color style
  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    if (!this.ksTableColumnHover()) return;
    const cellIndex = (event.target as HTMLTableCellElement).cellIndex;
    const table = this.el.nativeElement.closest('table');
    const rows = table.querySelectorAll('tr') as HTMLTableRowElement[];
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells[cellIndex]) {
        this.renderer.addClass(cells[cellIndex], this.ksTableColumnHover());
        this.renderer.addClass(cells[cellIndex], this.colorStyle());
      }
      row.querySelectorAll('th').forEach((th, index) => {
        if (index === cellIndex) {
          this.renderer.addClass(th, this.ksTableColumnHover());
          this.renderer.addClass(th, this.colorStyle());
        }
      });
    });
  }

  @HostListener('mouseout')
  onMouseOut() {
    if (!this.ksTableColumnHover()) return;
    const table = this.el.nativeElement.closest('table');
    const cells = table.querySelectorAll(
      `.${this.ksTableColumnHover()}`
    ) as HTMLTableCellElement[];

    cells.forEach((cell) => {
      this.renderer.removeClass(cell, this.ksTableColumnHover()); // إزالة الـ class عند خروج الماوس
      this.renderer.removeClass(cell, this.colorStyle()); // إزالة الـ class عند خروج الماوس
    });
  }
}
