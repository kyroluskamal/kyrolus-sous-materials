import {
  Component,
  DebugElement,
  PLATFORM_ID,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { FloatingUIDirective } from './floating-ui.directive';
import { PopoverPlacement } from '../../blocks/popover-menu/popover.types';
import { BrowserModule, By } from '@angular/platform-browser';
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
@Component({
  template: `
    <div #ref style="width:100px;height:50px;"></div>
    <div
      style="height: 200px;"
      ksFloatingUI
      [referenceElement]="ref"
      [(placement)]="placement"
      [offset]="offset"
    >
      Floating Content
    </div>
  `,
  standalone: true,
  imports: [FloatingUIDirective],
})
class HostComponent {
  placement = signal<PopoverPlacement>('bottom');
  offset = '8';
}

@Component({
  template: `
    <div #boundary style="position:relative;height:400px;width:400px;">
      <div #ref style="width:100px;height:50px;"></div>
      <div
        ksFloatingUI
        [referenceElement]="ref"
        [boundaryElement]="boundary"
        [(placement)]="placement"
        [offset]="offset"
      >
        Floating Content
      </div>
    </div>
  `,
  standalone: true,
  imports: [FloatingUIDirective],
})
class HostBoundaryComponent {
  placement = signal<PopoverPlacement>('bottom');
  offset = '8';
}

@Component({
  template: `
    <div
      ksFloatingUI
      [referenceElement]="ref"
      [(placement)]="placement"
      [offset]="offset"
    ></div>
  `,
  standalone: true,
  imports: [FloatingUIDirective],
})
class HostNoRefComponent {
  ref!: HTMLElement;
  placement = signal<PopoverPlacement>('bottom');
  offset = '8';
}

describe('1. FloatingUIDirective', () => {
  let fixture: any;
  let refEl: HTMLElement;
  let floatEl: HTMLElement;
  let debugElement: DebugElement;
  let component: FloatingUIDirective;
  beforeAll(() => {
    class ResizeObserverMock {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    // attach to global/window
    (globalThis as any).ResizeObserver = ResizeObserverMock;
    const testBed = getTestBed();
    if (!testBed.platform) {
      testBed.initTestEnvironment(
        BrowserTestingModule,
        platformBrowserTesting()
      );
    }
  });
  afterAll(() => {
    delete (globalThis as any).ResizeObserver;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserModule, HostComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    refEl = fixture.nativeElement.querySelector('div');
    floatEl = fixture.nativeElement.querySelector('[ksFloatingUI]');
    debugElement = fixture.debugElement.query(
      By.directive(FloatingUIDirective),
    );
    component = debugElement.injector.get(FloatingUIDirective);
    Object.defineProperty(floatEl, 'offsetWidth', { value: 100, configurable: true });
    Object.defineProperty(floatEl, 'offsetHeight', { value: 200, configurable: true });
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200);
    fixture.detectChanges();
  });

  it('1.1. should choose right-end if there is space avaliable on the top and on the right only and the placement is bottom', () => {
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 742,
      bottom: 792,
      left: 0,
      right: 100,
      width: 100,
      height: 50,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('right-end');
  });
  it('1.2. should choose top if there is space avaliable on the top, on the right and on the left only the placement is bottom', () => {
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 742,
      bottom: 792,
      left: 500,
      right: 600,
      width: 100,
      height: 50,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('top');
  });
  it('1.3. should choose left-end if there is space avaliable on the top, on the right only the placement is bottom', () => {
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 742,
      bottom: 792,
      left: 1100,
      right: 1200,
      width: 100,
      height: 50,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('left-end');
  });
  it('1.4. should choose right-start if there is space avaliable on the bottom, on the right only the placement is top', () => {
    fixture.componentInstance.placement.set('top');
    fixture.detectChanges();
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 8,
      bottom: 58,
      left: 0,
      right: 100,
      width: 100,
      height: 50,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('right-start');
  });
  it('1.5. should choose bottom if there is space avaliable on the bottom, on the right and on the left only the placement is top', () => {
    fixture.componentInstance.placement.set('top');
    fixture.detectChanges();
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 8,
      bottom: 58,
      left: 500,
      right: 600,
      width: 100,
      height: 50,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('bottom');
  });
  it('1.6. should choose left-start if there is space avaliable on the bottom, on the left only the placement is top', () => {
    fixture.componentInstance.placement.set('top');
    fixture.detectChanges();
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 8,
      bottom: 58,
      left: 1100,
      right: 1200,
      width: 100,
      height: 50,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('left-start');
  });
  it('1.7. should choose right if there is space avaliable on the bottom, on the right and on the top only, only the placement is left', () => {
    fixture.componentInstance.placement.set('left');
    fixture.detectChanges();
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 300,
      bottom: 350,
      left: 0,
      right: 100,
      width: 100,
      height: 50,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('right');
  });
  it('1.8. should choose left if there is space avaliable on the bottom, on the left and on the top only, only the placement is left', () => {
    fixture.componentInstance.placement.set('left');
    fixture.detectChanges();
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 300,
      bottom: 350,
      left: 1100,
      right: 1200,
      width: 100,
      height: 50,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('left');
  });
  it('1.9. should return early if reference element has no dimensions', () => {
    const initialPlacement = fixture.componentInstance.placement();
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue(undefined as any);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe(initialPlacement);
  });
  it('1.10. should retain original placement when ample space is available on all sides', () => {
    const initialPlacement = fixture.componentInstance.placement();
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 375,
      bottom: 425,
      left: 550,
      right: 650,
      width: 100,
      height: 50,
    } as DOMRect);

    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe(initialPlacement);
  });
  it('1.11. should create and observe with ResizeObserver if available', () => {
    const mockObserve = vi.fn();
    let callback!: () => void;
    (globalThis as any).ResizeObserver = vi.fn().mockImplementation((cb) => {
      callback = cb;
      return {
        observe: mockObserve,
        disconnect: vi.fn(),
      };
    });

    const fixtureLocal = TestBed.createComponent(HostComponent);
    const dir = fixtureLocal.debugElement
      .query(By.directive(FloatingUIDirective))
      .injector.get(FloatingUIDirective);
    fixtureLocal.detectChanges();
    expect(globalThis.ResizeObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledWith(document.body);
    const adjustSpy = vi.spyOn<any, any>(dir, 'adjustPlacement');

    callback();

    expect(adjustSpy).toHaveBeenCalled();
  });

  it('1.12. should disconnect ResizeObserver on destroy', () => {
    const mockDisconnect = vi.fn();
    (globalThis as any).ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: mockDisconnect,
    }));

    const fixtureLocal = TestBed.createComponent(HostComponent);
    fixtureLocal.debugElement
      .query(By.directive(FloatingUIDirective))
      .injector.get(FloatingUIDirective);

    fixtureLocal.destroy();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('1.13. should switch to right-end when not enough space on bottom for taller float element', () => {
    fixture.componentInstance.placement.set('right-start');
    fixture.detectChanges();

    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 650,
      bottom: 700,
      left: 100,
      right: 200,
      width: 100,
      height: 50,
    } as DOMRect);

    vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
      top: 650,
      bottom: 850,
      left: 200,
      right: 300,
      width: 100,
      height: 200,
    } as DOMRect);

    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(fixture.componentInstance.placement()).toBe('right-end');
  });

  it('1.14. should shift floating element horizontally when slightly off-screen', () => {
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 150,
      left: 100,
      right: 200,
      width: 100,
      height: 50,
    } as DOMRect);

    const floatRects = [
      {
        top: 100,
        bottom: 300,
        left: -5,
        right: 95,
        width: 100,
        height: 200,
      } as DOMRect,
      {
        top: 100,
        bottom: 300,
        left: 0,
        right: 100,
        width: 100,
        height: 200,
      } as DOMRect,
    ];
    let call = 0;
    vi.spyOn(floatEl, 'getBoundingClientRect').mockImplementation(
      () => floatRects[Math.min(call++, floatRects.length - 1)],
    );
    Object.defineProperty(floatEl, 'offsetLeft', { value: 0 });
    // @ts-expect-error: private method
    component.adjustPlacement();

    expect(floatEl.style.left).toBe('5px');
  });
  it('1.15. should clamp dimensions when float element exceeds viewport', () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(150);
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(150);
    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 50,
      left: 0,
      right: 100,
      width: 100,
      height: 50,
    } as DOMRect);
    vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 250,
      left: 0,
      right: 250,
      width: 250,
      height: 250,
    } as DOMRect);
    // @ts-expect-error: private method
    component.adjustPlacement();
    expect(floatEl.style.maxHeight).toBe('142px');
    expect(floatEl.style.overflowY).toBe('auto');
    expect(floatEl.style.maxWidth).toBe('142px');
    expect(floatEl.style.overflowX).toBe('auto');
  });

  it('1.16. should call adjustPlacement on window scroll with debounce', async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn<any, any>(component, 'adjustPlacement');
    window.dispatchEvent(new Event('scroll'));
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(spy).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('1.17. should remove scroll listener on destroy', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    fixture.destroy();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('1.18. should keep menu within boundary element', () => {
    const fixtureBoundary = TestBed.createComponent(HostBoundaryComponent);
    const boundaryEl = fixtureBoundary.nativeElement.querySelector('div');
    const refEl = boundaryEl.querySelector('div');
    const floatEl = boundaryEl.querySelector('[ksFloatingUI]') as HTMLElement;
    const debug = fixtureBoundary.debugElement.query(
      By.directive(FloatingUIDirective),
    );
    const dir = debug.injector.get(FloatingUIDirective);

    Object.defineProperty(floatEl, 'offsetWidth', { value: 100 });
    Object.defineProperty(floatEl, 'offsetHeight', { value: 200 });

    vi.spyOn(boundaryEl, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 400,
      left: 0,
      right: 400,
      width: 400,
      height: 400,
    } as DOMRect);

    vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
      top: 350,
      bottom: 400,
      left: 100,
      right: 200,
      width: 100,
      height: 50,
    } as DOMRect);

    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200);

    fixtureBoundary.detectChanges();

    // @ts-expect-error: private method
    dir.adjustPlacement();
    expect(fixtureBoundary.componentInstance.placement()).toBe('top');
  });

  it('1.19. should skip browser logic when not in platform browser', async () => {
    fixture.destroy();
    const addSpy = vi.spyOn(window, 'addEventListener');
    const resizeSpy = vi.spyOn(globalThis as any, 'ResizeObserver');

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [BrowserModule, HostComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    }).compileComponents();

    const fixtureLocal = TestBed.createComponent(HostComponent);
    fixtureLocal.detectChanges();

    expect(resizeSpy).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalledWith('scroll', expect.any(Function));
    fixtureLocal.destroy();
  });

  it('1.20. should handle absence of ResizeObserver and remove scroll listener', async () => {
    fixture.destroy();
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const originalRO = (globalThis as any).ResizeObserver;
    delete (globalThis as any).ResizeObserver;

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [BrowserModule, HostComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    const fixtureLocal = TestBed.createComponent(HostComponent);
    const dir = fixtureLocal.debugElement
      .query(By.directive(FloatingUIDirective))
      .injector.get(FloatingUIDirective);

    fixtureLocal.detectChanges();

    expect((dir as any).resizeObserver).toBeUndefined();
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    fixtureLocal.destroy();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    (globalThis as any).ResizeObserver = originalRO;
  });

  it('1.21. should not adjust placement when referenceElement is missing', async () => {
    fixture.destroy();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [BrowserModule, HostNoRefComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    const fixtureLocal = TestBed.createComponent(HostNoRefComponent);
    const dir = fixtureLocal.debugElement
      .query(By.directive(FloatingUIDirective))
      .injector.get(FloatingUIDirective);
    const adjustSpy = vi.spyOn<any, any>(dir, 'adjustPlacement');

    fixtureLocal.detectChanges();
    expect(adjustSpy).not.toHaveBeenCalled();

    vi.useFakeTimers();
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(adjustSpy).not.toHaveBeenCalled();
    vi.useRealTimers();
    fixtureLocal.destroy();
  });
   it('1.22. should fall back to left-end when bottom and right space are limited', () => {
     fixture.componentInstance.placement.set('bottom');
     vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(100);
     vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(100);

     vi.spyOn(refEl, 'getBoundingClientRect').mockReturnValue({
       top: 60,
       bottom: 80,
       left: 50,
       right: 70,
       width: 20,
       height: 20,
     } as DOMRect);

     vi.spyOn(floatEl, 'getBoundingClientRect').mockReturnValue({
       top: 0,
       bottom: 30,
       left: 0,
       right: 30,
       width: 30,
       height: 30,
     } as DOMRect);

     Object.defineProperty(floatEl, 'offsetHeight', {
       value: 30,
       configurable: true,
     });
     Object.defineProperty(floatEl, 'offsetWidth', {
       value: 30,
       configurable: true,
     });

     const calcSpy = vi.spyOn<any, any>(
       component['floatingUiService'],
       'calculateOptimalPosition'
     );

     // @ts-expect-error: private method
     component.adjustPlacement();

     expect(calcSpy).toHaveBeenCalled();
     expect(fixture.componentInstance.placement()).toBe('left-end');
   });

   it('1.23. should pass reference, floating, and boundary elements to the service on render', async () => {
     const fixtureBoundary = TestBed.createComponent(HostBoundaryComponent);
     const boundaryEl = fixtureBoundary.nativeElement.querySelector('div');
     const refEl = boundaryEl.querySelector('div');
     const floatEl = boundaryEl.querySelector('[ksFloatingUI]');
     const dir = fixtureBoundary.debugElement
       .query(By.directive(FloatingUIDirective))
       .injector.get(FloatingUIDirective);
     const setSpy = vi.spyOn<any, any>(dir['floatingUiService'], 'setElements');

     fixtureBoundary.detectChanges();
     await fixtureBoundary.whenStable();

     expect(setSpy).toHaveBeenCalledWith(refEl, floatEl, boundaryEl);
     fixtureBoundary.destroy();
   });

   it('1.24. should choose side with most space when no placement fits', () => {
     const calcSpy = vi
       .spyOn<any, any>(
         component['floatingUiService'],
         'calculateOptimalPosition'
       )
       .mockReturnValue({
         avaliablePosition: [],
         sidesAvaliable: new Map([
           ['left', 50],
           ['right', 100],
         ]),
         spcesArroundRef: { left: 50, right: 100 },
         floatRect: { height: 50, width: 50 } as DOMRect,
         viewportHeight: 1000,
         viewportWidth: 1000,
       });

     // @ts-expect-error: private method
     component.adjustPlacement();

     expect(calcSpy).toHaveBeenCalled();
     expect(fixture.componentInstance.placement()).toBe('right');
   });
});
