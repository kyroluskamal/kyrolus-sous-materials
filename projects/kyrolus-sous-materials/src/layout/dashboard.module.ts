import { NgModule } from '@angular/core';
import { DashboardContentComponent } from './dashboard-content.component';
import { DashboardLayoutComponent } from './dashboard-layout.component';

const components = [DashboardContentComponent, DashboardLayoutComponent];

@NgModule({
  declarations: [],
  imports: [...components],
  exports: [...components],
})
export class DashboardModule {}
