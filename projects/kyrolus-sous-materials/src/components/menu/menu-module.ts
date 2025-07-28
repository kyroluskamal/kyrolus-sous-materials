import { NgModule } from '@angular/core';
import {
  MenuComponent,
  MenuItemComponent,
  MenuSectionComponent,
} from './menu.exports';

const comps = [MenuComponent, MenuItemComponent, MenuSectionComponent];
@NgModule({
  imports: [comps],
  exports: [comps],
})
export class MenuModule {}
