import {
  Component,
  DebugElement,
  PLATFORM_ID,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FloatingUIDirective } from './floating-ui.directive';
import { PopoverPlacement } from '../../blocks/popover-menu/popover.types';
import { By } from '@angular/platform-browser';

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
  });
  afterAll(() => {
    delete (globalThis as any).ResizeObserver;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    refEl = fixture.nativeElement.querySelector('div');
    floatEl = fixture.nativeElement.querySelector('[ksFloatingUI]');
    debugElement = fixture.debugElement.query(
      By.directive(FloatingUIDirective)
    );
    component = debugElement.injector.get(FloatingUIDirective);
    Object.defineProperty(floatEl, 'offsetWidth', { value: 100 });
    Object.defineProperty(floatEl, 'offsetHeight', { value: 200 });
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
  it('1.10. should return early when there is enough space on all four sides', () => {
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

    // mock ResizeObserver بحيث نخزن الكولباك
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
});
