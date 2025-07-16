import {
  Component,
  effect,
  HostBinding,
  inject,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { AccordionContainerComponent } from './accordion-container.component';

@Component({
  selector: 'ks-accordion-item',
  imports: [],
  template: `
    <ng-content select="ks-accordion-header" />
    <ng-content select="ks-accordion-content" />
  `,
  host: { class: 'd-flex flex-column' },
  styles: ``,
})
export class AccordionItemComponent implements OnInit {
  container = inject(AccordionContainerComponent);
  readonly opened = signal(false);
  readonly active = model(false);
  readonly disabled = model<boolean>(false);
  readonly headerOnly = input<boolean>(false);

  effect = effect(() => {
    if (this.disabled() || this.headerOnly()) {
      this.opened.set(false);
      this.active.set(false);
    }
    if (this.active()) {
      this.opened.set(true);
      this.container.theOpenedItem.set(this);
    } else {
      this.container.theOpenedItem.set(null);
    }
  });
  ngOnInit(): void {
    if (!this.container) {
      throw new Error(
        'Accordion Item must be used inside an Accordion Container'
      );
    }
  }

  @HostBinding('attr.disabled')
  get isDisabled() {
    return this.disabled();
  }
}
