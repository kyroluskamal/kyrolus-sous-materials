import { Component, computed, HostBinding, inject } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionContainerComponent } from './accordion-container.component';

@Component({
  selector: 'ks-accordion-content',
  imports: [],
  template: ` <ng-content>Add Content Here</ng-content> `,
  styles: `

  `,
  host: { class: 'pl-25 position-relative' },
})
export class AccordionContentComponent {
  readonly container = inject(AccordionContainerComponent);
  readonly accordionItem = inject(AccordionItemComponent);
  isopened = computed(
    () => this.accordionItem.opened() || this.accordionItem.active()
  );
  @HostBinding('class.opened')
  @HostBinding('attr.opened')
  get opened() {
    return this.isopened();
  }
}
