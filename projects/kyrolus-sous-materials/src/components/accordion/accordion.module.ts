import { NgModule } from '@angular/core';
import { AccordionContainerComponent } from './accordion-container.component';
import { AccordionContentComponent } from './accordion-content.component';
import { AccordionHeaderComponent } from './accordion-header.component';
import { AccordionItemComponent } from './accordion-item.component';

const components = [
  AccordionContainerComponent,
  AccordionContentComponent,
  AccordionHeaderComponent,
  AccordionItemComponent,
];
@NgModule({
  declarations: [],
  imports: [...components],
  exports: [...components],
})
export class AccordionModule {}
