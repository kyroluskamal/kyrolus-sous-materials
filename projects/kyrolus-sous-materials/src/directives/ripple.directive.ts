import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { RendererService } from '../services/renderer.service';

@Directive({
  selector: '[ksRipple]',
})
export class RippleDirective {
  useRipple = input<boolean>(true);
  rippleColor = input<string>('bg-white-transparent-4');
  constructor(
    private readonly renderer2: RendererService,
    private readonly elRef: ElementRef<HTMLElement>
  ) {}
  @HostListener('click', ['$event'])
  onclick(event: MouseEvent) {
    let span = this.renderer2.createElement('span');
    this.renderer2.appendChild(this.elRef.nativeElement, span);
    this.renderer2.setStyles(span, {
      background: this.rippleColor,
    });
    this.renderer2.addClasses(span, [
      'w-p-100',
      'h-p-100',
      'position-absolute',
      'br-full',
      'prevent-pointer-events',
      'scale-0',
      'ripple',
      this.rippleColor(),
    ]);
    setTimeout(() => {
      span.remove();
    }, 600);
  }
}
