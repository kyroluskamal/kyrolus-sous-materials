import {
  Directive,
  ElementRef,
  inject,
  input,
  model,
  numberAttribute,
  afterEveryRender,
  PLATFORM_ID,
} from '@angular/core';
import { PopoverPlacement } from '../../blocks/popover-menu/popover.types';
import { isPlatformBrowser } from '@angular/common';
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
export class FloatingUIDirective {
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
  // readonly mode = input<'flip' | 'freeStyle'>('flip');
  constructor() {
    afterEveryRender(() => {
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
    const result = this.calculateOptimalPosition();
    const positions = result ? result.avaliablePosition : [];
    if (positions.length === 0) return;
    const optimal: PopoverPlacement = positions[0] as PopoverPlacement;

    this.placement.set(optimal);
  }

  private calculateOptimalPosition() {
    let refRect = this.referenceElement()?.getBoundingClientRect();
    let floatRect = this.floatingElement.getBoundingClientRect();
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;
    const currentOffset = this.offset();

    if (!refRect || !floatRect) {
      return;
    }
    let spcesArroundRef = {
      top: refRect.top - currentOffset,
      bottom: viewportHeight - refRect.bottom - currentOffset,
      left: refRect.left - currentOffset,
      right: viewportWidth - refRect.right - currentOffset,
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
      const elemProp = this.floatingElement[
        `offset${params.offset}` as keyof HTMLElement
      ] as number;
      if (
        spcesArroundRef[params.sideToPut] > elemProp ||
        (params.sidesToCheck.includes(this.placement()) &&
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
    return { avaliablePosition, sidesAvaliable };
  }
}
