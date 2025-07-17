// 1. استيراد المكتبات الأساسية من Angular Testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { ToggleClassOnScrollDirective } from './toggle-class-on-scroll.directive';

@Component({
  template: `
    <div
      style="height: 200px; border: 1px solid black;"
      ksToggleClassOnScroll="scrolled-past"
      [ksScrollOffset]="scrollOffset()"
    >
      Test Element
    </div>
  `,
  standalone: true,
  imports: [ToggleClassOnScrollDirective],
})
class TestHostComponent {
  scrollOffset = signal(100);
}

describe('ToggleClassOnScrollDirective with Karma (Zoneless)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let testElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    testElement = fixture.debugElement.query(
      By.directive(ToggleClassOnScrollDirective)
    );

    fixture.detectChanges();
  });

  function simulateScroll(y: number) {
    Object.defineProperty(document.defaultView, 'scrollY', {
      value: y,

      configurable: true,
    });

    document.defaultView?.dispatchEvent(new Event('scroll'));

    fixture.detectChanges();
  }

  it('should create an instance via TestBed', () => {
    const directiveInstance = testElement.injector.get(
      ToggleClassOnScrollDirective
    );
    expect(directiveInstance).toBeTruthy();
  });

  it('should HAVE the class initially when scrollY is 0', () => {
    expect(testElement.nativeElement.classList.contains('scrolled-past')).toBe(
      true
    );
  });

  it('should REMOVE the class when scrolling past the offset', () => {
    simulateScroll(200);

    expect(testElement.nativeElement.classList.contains('scrolled-past')).toBe(
      false
    );
  });

  it('should ADD the class AGAIN when scrolling back before the offset', () => {
    simulateScroll(200);
    expect(testElement.nativeElement.classList.contains('scrolled-past'))
      .withContext('Class should be removed after scrolling down')
      .toBe(false);

    simulateScroll(50);

    expect(testElement.nativeElement.classList.contains('scrolled-past'))
      .withContext('Class should be added back after scrolling up')
      .toBe(true);
  });

  it('should respect a custom offset value', () => {
    fixture.componentInstance.scrollOffset.set(300);

    simulateScroll(250);
    expect(testElement.nativeElement.classList.contains('scrolled-past')).toBe(
      true
    );

    simulateScroll(350);
    expect(testElement.nativeElement.classList.contains('scrolled-past')).toBe(
      false
    );
  });
});
