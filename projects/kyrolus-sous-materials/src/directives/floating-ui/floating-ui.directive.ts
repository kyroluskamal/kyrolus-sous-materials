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
    const positions = result ? result.avaliablePosition : [];
    if (positions.length === 0) return;
    const optimal: PopoverPlacement = positions[0] as PopoverPlacement;

    this.placement.set(optimal);
  }
}
