import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { DialogHeaderComponent } from './dialog-header.component';
import { DialogActionsComponent } from './dialog-actions.component';
import { DialogTitleDirective } from './dialog-title.directive';
import { DialogContentComponent } from './dialog-content.component';

const components = [
  DialogComponent,
  DialogHeaderComponent,
  DialogActionsComponent,
  DialogContentComponent,
  DialogTitleDirective,
];

@NgModule({
  declarations: [],
  imports: [components],
  exports: [components],
})
export class DialogModule {}
