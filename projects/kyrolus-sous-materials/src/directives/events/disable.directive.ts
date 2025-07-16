import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { RendererService } from '../../services/renderer.service';

@Directive({
  selector: '[ksDisable]',
})
export class DisableDirective {
  private readonly renderer2Service = inject(RendererService);
  private readonly elRef = inject(
    ElementRef<HTMLElement>
  ) as ElementRef<HTMLElement>;

  disabled = signal<boolean>(true);
  @HostBinding('disabled')
  get disable() {
    let span = this.renderer2Service.createElement('span') as HTMLElement;
    this.renderer2Service.addClasses(span, ['cursor-not-allowed']);
    if (
      this.disabled() &&
      this.elRef.nativeElement.parentElement?.tagName !== 'SPAN' &&
      !this.elRef.nativeElement.parentElement?.classList.contains(
        'cursor-not-allowed'
      )
    ) {
      this.renderer2Service.insertBefore(
        this.elRef.nativeElement.parentElement as HTMLElement,
        span,
        this.elRef.nativeElement
      );
      this.renderer2Service.appendChild(span, this.elRef.nativeElement);
    } else if (
      !this.disabled &&
      this.elRef.nativeElement.parentElement?.tagName === 'SPAN' &&
      this.elRef.nativeElement.parentElement.classList.contains(
        'cursor-not-allowed'
      )
    ) {
      let spanRef = this.elRef.nativeElement.parentElement;
      this.renderer2Service.insertBefore(
        this.elRef.nativeElement.parentElement?.parentElement as HTMLElement,
        this.elRef.nativeElement,
        spanRef
      );
      spanRef?.remove();
    }
    return this.disabled;
  }

  @HostListener('click', ['$event'])
  @HostListener('dblclick', ['$event'])
  onClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
