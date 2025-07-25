import {
  Component,
  computed,
  effect,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionContainerComponent } from './accordion-container.component';
import { IconDirective } from '../../directives/icon/icon.directive';
import { Icon, IconProvider } from '../../directives/icon/icon.types';

@Component({
  selector: 'ks-accordion-header',
  imports: [IconDirective],

  template: `
    @if(icon!=null || icon!=undefined || icon!=''){

    <div [ksIcon]="icon().name" [iconOptions]="icon().options"></div>
    }
    <span class="d-flex flex-1">
      <ng-content>Add header here</ng-content>
    </span>
    @if(!accortionItem.headerOnly()){
    <div ksIcon="chevron-right" [iconOptions]="{ provider: 'bi' }"></div>
    }
  `,
  host: {
    class:
      'br-r-3 cursor-pointer d-flex justify-content-start align-items-center p-5 gap-3',
  },
  styles: `
    :host:nth-child(2) {
      flex:1
    }
  `,
})
export class AccordionHeaderComponent {
  readonly accortionContainer = inject(AccordionContainerComponent);
  readonly accortionItem = inject(AccordionItemComponent);
  readonly icon = input<Icon>({
    options: { provider: 'bi' },
    name: '',
  });

  readonly ActiveClass = input<string>('accordtion-active');
  readonly opened = computed<boolean>(() => this.accortionItem.opened());
  effec = effect(() => {
    if (this.accortionItem.opened()) {
      this.accortionContainer.theOpenedItem.set(this.accortionItem);
    }
  });
  ngOnInit(): void {
    if (!this.accortionItem) {
      throw new Error('Accordion Header must be used inside an Accordion Item');
    }
  }
  @HostListener('click')
  toggle() {
    if (this.accortionItem.disabled() || this.accortionItem.headerOnly()) {
      this.accortionItem.opened.set(false);
      this.accortionItem.active.set(false);
    } else {
      this.accortionItem.opened.set(!this.accortionItem.opened());
      this.accortionItem.active.set(this.accortionItem.opened());
      this.accortionContainer.theOpenedItem.set(this.accortionItem);
    }
  }

  @HostBinding('attr.opened')
  get _opened(): boolean {
    return this.opened();
  }

  @HostBinding('class')
  get _active() {
    return {
      'accordtion-active':
        this.accortionItem.active() || this.accortionItem.opened(),
      opened: this.opened() || this.accortionItem.active(),
    };
  }
}
