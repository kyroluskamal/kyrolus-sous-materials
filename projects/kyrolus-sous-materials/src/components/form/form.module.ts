import { NgModule } from '@angular/core';
import { FormComponent } from './form.component';
import { InputComponent } from './input.component';

const components = [FormComponent, InputComponent];

@NgModule({
  declarations: [],
  imports: [...components],
  exports: [...components],
})
export class FormModule {}
