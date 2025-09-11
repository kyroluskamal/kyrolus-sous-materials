import {
  Directive,
  ElementRef,
  inject,
  input,
  model,
  numberAttribute,
  afterEveryRender,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { PopoverPlacement } from '../../blocks/popover-menu/popover.types';
import { isPlatformBrowser } from '@angular/common';
import { FloatingUiService } from './floating-ui.service';
type sides = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};
@Directive({
  selector: '[ksFloatingUI]',
  standalone: true,
})
export class FloatingUIDirective implements OnDestroy {
  position = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ] as const;
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly floatingElement = this.elRef.nativeElement as HTMLElement;
  private readonly resizeObserver!: ResizeObserver;

  readonly referenceElement = input.required<HTMLElement>();
  readonly placement = model.required<PopoverPlacement>();
  platformId = inject(PLATFORM_ID);
  readonly offset = input.required<number, string>({
    transform: numberAttribute,
  });
  private readonly floatingUiService = inject(FloatingUiService);
  readonly mode = input<'flip' | 'freeStyle'>('flip');
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
  ngOnDestroy() {
    if (this.resizeObserver?.disconnect) this.resizeObserver?.disconnect();
  }
  private adjustPlacement() {
    const result = this.floatingUiService.calculateOptimalPosition(
      this.placement(),
      this.offset()
    );
    if (!result) return;
    const {
      avaliablePosition: positions,
      sidesAvaliable,
      spcesArroundRef,
      floatRect,
      viewportHeight,
      viewportWidth,
    } = result;

    let optimal: PopoverPlacement | undefined;

    if (positions.length > 0) {
      optimal = positions[0] as PopoverPlacement;
    } else if (sidesAvaliable && sidesAvaliable.size > 0) {
      let maxSide: string | undefined;
      let maxSpace = -Infinity;
      sidesAvaliable.forEach((_, side) => {
        const space = (spcesArroundRef as any)[side] ?? 0;
        if (space > maxSpace) {
          maxSpace = space;
          maxSide = side;
        }
      });
      if (maxSide) {
        optimal = maxSide as PopoverPlacement;
      }
    }

    if (optimal) {
      this.placement.set(optimal);
    }

    if (floatRect) {
      const margin = this.offset();
      if (floatRect.height > viewportHeight) {
        this.floatingElement.style.maxHeight = `${viewportHeight - margin}px`;
        this.floatingElement.style.overflowY = 'auto';
      }
      if (floatRect.width > viewportWidth) {
        this.floatingElement.style.maxWidth = `${viewportWidth - margin}px`;
        this.floatingElement.style.overflowX = 'auto';
      }
    }
  }
}
