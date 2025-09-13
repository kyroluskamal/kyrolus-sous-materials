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
  private removeResizeListener?: () => void;
  private removeScrollListener?: () => void;
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
    if (isPlatformBrowser(this.platformId)) {
      this.removeResizeListener = this.renderer.listen(
        'window',
        'resize',
        () => {
          if (this.referenceElement()) this.adjustPlacement();
        }
      );
      this.removeScrollListener = this.renderer.listen(
        'window',
        'scroll',
        () => {
          if (this.referenceElement()) this.adjustPlacement();
        }
      );
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => {
          if (this.referenceElement()) {
            this.adjustPlacement();
          }
        });
        if (this.resizeObserver.observe)
          this.resizeObserver.observe(document.body);
      }
    }
  }
  adjustPlacement() {
    const result = this.floatingUiService.calculateOptimalPosition(
      this.placement(),
      this.offset()
    );
    if (!result) return;

    const {
      avaliablePosition,
      sidesAvaliable,
      refRect,
      floatRect,
      viewportHeight,
      viewportWidth,
    } = result;

    if (!refRect || !floatRect || viewportHeight == null || viewportWidth == null) {
      return;
    }

    let optimal: PopoverPlacement;
    if (avaliablePosition.length) {
      optimal = avaliablePosition[0] as PopoverPlacement;
    } else if (sidesAvaliable.size) {
      const best = Array.from(sidesAvaliable.entries()).sort(
        (a, b) => b[1] - a[1]
      )[0][0];
      optimal = best as PopoverPlacement;
    } else {
      optimal = this.placement();
    }

    const offset = this.offset();
    let top = 0;
    let left = 0;

    if (optimal.startsWith('bottom')) {
      top = refRect.bottom + offset;
      if (optimal.endsWith('start')) {
        left = refRect.left;
      } else if (optimal.endsWith('end')) {
        left = refRect.right - floatRect.width;
      } else {
        left = refRect.left + refRect.width / 2 - floatRect.width / 2;
      }
    } else if (optimal.startsWith('top')) {
      top = refRect.top - floatRect.height - offset;
      if (optimal.endsWith('start')) {
        left = refRect.left;
      } else if (optimal.endsWith('end')) {
        left = refRect.right - floatRect.width;
      } else {
        left = refRect.left + refRect.width / 2 - floatRect.width / 2;
      }
    } else if (optimal.startsWith('right')) {
      left = refRect.right + offset;
      if (optimal.endsWith('start')) {
        top = refRect.top;
      } else if (optimal.endsWith('end')) {
        top = refRect.bottom - floatRect.height;
      } else {
        top = refRect.top + refRect.height / 2 - floatRect.height / 2;
      }
    } else if (optimal.startsWith('left')) {
      left = refRect.left - floatRect.width - offset;
      if (optimal.endsWith('start')) {
        top = refRect.top;
      } else if (optimal.endsWith('end')) {
        top = refRect.bottom - floatRect.height;
      } else {
        top = refRect.top + refRect.height / 2 - floatRect.height / 2;
      }
    }

    const maxTop = viewportHeight - floatRect.height;
    const maxLeft = viewportWidth - floatRect.width;
    top = Math.max(0, Math.min(top, maxTop));
    left = Math.max(0, Math.min(left, maxLeft));

    this.renderer.setStyle(this.floatingElement, 'position', 'absolute');
    this.renderer.setStyle(this.floatingElement, 'top', `${top}px`);
    this.renderer.setStyle(this.floatingElement, 'left', `${left}px`);
  }
  ngOnDestroy() {
    this.removeResizeListener?.();
    this.removeScrollListener?.();
    if (this.resizeObserver?.disconnect) this.resizeObserver.disconnect();
  }
}
