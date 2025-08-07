import { NgModule } from '@angular/core';
import {
  MenuAriaHandlingDirective,
  MenuComponent,
  MenuFooterComponent,
  MenuHeaderComponent,
  MenuItemComponent,
  MenuSectionComponent,
} from './menu.exports';

const comps = [
  MenuComponent,
  MenuItemComponent,
  MenuSectionComponent,
  MenuHeaderComponent,
  MenuFooterComponent,
  MenuAriaHandlingDirective,
];
@NgModule({
  imports: [comps],
  exports: [comps],
})
export class MenuModule {}
