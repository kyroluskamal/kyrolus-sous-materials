import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MenuAriaHandlingDirective,
  MenuComponent,
  MenuModule,
} from './public-api';

const comps = [MenuModule, MenuAriaHandlingDirective];

@NgModule({
  declarations: [],
  imports: [MenuModule],
  exports: [MenuModule],
})
export class SharedTestingModule {}
