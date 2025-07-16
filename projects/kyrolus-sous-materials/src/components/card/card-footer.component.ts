import { Component, inject } from '@angular/core';
import { CardComponent } from './card.component';

@Component({
  selector: 'ks-card-footer',
  imports: [],
  template: ` <ng-content></ng-content> `,
  styles: ``,
})
export class CardFooterComponent {
  readonly cardContainer = inject(CardComponent);
  ngOnInit(): void {
    if (!this.cardContainer) {
      throw new Error('Card Footer must be used inside a Card');
    }
  }
}
