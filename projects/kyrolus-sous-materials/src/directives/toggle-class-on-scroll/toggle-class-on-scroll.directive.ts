import {
  afterNextRender,
  ChangeDetectorRef,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[ksToggleClassOnScroll]',
})
export class ToggleClassOnScrollDirective {
  /* v8 ignore next */
  readonly ksToggleClassOnScroll = input.required<string>();
  /* v8 ignore next */
  readonly ksScrollOffset = input<number>(0);
  private readonly _scrollOffset = linkedSignal(() => this.ksScrollOffset());
  private readonly document = inject<Document>(DOCUMENT);
  private readonly renderer2 = inject(Renderer2);
  private readonly elementRef = inject<ElementRef>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private scrollListener!: () => void;

  constructor() {
    afterNextRender(() => {
      this.scrollListener = this.renderer2.listen(
        this.document.defaultView,
        'scroll',
        () => this.setScrollOffset()
      );
      this.setScrollOffset();
    });
    effect(() => {
      let hostElement = this.elementRef.nativeElement;
      if (this._scrollOffset() <= this.ksScrollOffset()) {
        this.renderer2.addClass(hostElement, this.ksToggleClassOnScroll());
      } else {
        this.renderer2.removeClass(hostElement, this.ksToggleClassOnScroll());
      }
    });
  }

  setScrollOffset() {
    let scrollPosition =
      this.document.defaultView?.scrollY || this.document.body.scrollTop;
    this._scrollOffset.set(scrollPosition);
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }
}
