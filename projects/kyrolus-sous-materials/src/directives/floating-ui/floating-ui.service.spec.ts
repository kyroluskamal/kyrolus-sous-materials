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
  it('0.1. should not require scrolling by default', () => {
    const freshService = new FloatingUiService();

    expect(freshService.shouldScroll()).toBe(false);
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
    it('2.6. should detect negative computed horizontal positions', () => {
      service.setElements(refEl, floatEl);

      const style = {
        getPropertyValue: (property: string) =>
          property === 'left' || property === 'right' ? '-10px' : '0px',
      } as unknown as CSSStyleDeclaration;
      vi.spyOn(window, 'getComputedStyle').mockReturnValue(style);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
      } as DOMRect);

      expect(service.isFloatingLeftNotInViewport()).toBe(true);
      expect(service.isFloatingRightNotInViewport()).toBe(true);
    });

    it('2.7. should handle empty computed style values', () => {
      service.setElements(refEl, floatEl);

      const style = {
        getPropertyValue: () => '',
      } as unknown as CSSStyleDeclaration;
      vi.spyOn(window, 'getComputedStyle').mockReturnValue(style);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 10,
        bottom: 110,
        left: 10,
        right: 110,
      } as DOMRect);

      expect(service.isFloatingLeftNotInViewport()).toBe(false);
      expect(service.isFloatingRightNotInViewport()).toBe(false);
    });

  });
  describe('3. fallback placements when no preferred positions remain', () => {
    const floatRect = {
      top: 0,
      bottom: 450,
      left: 0,
      right: 100,
      width: 100,
      height: 450,
    } as DOMRect;

    let originalScrollTo: typeof window.scrollTo;

    beforeEach(() => {
      originalScrollTo = window.scrollTo;
      (window as any).scrollTo = vi.fn();
    });

    afterEach(() => {
      window.scrollTo = originalScrollTo;
    });

    it('3.1. should fallback to right-start when only horizontal sides (right and left) are available and the placement is right, right-start or right-end', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(130);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 40,
        bottom: 100,
        left: 160,
        right: 200,
        width: 40,
        height: 60,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('right');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['right-start']);

      res = service.calculateOptimalPosition('right-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['right-start']);

      res = service.calculateOptimalPosition('right-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['right-start']);
    });
    it('3.2. should fallback to left-start when only horizontal sides (right and left) are available and the placement is left, left-start or left-end', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(130);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 40,
        bottom: 100,
        left: 160,
        right: 200,
        width: 40,
        height: 60,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('left');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['left-start']);

      res = service.calculateOptimalPosition('left-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['left-start']);

      res = service.calculateOptimalPosition('left-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['left-start']);
    });
    it('3.3. should fallback to bottom-start when only horizontal sides (right and left) are available and the placement is bottom-start or top-start', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(130);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 40,
        bottom: 100,
        left: 160,
        right: 200,
        width: 40,
        height: 60,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('bottom-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['bottom-start']);

      res = service.calculateOptimalPosition('top-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['bottom-start']);
    });
    it('3.4. should fallback to bottom-end when only horizontal sides (right and left) are available and the placement is bottom-end or top-end', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(130);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 40,
        bottom: 100,
        left: 160,
        right: 200,
        width: 40,
        height: 60,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('bottom-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['bottom-end']);

      res = service.calculateOptimalPosition('top-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['bottom-end']);
    });
    it('3.5. should fallback to bottom when only horizontal sides (right and left) are available and the placement is bottom or top', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(130);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 40,
        bottom: 100,
        left: 160,
        right: 200,
        width: 40,
        height: 60,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('bottom');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['bottom']);

      res = service.calculateOptimalPosition('top');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left', 'right']);
      expect(res!.sidesAvaliable.size).toBe(2);
      expect(res!.avaliablePosition).toEqual(['bottom']);
    });

    it('3.6. should fallback to right-start when only the right side is available and the placement is right, right-start, right-end, left, left-start or left-end', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(160);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(240);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 48,
        bottom: 122,
        left: 48,
        right: 108,
        width: 60,
        height: 74,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('right');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['right-start']);

      res = service.calculateOptimalPosition('right-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['right-start']);

      res = service.calculateOptimalPosition('right-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['right-start']);

      res = service.calculateOptimalPosition('left');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['right-start']);

      res = service.calculateOptimalPosition('left-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['right-start']);

      res = service.calculateOptimalPosition('left-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['right-start']);
    });
    it('3.7. should fallback to bottom-start when only the right side is available and the placement is bottom, bottom-start, bottom-end, top, top-start or top-end', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(160);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(240);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 48,
        bottom: 122,
        left: 48,
        right: 108,
        width: 60,
        height: 74,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('bottom');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-start']);

      res = service.calculateOptimalPosition('bottom-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-start']);

      res = service.calculateOptimalPosition('bottom-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-start']);

      res = service.calculateOptimalPosition('top');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-start']);

      res = service.calculateOptimalPosition('top-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-start']);

      res = service.calculateOptimalPosition('top-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['right']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-start']);
    });

    it('3.8. should fallback to left-start when only the left side is available and the placement is right, right-start, right-end, left, left-start or left-end', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(140);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(260);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 40,
        bottom: 100,
        left: 160,
        right: 200,
        width: 40,
        height: 60,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('right');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['left-start']);

      res = service.calculateOptimalPosition('right-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['left-start']);

      res = service.calculateOptimalPosition('right-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['left-start']);

      res = service.calculateOptimalPosition('left');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['left-start']);

      res = service.calculateOptimalPosition('left-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['left-start']);

      res = service.calculateOptimalPosition('left-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['left-start']);
    });
    it('3.9. should fallback to bottom-end when only the left side is available and the placement is bottom, bottom-start, bottom-end, top, top-start or top-end', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(140);
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(240);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 40,
        bottom: 100,
        left: 160,
        right: 200,
        width: 40,
        height: 60,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue(floatRect);

      let res = service.calculateOptimalPosition('bottom');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-end']);

      res = service.calculateOptimalPosition('bottom-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-end']);

      res = service.calculateOptimalPosition('bottom-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-end']);

      res = service.calculateOptimalPosition('top');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-end']);

      res = service.calculateOptimalPosition('top-start');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-end']);

      res = service.calculateOptimalPosition('top-end');
      expect(res).toBeDefined();
      expect([...res!.sidesAvaliable.keys()]).toEqual(['left']);
      expect(res!.sidesAvaliable.size).toBe(1);
      expect(res!.avaliablePosition).toEqual(['bottom-end']);
    });
  });

  describe('4. scrollToElementIfNeeded', () => {
    it('4.1. should scroll up when the floating element would overflow above the viewport', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1000);
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(200);
      const scrollSpy = vi
        .spyOn(window, 'scrollTo')
        .mockImplementation(() => undefined);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 50,
        bottom: 100,
        left: 0,
        right: 50,
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

      (service as any).scrollToElementIfNeeded();

      expect(service.shouldScroll()).toBe(true);
      expect(scrollSpy).toHaveBeenCalledTimes(1);
      const [options] = scrollSpy.mock.calls[0];
      const top = (options as ScrollToOptions).top as number;
      expect(top).toBeLessThan(200);
      expect((options as ScrollToOptions).behavior).toBe('smooth');

      scrollSpy.mockClear();
      (service as any).scrollToElementIfNeeded();
      expect(scrollSpy).not.toHaveBeenCalled();
    });

    it('4.2. should scroll down when the floating element would overflow below the viewport', () => {
      service.setElements(refEl, floatEl);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(50);
      const scrollSpy = vi
        .spyOn(window, 'scrollTo')
        .mockImplementation(() => undefined);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 400,
        bottom: 900,
        left: 0,
        right: 50,
        width: 50,
        height: 500,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      } as DOMRect);

      (service as any).scrollToElementIfNeeded();

      expect(service.shouldScroll()).toBe(true);
      expect(scrollSpy).toHaveBeenCalledTimes(1);
      const [options] = scrollSpy.mock.calls[0];
      const top = (options as ScrollToOptions).top as number;
      expect(top).toBeGreaterThan(50);
      expect((options as ScrollToOptions).behavior).toBe('smooth');

      scrollSpy.mockClear();
      (service as any).scrollToElementIfNeeded();
      expect(scrollSpy).not.toHaveBeenCalled();
    });
  });

  describe('5. computeSpacesAroundRef', () => {
    it('5.1. should calculate spaces using the boundary rectangle when provided', () => {
      const refRect = {
        top: 75,
        bottom: 150,
        left: 90,
        right: 170,
        width: 80,
        height: 75,
      } as DOMRect;
      const boundaryRect = {
        top: 50,
        bottom: 400,
        left: 70,
        right: 500,
        width: 430,
        height: 350,
      } as DOMRect;

      const result = service['computeSpacesAroundRef'](
        refRect,
        boundaryRect,
        5,
        600,
        800
      );

      expect(result).toEqual({
        top: 20,
        bottom: 245,
        left: 15,
        right: 325,
      });
    });

    it('5.2. should calculate spaces using the viewport when no boundary rectangle is provided', () => {
      const refRect = {
        top: 140,
        bottom: 220,
        left: 160,
        right: 260,
        width: 100,
        height: 80,
      } as DOMRect;

      const result = service['computeSpacesAroundRef'](
        refRect,
        undefined,
        12,
        640,
        1024
      );

      expect(result).toEqual({
        top: 128,
        bottom: 408,
        left: 148,
        right: 752,
      });
    });
  });

  describe('6. scroll handling', () => {
    it('6.1. should not trigger scrolling when reference has enough surrounding space', () => {
      service.setElements(refEl, floatEl);
      const scrollToSpy = vi.spyOn(window, 'scrollTo');

      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
      vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
        top: 200,
        bottom: 260,
        left: 200,
        right: 260,
        width: 60,
        height: 60,
      } as DOMRect);
      vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      } as DOMRect);

      expect(service.shouldScroll()).toBe(false);
      (service as any).scrollToElementIfNeeded();

      expect(scrollToSpy).not.toHaveBeenCalled();
      expect(service.shouldScroll()).toBe(false);
    });
  });
});
