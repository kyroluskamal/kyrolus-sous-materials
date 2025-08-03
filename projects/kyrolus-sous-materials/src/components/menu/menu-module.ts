import { NgModule } from '@angular/core';
import {
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
];
@NgModule({
  imports: [comps],
  exports: [comps],
})
export class MenuModule {}
