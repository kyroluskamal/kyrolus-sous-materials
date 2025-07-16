import { Component, contentChildren, effect, signal } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'ks-accordion-container',
  imports: [],
  template: ` <ng-content select="ks-accordion-item" /> `,
  host: { class: 'd-flex flex-column mx-5' },
  styles: `
    :host {
      margin-block: 0.2rem;
    }
  `,
})
export class AccordionContainerComponent {
  readonly theOpenedItemReference = contentChildren(AccordionItemComponent);
  readonly theOpenedItem = signal<AccordionItemComponent | null>(null);

  effects = effect(() => {
    this.theOpenedItemReference().forEach((item) => {
      item.opened.update(() => this.theOpenedItem() === item);
    });
  });
}
