import { Component, inject } from '@angular/core';
import { CardHeaderComponent } from './card-header.component';
import { fontFamilies } from '../../helpers/constants/font.constants';

@Component({
  selector: 'ks-card-title',
  imports: [],
  template: ` <ng-content>Add Title</ng-content> `,
  styles: ``,
  host: { class: `fw-bold ${fontFamilies.BloggerSans}` },
})
export class CardTitleComponent {
  readonly cardHeader = inject(CardHeaderComponent);
  ngOnInit(): void {
    if (!this.cardHeader) {
      throw new Error('Card Title must be used inside a Card Header');
    }
  }
}
