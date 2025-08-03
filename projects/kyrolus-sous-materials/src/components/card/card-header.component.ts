import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from './card.component';

@Component({
  selector: 'ks-card-header',
  imports: [],
  template: `
    <ng-content select="[ksAvatar], img" />
    <div class="d-flex flex-column flex-1">
      <ng-content select="ks-card-title"></ng-content>
      <ng-content select="ks-card-subtitle"></ng-content>
    </div>
  `,
  styles: ``,
  host: {
    class:
      'd-flex flex-row justifuy-content-start align-items-center gap-3',
  },
})
export class CardHeaderComponent implements OnInit {
  readonly cardContainer = inject(CardComponent);
  ngOnInit(): void {
    if (!this.cardContainer) {
      throw new Error('Card Header must be used inside a Card');
    }
  }
}
