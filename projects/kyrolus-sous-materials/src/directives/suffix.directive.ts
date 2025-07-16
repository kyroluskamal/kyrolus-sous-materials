import { Directive, ElementRef, HostBinding, input } from '@angular/core';
import { RendererService } from '../services/renderer.service';

@Directive({
  selector: '[ksSuffix]',
})
export class SuffixDirective {
  // styleClasses = input(['d-block', 'aspect-ratio-1x1']);
  // constructor(
  //   private readonly elRef: ElementRef<HTMLElement>,
  //   private readonly renderer2: RendererService
  // ) {}
  // ngAfterViewInit(): void {
  //   let parent = this.elRef.nativeElement.parentElement;
  //   if (parent) {
  //     this.renderer2.appendChild(parent, this.elRef.nativeElement);
  //   }
  // }
  // @HostBinding('class')
  // private get styleClass() {
  //   return this.styleClasses;
  // }
}
