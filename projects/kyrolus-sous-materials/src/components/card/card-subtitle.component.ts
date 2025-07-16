import { Component, inject } from '@angular/core';
import { CardHeaderComponent } from './card-header.component';

@Component({
  selector: 'ks-card-subtitle',
  imports: [],
  template: ` <ng-content>Add Subtitle</ng-content> `,
  styles: ``,
})
export class CardSubtitleComponent {
  readonly cardHeader = inject(CardHeaderComponent);
  ngOnInit(): void {
    if (!this.cardHeader) {
      throw new Error('Card Subtitle must be used inside a Card Header');
    }
  }
}
