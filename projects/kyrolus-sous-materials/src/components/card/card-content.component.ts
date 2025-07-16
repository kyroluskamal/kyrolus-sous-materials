import { Component, inject } from '@angular/core';
import { CardComponent } from './card.component';

@Component({
  selector: 'ks-card-content',
  imports: [],
  template: `
    <ng-content
      ><div class="w-100 h-100 d-flex flex-row f-justify-content-center"></div
    ></ng-content>
  `,
  styles: ``,
  host: { class: 'flex-1' },
})
export class CardContentComponent {
  readonly cardContainer = inject(CardComponent);
  ngOnInit(): void {
    if (!this.cardContainer) {
      throw new Error('Card Content must be used inside a Card');
    }
  }
}
