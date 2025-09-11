import { Injectable } from '@angular/core';
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
  private getRect(element: HTMLElement) {
    return element?.getBoundingClientRect();
  }
  refElement!: HTMLElement;
  floatElement!: HTMLElement;
  boundaryElement?: HTMLElement;

  setElements(ref: HTMLElement, float: HTMLElement, boundary?: HTMLElement) {
    this.refElement = ref;
    this.floatElement = float;
    this.boundaryElement = boundary;
  }
  calculateOptimalPosition(placement: PopoverPlacement, offset = 8) {
    let refRect = this.refElement?.getBoundingClientRect();
    let floatRect = this.floatElement?.getBoundingClientRect();
    let boundaryRect = this.boundaryElement?.getBoundingClientRect();
    let viewportHeight = boundaryRect?.height ?? window.innerHeight;
    let viewportWidth = boundaryRect?.width ?? window.innerWidth;

    if (!refRect || !floatRect) {
      return;
    }
    let spcesArroundRef = boundaryRect
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

    let sidesAvaliableForFloating: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    } = {};
    const evaluteSidesAvalibleForFloating = (params: {
      sidesToCheck: string[];
      sideToPut: keyof sides;
      offset: keyof HTMLElement;
    }) => {
      const elemProp = this.floatElement[
        `offset${params.offset}` as keyof HTMLElement
      ] as number;
      if (
        spcesArroundRef[params.sideToPut] > elemProp ||
        (params.sidesToCheck.includes(placement) &&
          spcesArroundRef[params.sideToPut] > elemProp / 2)
      ) {
        sidesAvaliableForFloating[params.sideToPut] =
          spcesArroundRef[params.sideToPut];
      }
    };
    const sidesToEvaluate = [
      {
        sides: ['left', 'right'],
        sideToPut: ['top', 'bottom'],
        offset: 'Height',
      },
      {
        sides: ['top', 'bottom'],
        sideToPut: ['left', 'right'],
        offset: 'Width',
      },
    ];
    sidesToEvaluate.forEach((sides) => {
      sides.sideToPut.forEach((side) => {
        evaluteSidesAvalibleForFloating({
          sidesToCheck: sides.sides,
          sideToPut: side as keyof sides,
          offset: sides.offset as keyof HTMLElement,
        });
      });
    });
    let avaliablePosition: string[] = [];
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
    if (!sidesAvaliable.get('right')) {
      avaliablePosition = avaliablePosition.filter(
        (p) =>
          !p.includes('right') && !p.includes('top') && !p.includes('bottom')
      );
    }
    if (!sidesAvaliable.get('left')) {
      avaliablePosition = avaliablePosition.filter(
        (p) =>
          !p.includes('left') && !p.includes('top') && !p.includes('bottom')
      );
    }
    if (!sidesAvaliable.get('top')) {
      avaliablePosition = avaliablePosition.filter(
        (p) =>
          !p.includes('top') &&
          !['left', 'left-end', 'right', 'right-end'].includes(p)
      );
    }
    if (!sidesAvaliable.get('bottom')) {
      avaliablePosition = avaliablePosition.filter(
        (p) =>
          !p.includes('bottom') &&
          !['left', 'left-start', 'right', 'right-start'].includes(p)
      );
    }

    // evaluate cross-axis space for start/end variations
    avaliablePosition = this.evaluteCrossAxisOverflow(
      avaliablePosition,
      spcesArroundRef,
      refRect,
      floatRect,
      placement
    );

  // shift floating element back into the viewport if slightly overflowing
      this.shiftElementIntoView(
        boundaryRect,
        floatRect,
        viewportHeight,
        viewportWidth,
        offset
      );
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

  isElementInViewport(el: HTMLElement) {
    const rect = this.getRect(el);
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  isFloatingTopNotInViewport() {
    if (this.floatElement) {
      const rect = this.getRect(this.floatElement);
      return rect.top < 0;
    }
    return false;
  }
  isFloatingBottomNotInViewport() {
    if (this.floatElement) {
      const rect = this.getRect(this.floatElement);
      return (
        rect.bottom >
        (window.innerHeight || document.documentElement.clientHeight)
      );
    }
    return false;
  }
  isFloatingLeftNotInViewport() {
    if (this.floatElement) {
      const rect = this.getRect(this.floatElement);
      return rect.left < 0;
    }
    return false;
  }
  isFloatingRightNotInViewport() {
    if (this.floatElement) {
      const rect = this.getRect(this.floatElement);
      return (
        rect.right > (window.innerWidth || document.documentElement.clientWidth)
      );
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

  evaluteCrossAxisOverflow(
    avaliablePosition: string[],
    spcesArroundRef: sides,
    refRect: DOMRect,
    floatRect: DOMRect,
    placement: PopoverPlacement
  ) {
    const extraWidth = Math.max(0, floatRect.width - refRect.width);
    const extraHeight = Math.max(0, floatRect.height - refRect.height);
    return avaliablePosition.filter((pos) => {
      if (!pos.includes('-')) return true;
      const [main, align] = pos.split('-');

      if (main === 'top' || main === 'bottom') {
        // top/bottom placements align horizontally
        if (align === 'start') {
          return extraWidth <= spcesArroundRef.right!;
        } else if (align === 'end') {
          return extraWidth <= spcesArroundRef.left!;
        }
      } else if (main === 'left' || main === 'right') {
        // left/right placements align vertically
        if (align === 'start') {
          return extraHeight <= spcesArroundRef.bottom!;
        } else if (align === 'end') {
          return extraHeight <= spcesArroundRef.top!;
        }
      }
      return true;
    });
  }

  private calculateAxisShift(
    start: number,
    end: number,
    minLimit: number,
    maxLimit: number,
    tolerance: number
  ): number {
    if (start < minLimit && (minLimit - start) <= tolerance) {
      return minLimit - start;
    }
    if (end > maxLimit && (end - maxLimit) <= tolerance) {
      return maxLimit - end;
    }
    return 0;
  }

  private shiftElementIntoView(
    boundaryRect: DOMRect | undefined,
    floatRect: DOMRect,
    viewportHeight: number,
    viewportWidth: number,
    offset = 8
  ) {
    const tolerance = offset;

    const minX = boundaryRect?.left ?? 0;
    const maxX = boundaryRect?.right ?? viewportWidth;
    const minY = boundaryRect?.top ?? 0;
    const maxY = boundaryRect?.bottom ?? viewportHeight;

    const shiftX = this.calculateAxisShift(
      floatRect.left,
      floatRect.right,
      minX,
      maxX,
      tolerance
    );

    if (shiftX) {
      this.floatElement.style.left = `${this.floatElement.offsetLeft + shiftX}px`;
      floatRect = this.floatElement.getBoundingClientRect();
    }

    const shiftY = this.calculateAxisShift(
      floatRect.top,
      floatRect.bottom,
      minY,
      maxY,
      tolerance
    );

    if (shiftY) {
      this.floatElement.style.top = `${this.floatElement.offsetTop + shiftY}px`;
    }
  }
}
