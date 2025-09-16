import { Injectable, signal } from '@angular/core';
import { PopoverPlacement } from '../../blocks/popover-menu/popover.types';
export type sides = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};
@Injectable({
  providedIn: 'root',
})
export class FloatingUiService {
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

  calculateOptimalPosition(placement: PopoverPlacement, offset = 8) {
    let refRect = this.refElement?.getBoundingClientRect();
    let floatRect = this.floatElement?.getBoundingClientRect();
    let boundaryRect = this.boundaryElement?.getBoundingClientRect();

    const { viewportHeight, viewportWidth } =
      this.getViewportSize(boundaryRect);

    if (!refRect || !floatRect) {
      return;
    }

    floatRect = this.floatElement.getBoundingClientRect();
    let spcesArroundRef = this.computeSpacesAroundRef(
      refRect,
      boundaryRect,
      offset,
      viewportHeight,
      viewportWidth
    );

    const sidesAvaliableForFloating = this.evaluateSidesAvailableForFloating(
      spcesArroundRef,
      placement
    );

    let avaliablePosition: PopoverPlacement[] = [];
    let sidesAvaliable = new Map<string, number>();

    if (Object.keys(sidesAvaliableForFloating).length === 4) {
      return { avaliablePosition, sidesAvaliable };
    }
    sidesAvaliable = new Map<string, number>(
      Object.entries(sidesAvaliableForFloating)
    );

    avaliablePosition = this.position.filter((pos) =>
      Array.from(sidesAvaliable.keys()).some((side) => pos.includes(side))
    );

    avaliablePosition = this.filterPositionsByMissingSides(
      avaliablePosition,
      sidesAvaliable
    );

    avaliablePosition = this.prioritizeByFirstLetter(
      avaliablePosition,
      placement
    );

    if (avaliablePosition.length === 0) {
      const optimal = this.chooseFallbackPosition(sidesAvaliable, placement);
      if (!this.shouldScroll()) {
        this.scrollToElementIfNeeded();
      }
      if (optimal) {
        avaliablePosition.push(optimal);
      }
    }
    return {
      avaliablePosition,
      sidesAvaliable,
      spcesArroundRef,
      refRect,
      floatRect,
      viewportHeight,
      viewportWidth,
    };
  }
  private getRect(element: HTMLElement) {
    return element?.getBoundingClientRect();
  }
  /* v8 ignore start */
  shouldScroll = signal(false);
  refElement!: HTMLElement;
  floatElement!: HTMLElement;
  boundaryElement?: HTMLElement;
  /* v8 ignore end */
  setElements(ref: HTMLElement, float: HTMLElement, boundary?: HTMLElement) {
    this.refElement = ref;
    this.floatElement = float;
    this.boundaryElement = boundary;
  }

  private getViewportSize(boundaryRect: DOMRect | undefined) {
    return {
      viewportHeight: boundaryRect?.height ?? window.innerHeight,
      viewportWidth: boundaryRect?.width ?? window.innerWidth,
    };
  }

  private computeSpacesAroundRef(
    refRect: DOMRect,
    boundaryRect: DOMRect | undefined,
    offset: number,
    viewportHeight: number,
    viewportWidth: number
  ): sides {
    return boundaryRect
      ? {
          top: refRect.top - boundaryRect.top - offset,
          bottom: boundaryRect.bottom - refRect.bottom - offset,
          left: refRect.left - boundaryRect.left - offset,
          right: boundaryRect.right - refRect.right - offset,
        }
      : {
          top: refRect.top - offset,
          bottom: viewportHeight - refRect.bottom - offset,
          left: refRect.left - offset,
          right: viewportWidth - refRect.right - offset,
        };
  }

  private evaluateSidesAvailableForFloating(
    spaces: sides,
    placement: PopoverPlacement
  ): sides {
    const result: sides = {};
    const elemHeight = this.floatElement.offsetHeight;
    const elemWidth = this.floatElement.offsetWidth;

    const check = (
      sidesToCheck: string[],
      sideToPut: keyof sides,
      needed: number
    ) => {
      const space = spaces[sideToPut] ?? 0;
      if (
        space > needed ||
        (sidesToCheck.includes(placement) && space > needed / 2)
      ) {
        result[sideToPut] = space;
      }
    };

    check(['left', 'right'], 'top', elemHeight);
    check(['left', 'right'], 'bottom', elemHeight);
    check(['top', 'bottom'], 'left', elemWidth);
    check(['top', 'bottom'], 'right', elemWidth);

    return result;
  }

  private filterPositionsByMissingSides(
    avaliablePosition: PopoverPlacement[],
    sidesAvaliable: Map<string, number>
  ): PopoverPlacement[] {
    let res = [...avaliablePosition];

    if (!sidesAvaliable.get('right')) {
      res = res.filter(
        (p) =>
          !p.includes('right') && !p.includes('top') && !p.includes('bottom')
      );
    }
    if (!sidesAvaliable.get('left')) {
      res = res.filter(
        (p) =>
          !p.includes('left') && !p.includes('top') && !p.includes('bottom')
      );
    }
    if (!sidesAvaliable.get('top')) {
      res = res.filter(
        (p) =>
          !p.includes('top') &&
          !['left', 'left-end', 'right', 'right-end'].includes(p)
      );
    }
    if (!sidesAvaliable.get('bottom')) {
      res = res.filter(
        (p) =>
          !p.includes('bottom') &&
          !['left', 'left-start', 'right', 'right-start'].includes(p)
      );
    }

    return res;
  }

  private chooseFallbackPosition(
    sidesAvaliable: Map<string, number>,
    placement: PopoverPlacement
  ): PopoverPlacement {
    let optimal: PopoverPlacement = placement;

    if (sidesAvaliable.size === 2) {
      switch (placement) {
        case 'right':
        case 'right-start':
        case 'right-end':
          optimal = 'right-start';
          break;
        case 'left':
        case 'left-start':
        case 'left-end':
          optimal = 'left-start';
          break;
        case 'bottom-start':
        case 'top-start':
          optimal = 'bottom-start';
          break;
        case 'bottom-end':
        case 'top-end':
          optimal = 'bottom-end';
          break;
        case 'bottom':
        case 'top':
          optimal = 'bottom';
          break;
      }
    } else if (sidesAvaliable.size === 1) {
      if (sidesAvaliable.get('right')) {
        switch (placement) {
          case 'right':
          case 'right-end':
          case 'right-start':
          case 'left':
          case 'left-end':
          case 'left-start':
            optimal = 'right-start';
            break;
          case 'bottom-end':
          case 'bottom-start':
          case 'bottom':
          case 'top':
          case 'top-end':
          case 'top-start':
            optimal = 'bottom-start';
            break;
        }
      } else if (sidesAvaliable.get('left')) {
        switch (placement) {
          case 'right':
          case 'right-end':
          case 'right-start':
          case 'left':
          case 'left-end':
          case 'left-start':
            optimal = 'left-start';
            break;
          case 'bottom-end':
          case 'bottom-start':
          case 'bottom':
          case 'top':
          case 'top-end':
          case 'top-start':
            optimal = 'bottom-end';
            break;
        }
      }
    }

    return optimal;
  }

  isFloatingTopNotInViewport() {
    if (this.floatElement) {
      const rect = this.getRect(this.floatElement);
      return rect.top < 0 || this.getComputedSideValue('top') < 0;
    }
    return false;
  }
  isFloatingBottomNotInViewport() {
    if (this.floatElement) {
      const rect = this.getRect(this.floatElement);
      let clientHeight =
        document.documentElement.clientHeight || window.innerHeight;
      return (
        rect.bottom > clientHeight || this.getComputedSideValue('bottom') < 0
      );
    }
    return false;
  }
  isFloatingLeftNotInViewport() {
    if (this.floatElement) {
      const rect = this.getRect(this.floatElement);
      return rect.left < 0 || this.getComputedSideValue('left') < 0;
    }
    return false;
  }
  isFloatingRightNotInViewport() {
    if (this.floatElement) {
      const rect = this.getRect(this.floatElement);
      let clientWidth =
        window.innerWidth || document.documentElement.clientWidth;
      return rect.right > clientWidth || this.getComputedSideValue('right') < 0;
    }
    return false;
  }

  isRefElementIsUnderFloating() {
    if (this.refElement && this.floatElement) {
      const refRect = this.getRect(this.refElement);
      const floatRect = this.getRect(this.floatElement);
      if (refRect && floatRect) {
        return (
          refRect.top >= floatRect.top &&
          refRect.bottom <= floatRect.bottom &&
          refRect.left >= floatRect.left &&
          refRect.right <= floatRect.right
        );
      }
    }
    return false;
  }

  private getComputedSideValue(side: 'top' | 'bottom' | 'left' | 'right') {
    const value = getComputedStyle(this.floatElement).getPropertyValue(side);
    return parseInt(value ? value.replace('px', '').trim() : '');
  }

  private scrollToElementIfNeeded() {
    if (!this.refElement || !this.floatElement || this.shouldScroll()) return;

    const refRect = this.refElement.getBoundingClientRect();
    const floatRect = this.floatElement.getBoundingClientRect();
    const margin = 8;

    const needUp = refRect.top - (floatRect.height + margin) < 0;
    const needDown =
      refRect.bottom + (floatRect.height + margin) > window.innerHeight;
    if (!needUp && !needDown) return;

    const pageY = window.scrollY || document.documentElement.scrollTop || 0;
    let target;

    if (needUp) {
      target = pageY + refRect.top - (floatRect.height + margin);
    } else {
      target =
        pageY +
        (refRect.bottom + (floatRect.height + margin) - window.innerHeight);
    }

    this.shouldScroll.set(true);
    window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }
  private prioritizeByFirstLetter(
    arr: readonly PopoverPlacement[],
    letter: string
  ): PopoverPlacement[] {
    const l = letter?.toLowerCase();
    const first = arr.filter((p) => p.startsWith(l));
    const rest = arr.filter((p) => !p.startsWith(l));
    return [...first, ...rest];
  }
}
