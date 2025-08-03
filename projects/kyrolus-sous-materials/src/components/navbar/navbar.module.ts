import { NgModule } from '@angular/core';
import { NavbarContainerComponent } from './navbar-container.component';
import { NavbarRowComponent } from './navbar-row.component';

const components = [NavbarContainerComponent, NavbarRowComponent];

@NgModule({
  declarations: [],
  imports: [components],
  exports: [components],
})
export class NavbarModule {}
