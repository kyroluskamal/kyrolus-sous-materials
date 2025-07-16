import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThrowingErrorService {
  isChildOf(Child: HTMLElement, parentTagName: string, message?: string) {
    if (
      Child.parentElement?.tagName.toLowerCase() != parentTagName.toLowerCase()
    ) {
      throw new Error(
        message ??
          `The ${Child.tagName} component must be a child of the ${parentTagName} component`
      );
    }
  }
}
