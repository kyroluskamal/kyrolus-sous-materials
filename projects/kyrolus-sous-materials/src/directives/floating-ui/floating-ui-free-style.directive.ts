import { isPlatformBrowser } from '@angular/common';
import {
  afterEveryRender,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  numberAttribute,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';
import { PopoverPlacement } from '../../blocks/popover-menu/popover.types';
import { FloatingUiService } from './floating-ui.service';

@Directive({
  selector: '[ksFloatingUiFreeStyle]',
})
export class FloatingUiFreeStyleDirective {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly floatingElement = this.elRef.nativeElement as HTMLElement;
  private readonly resizeObserver!: ResizeObserver;
  readonly isRefElementIsVisinble = signal(true);
  readonly placement = model.required<PopoverPlacement>();
  private readonly floatingUiService = inject(FloatingUiService);
  private readonly renderer = inject(Renderer2);
  readonly referenceElement = input.required<HTMLElement>();
  platformId = inject(PLATFORM_ID);
  readonly offset = input.required<number, string>({
    transform: numberAttribute,
  });
  constructor() {
    afterEveryRender(() => {
      this.floatingUiService.setElements(
        this.referenceElement(),
        this.floatingElement
      );
      if (this.referenceElement()) this.adjustPlacement();
    });

    if (isPlatformBrowser(this.platformId) && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.referenceElement()) {
          this.adjustPlacement();
        }
      });
      if (this.resizeObserver.observe)
        this.resizeObserver?.observe(document.body);
    }
  }
  adjustPlacement() {
    // const result = this.floatingUiService.calculateOptimalPosition(
    //   this.placement(),
    //   this.offset()
    // );
    // if (!result) return;

    // const floatingRect = this.floatingElement.getBoundingClientRect();
    // const refRect = result.refRect;

    // // اختار الوضع الأمثل
    // const positions = result.avaliablePosition;
    // const optimal: PopoverPlacement = positions[0] as PopoverPlacement;

    // let top = 0;
    // let left = 0;

    // if (optimal.startsWith('bottom')) {
    //   top = refRect?.bottom + this.offset();
    //   left = Number(refRect?.left);
    // } else if (optimal.startsWith('top')) {
    //   top = refRect?.top - floatingRect.height - this.offset();
    //   left = Number(refRect?.left);
    // } else if (optimal.startsWith('right')) {
    //   top = Number(refRect?.top);
    //   left = refRect?.right + this.offset();
    // } else if (optimal.startsWith('left')) {
    //   top = Number(refRect?.top);
    //   left = Number(refRect?.left) - floatingRect.width - this.offset();
    // }

    // // ✨ أهم حاجة: تعيين position جديد مطلق
    // this.renderer.setStyle(this.floatingElement, 'position', 'absolute');
    // this.renderer.setStyle(
    //   this.floatingElement,
    //   'top',
    //   `${Math.max(0, top)}px`
    // );
    // this.renderer.setStyle(
    //   this.floatingElement,
    //   'left',
    //   `${Math.max(0, left)}px`
    // );
  }
  ngOnDestroy() {
    if (this.resizeObserver?.disconnect) this.resizeObserver?.disconnect();
  }
}
