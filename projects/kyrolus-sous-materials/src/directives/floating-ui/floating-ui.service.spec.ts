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

  describe('1. calculateOptimalPosition', () => {
    it('1.1. should return undefined when ref or float element missing', () => {
      const res = service.calculateOptimalPosition('bottom');
      expect(res).toBeUndefined();
    });

    it('1.2. should early return when all sides have space', () => {
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

    it('1.3. should compute available positions considering boundary', () => {
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

    it('1.4. should exclude top/bottom/right placements when right side not available', () => {
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

    it('1.5. should exclude bottom placements when bottom side not available', () => {
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

    it('1.6. should allow left placement with only half width available when placement is vertical', () => {
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

  describe('2. viewport utilities', () => {
    it('2.1. should detect floating element outside viewport', () => {
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

    it('2.2. should fall back to documentElement dimensions when window inner sizes are zero', () => {
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

    it('2.3. should return false when floating element is not set', () => {
      expect(service.isFloatingTopNotInViewport()).toBe(false);
      expect(service.isFloatingBottomNotInViewport()).toBe(false);
      expect(service.isFloatingLeftNotInViewport()).toBe(false);
      expect(service.isFloatingRightNotInViewport()).toBe(false);
    });

    it('2.4. should determine if reference is under floating element', () => {
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

    it('2.5. should return false when ref or floating elements missing', () => {
      expect(service.isRefElementIsUnderFloating()).toBe(false);
      service.refElement = refEl;
      expect(service.isRefElementIsUnderFloating()).toBe(false);
      service.refElement = undefined as any;
      service.floatElement = floatEl;
      expect(service.isRefElementIsUnderFloating()).toBe(false);
    });
  });

  // describe('5. Fallback tests if the menu is longer than the viewport where only 2 or one sides avaliable', () => {
  //   beforeEach(() => {
  //     Object.defineProperty(floatEl, 'offsetHeight', { value: 2000 });
  //     Object.defineProperty(boundaryEl, 'offsetHeight', { value: 1500 });
  //     Object.defineProperty(boundaryEl, 'offsetWidth', { value: 1500 });
  //   });

  //   it('5.1. should return the best position when only 2 sides avaliable', () => {
  //     service.setElements(refEl, floatEl, boundaryEl);
  //     vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
  //     vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
  //     vi.spyOn(boundaryEl, 'getBoundingClientRect').mockReturnValue({
  //       top: 0,
  //       bottom: 1000,
  //       left: 0,
  //       right: 1000,
  //       width: 1000,
  //       height: 1000,
  //     } as DOMRect);
  //     vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
  //       top: 400,
  //       bottom: 450,
  //       left: 400,
  //       right: 450,
  //       width: 50,
  //       height: 50,
  //     } as DOMRect);
  //     vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
  //       top: 0,
  //       bottom: 2000,
  //       left: 0,
  //       right: 100,
  //       width: 100,
  //       height: 2000,
  //     } as DOMRect);

  //     const res = service.calculateOptimalPosition('bottom');
  //     expect(res?.avaliablePosition.length).toBe(1);
  //     expect(res?.avaliablePosition[0]).toBe('right-start');
  //     expect(res!.sidesAvaliable.size).toBe(2);
  //     expect(res!.sidesAvaliable.has('right')).toBe(true);
  //     expect(res!.sidesAvaliable.has('left')).toBe(true);
  //   });
  // });
});
