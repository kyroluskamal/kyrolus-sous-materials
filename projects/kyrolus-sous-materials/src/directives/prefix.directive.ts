import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  input,
} from '@angular/core';
import { RendererService } from '../services/renderer.service';

@Directive({
  selector: '[ksPrefix]',
})
export class PrefixDirective {
  // styleClasses = input(['d-block', 'aspect-ratio-1x1']);
  // constructor(
  //   private readonly elRef: ElementRef<HTMLElement>,
  //   private readonly renderer2: RendererService
  // ) {}
  // ngAfterViewInit(): void {
  //   let parent = this.elRef.nativeElement.parentElement;
  //   if (parent) {
  //     this.renderer2.insertBefore(
  //       parent,
  //       this.elRef.nativeElement,
  //       parent.firstChild as HTMLElement
  //     );
  //   }
  // }
  // @HostBinding('class')
  // private get styleClass() {
  //   return this.styleClasses;
  // }
}
