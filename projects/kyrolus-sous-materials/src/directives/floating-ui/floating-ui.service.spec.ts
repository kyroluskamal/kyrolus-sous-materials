import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FloatingUiService } from './floating-ui.service';

describe('FloatingUiService', () => {
  let service: FloatingUiService;
  let refEl: HTMLElement;
  let floatEl: HTMLElement;
  let boundaryEl: HTMLElement;

  beforeEach(() => {
    service = new FloatingUiService();
    refEl = document.createElement('div');
    floatEl = document.createElement('div');
    boundaryEl = document.createElement('div');

    Object.defineProperty(floatEl, 'offsetWidth', { value: 100 });
    Object.defineProperty(floatEl, 'offsetHeight', { value: 100 });
    Object.defineProperty(floatEl, 'offsetLeft', { value: 50, writable: true });
    Object.defineProperty(floatEl, 'offsetTop', { value: 50, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('calculateOptimalPosition', () => {
    it('should return undefined when ref or float element missing', () => {
      const res = service.calculateOptimalPosition('bottom');
      expect(res).toBeUndefined();
    });

    it('should early return when all sides have space', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 400,
        bottom: 450,
        left: 400,
        right: 450,
        width: 50,
        height: 50,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      } as DOMRect);

      const res = service.calculateOptimalPosition('bottom');
      expect(res?.avaliablePosition.length).toBe(0);
      expect(res!.sidesAvaliable.size).toBe(0);
    });

    it('should compute available positions considering boundary', () => {
      service.setElements(refEl, floatEl, boundaryEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
      vi.spyOn(boundaryEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 500,
        left: 0,
        right: 500,
        width: 500,
        height: 500,
      } as DOMRect);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 10,
        bottom: 60,
        left: 10,
        right: 110,
        width: 100,
        height: 50,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 80,
        left: 0,
        right: 100,
        width: 100,
        height: 80,
      } as DOMRect);

      const res = service.calculateOptimalPosition('bottom');
      expect(res!.sidesAvaliable.has('bottom')).toBe(true);
      expect(res!.sidesAvaliable.has('right')).toBe(true);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['right-start']);
    });

    it('should exclude top/bottom/right placements when right side not available', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(200);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(200);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 10,
        bottom: 20,
        left: 160,
        right: 190,
        width: 30,
        height: 10,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      } as DOMRect);

      const res = service.calculateOptimalPosition('bottom');
      expect(res!.sidesAvaliable.has('right')).toBe(false);
      expect(res!.avaliablePosition.length).toBeGreaterThan(0);
      expect(res!.avaliablePosition.every((p) => p.includes('left'))).toBe(
        true
      );
    });

    it('should exclude bottom placements when bottom side not available', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(200);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(200);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 120,
        bottom: 170,
        left: 30,
        right: 80,
        width: 50,
        height: 50,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      } as DOMRect);

      const res = service.calculateOptimalPosition('top');
      expect(res!.sidesAvaliable.has('bottom')).toBe(false);
      expect(res!.avaliablePosition.length).toBeGreaterThan(0);
      expect(
        res!.avaliablePosition.every(
          (p) =>
            !p.includes('bottom') &&
            !['left', 'left-start', 'right', 'right-start'].includes(p)
        )
      ).toBe(true);
    });

    it('should allow left placement with only half width available when placement is vertical', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(200);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(200);
      // left space = 60 (between width/2 and width)
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 60,
        bottom: 80,
        left: 68,
        right: 88,
        width: 20,
        height: 20,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      } as DOMRect);

      const res = service.calculateOptimalPosition('bottom');
      expect(res!.sidesAvaliable.get('left')).toBe(60);
      expect(res!.sidesAvaliable.has('top')).toBe(false);
    });
  });

  describe('viewport utilities', () => {
    it('isElementInViewport should detect element visibility', () => {
      const el = document.createElement('div');
      vi.spyOn(el, 'getBoundingClientRect')
        .mockReturnValueOnce({
          top: 10,
          left: 10,
          bottom: 20,
          right: 20,
        } as DOMRect)
        .mockReturnValueOnce({
          top: -10,
          left: 0,
          bottom: 20,
          right: 20,
        } as DOMRect);

      expect(service.isElementInViewport(el)).toBe(true);
      expect(service.isElementInViewport(el)).toBe(false);
    });

    it('isElementInViewport should fall back to documentElement when window size is zero', () => {
      const el = document.createElement('div');
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(0);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(0);
      vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(
        500
      );
      vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(
        500
      );
      vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        left: 0,
        bottom: 400,
        right: 400,
      } as DOMRect);
      expect(service.isElementInViewport(el)).toBe(true);
    });

    it('should detect floating element outside viewport', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
      vi.spyOn(floatEl, 'getBoundingClientRect')
        .mockReturnValueOnce({
          top: -1,
          bottom: 99,
          left: 0,
          right: 100,
        } as DOMRect)
        .mockReturnValueOnce({
          top: 0,
          bottom: 1001,
          left: 0,
          right: 100,
        } as DOMRect)
        .mockReturnValueOnce({
          top: 0,
          bottom: 100,
          left: -1,
          right: 99,
        } as DOMRect)
        .mockReturnValueOnce({
          top: 0,
          bottom: 100,
          left: 0,
          right: 1001,
        } as DOMRect)
        .mockReturnValue({
          top: 0,
          bottom: 100,
          left: 0,
          right: 100,
        } as DOMRect);

      expect(service.isFloatingTopNotInViewport()).toBe(true);
      expect(service.isFloatingBottomNotInViewport()).toBe(true);
      expect(service.isFloatingLeftNotInViewport()).toBe(true);
      expect(service.isFloatingRightNotInViewport()).toBe(true);

      expect(service.isFloatingTopNotInViewport()).toBe(false);
      expect(service.isFloatingBottomNotInViewport()).toBe(false);
      expect(service.isFloatingLeftNotInViewport()).toBe(false);
      expect(service.isFloatingRightNotInViewport()).toBe(false);
    });

    it('should fall back to documentElement dimensions when window inner sizes are zero', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(0);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(0);
      vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(
        800
      );
      vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(
        800
      );
      vi.spyOn(floatEl, 'getBoundingClientRect')
        .mockReturnValueOnce({
          top: 0,
          bottom: 801,
          left: 0,
          right: 0,
        } as DOMRect)
        .mockReturnValueOnce({
          top: 0,
          bottom: 0,
          left: 0,
          right: 801,
        } as DOMRect)
        .mockReturnValue({
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        } as DOMRect);

      expect(service.isFloatingBottomNotInViewport()).toBe(true);
      expect(service.isFloatingRightNotInViewport()).toBe(true);
      expect(service.isFloatingBottomNotInViewport()).toBe(false);
      expect(service.isFloatingRightNotInViewport()).toBe(false);
    });

    it('should return false when floating element is not set', () => {
      expect(service.isFloatingTopNotInViewport()).toBe(false);
      expect(service.isFloatingBottomNotInViewport()).toBe(false);
      expect(service.isFloatingLeftNotInViewport()).toBe(false);
      expect(service.isFloatingRightNotInViewport()).toBe(false);
    });

    it('should determine if reference is under floating element', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(refEl, 'getBoundingClientRect')
        .mockReturnValueOnce({
          top: 10,
          bottom: 90,
          left: 10,
          right: 90,
        } as DOMRect)
        .mockReturnValueOnce({
          top: 10,
          bottom: 90,
          left: 10,
          right: 110,
        } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
      } as DOMRect);

      expect(service.isRefElementIsUnderFloating()).toBe(true);
      expect(service.isRefElementIsUnderFloating()).toBe(false);
    });

    it('should return false when ref or floating elements missing', () => {
      expect(service.isRefElementIsUnderFloating()).toBe(false);
      service.refElement = refEl;
      expect(service.isRefElementIsUnderFloating()).toBe(false);
      service.refElement = undefined as any;
      service.floatElement = floatEl;
      expect(service.isRefElementIsUnderFloating()).toBe(false);
    });
  });

  describe('evaluteCrossAxisOverflow', () => {
    it('filters start and end for top placements based on horizontal space', () => {
      const refRect = { width: 50, height: 50 } as DOMRect;
      const floatRect = { width: 100, height: 50 } as DOMRect;
      let spcs = { top: 20, bottom: 20, left: 60, right: 40 };
      let res = service.evaluteCrossAxisOverflow(
        ['top-start', 'top-end'],
        spcs,
        refRect,
        floatRect,
        'top'
      );
      expect(res).toEqual(['top-end']);

      spcs = { top: 20, bottom: 20, left: 40, right: 60 };
      res = service.evaluteCrossAxisOverflow(
        ['top-start', 'top-end'],
        spcs,
        refRect,
        floatRect,
        'top'
      );
      expect(res).toEqual(['top-start']);
    });

    it('filters start and end for left placements based on vertical space', () => {
      const refRect = { width: 50, height: 50 } as DOMRect;
      const floatRect = { width: 50, height: 100 } as DOMRect;
      let spcs = { top: 60, bottom: 40, left: 20, right: 20 };
      let res = service.evaluteCrossAxisOverflow(
        ['left-start', 'left-end'],
        spcs,
        refRect,
        floatRect,
        'left'
      );
      expect(res).toEqual(['left-end']);

      spcs = { top: 40, bottom: 60, left: 20, right: 20 };
      res = service.evaluteCrossAxisOverflow(
        ['left-start', 'left-end'],
        spcs,
        refRect,
        floatRect,
        'left'
      );
      expect(res).toEqual(['left-start']);
    });

    it('keeps placements with non start/end alignments', () => {
      const refRect = { width: 50, height: 50 } as DOMRect;
      const floatRect = { width: 60, height: 60 } as DOMRect;
      const spcs = { top: 10, bottom: 10, left: 10, right: 10 };
      const res = service.evaluteCrossAxisOverflow(
        ['top-middle'],
        spcs,
        refRect,
        floatRect,
        'top'
      );
      expect(res).toEqual(['top-middle']);
    });

    it('returns placements untouched when no alignment segment is present', () => {
      const refRect = { width: 50, height: 50 } as DOMRect;
      const floatRect = { width: 60, height: 60 } as DOMRect;
      const spcs = { top: 10, bottom: 10, left: 10, right: 10 };
      const res = service.evaluteCrossAxisOverflow(
        ['top', 'left'],
        spcs,
        refRect,
        floatRect,
        'top'
      );
      expect(res).toEqual(['top', 'left']);
    });
  });

  describe('internal helpers', () => {
    it('calculateAxisShift should return correct shift', () => {
      const calc = (service as any).calculateAxisShift.bind(service) as (
        start: number,
        end: number,
        min: number,
        max: number,
        tol: number
      ) => number;
      expect(calc(-5, 95, 0, 100, 10)).toBe(5);
      expect(calc(5, 105, 0, 100, 10)).toBe(-5);
      expect(calc(0, 100, 0, 100, 10)).toBe(0);
      expect(calc(-20, 80, 0, 100, 10)).toBe(0);
    });

    it('shiftElementIntoView should adjust element position', () => {
      service.floatElement = floatEl;
      const shift = (service as any).shiftElementIntoView.bind(service) as (
        boundary: DOMRect | undefined,
        rect: DOMRect,
        viewportH: number,
        viewportW: number,
        offset?: number
      ) => void;

      vi.spyOn(floatEl, 'getBoundingClientRect')
        .mockReturnValueOnce({
          left: -5,
          right: 95,
          top: 10,
          bottom: 210,
        } as DOMRect)
        .mockReturnValue({
          left: 10,
          right: 110,
          top: 50,
          bottom: 105,
        } as DOMRect);

      shift(
        undefined,
        { left: -5, right: 95, top: 10, bottom: 210 } as DOMRect,
        200,
        100,
        8
      );
      expect(floatEl.style.left).toBe('55px');
      expect(floatEl.style.top).toBe('');

      shift(
        undefined,
        { left: 10, right: 110, top: 50, bottom: 105 } as DOMRect,
        100,
        200,
        8
      );
      expect(floatEl.style.top).toBe('45px');
    });

    it('shiftElementIntoView should keep position when no shift needed', () => {
      service.floatElement = floatEl;
      const shift = (service as any).shiftElementIntoView.bind(service) as (
        boundary: DOMRect | undefined,
        rect: DOMRect,
        viewportH: number,
        viewportW: number,
        offset?: number
      ) => void;

      const rect = { left: 10, right: 110, top: 10, bottom: 110 } as DOMRect;
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(rect);
      shift(undefined, rect, 200, 200, 8);
      expect(floatEl.style.left).toBe('');
      expect(floatEl.style.top).toBe('');
    });
  });
});
