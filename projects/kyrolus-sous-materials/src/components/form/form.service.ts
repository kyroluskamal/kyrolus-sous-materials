import { Injectable } from '@angular/core';
import { FormComponent } from './form.component';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private parent: FormComponent | null = null;

  set Parent(parent: FormComponent) {
    this.parent = parent;
  }

  get Parent() {
    return this.parent as FormComponent;
  }
}
