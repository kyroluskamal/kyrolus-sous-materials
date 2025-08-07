import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ButtonDirective } from './button.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

@Component({
  selector: 'app-button-test',
  template: `<button ksButton>Test Button</button>`,
  standalone: true,
  imports: [ButtonDirective],
})
export class DefaultButtonTestComponent {}
@Component({
  selector: 'app-button-test',
  template: `<button ksButton disabled>Test Button</button>`,
  standalone: true,
  imports: [ButtonDirective],
})
export class DisabledButtonTestComponent {}
@Component({
  selector: 'app-button-test',
  template: `<button
    ksButton
    size="sm"
    variant="outline"
    appearance="secondary"
    borderRadius="br-r-4"
    isRaised
    shape="rounded"
    RaisedClass="elevation-3"
  >
    Test Button
  </button>`,
  standalone: true,
  imports: [ButtonDirective],
})
export class CustomButtonTestComponent {}
@Component({
  selector: 'app-no-button-test',
  template: `<div ksButton>Test Button</div>`,
  standalone: true,
  imports: [ButtonDirective],
})
export class NonButtonTestComponent {}

describe('ButtonDirective', () => {
  describe('Default Button', () => {
    let fixture: ComponentFixture<DefaultButtonTestComponent>;
    let testElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DefaultButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DefaultButtonTestComponent);
      testElement = fixture.debugElement.query(By.directive(ButtonDirective));
      fixture.detectChanges();
    });
    it('should create an instance via TestBed', () => {
      const directiveInstance = testElement.injector.get(ButtonDirective);
      expect(directiveInstance).toBeTruthy();
    });
    it('Should have default size as "md"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-md')
      ).toBeTruthy();
    });
    it('Should have default solid variant meaning have btn-primary', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-primary')
      ).toBeTruthy();
    });
    it('Should have default appearance as "primary"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-primary')
      ).toBeTruthy();
    });

    it('Should have default border radius as "br-none"', () => {
      expect(
        testElement.nativeElement.classList.contains('br-none')
      ).toBeTruthy();
    });

    it('Should have small border radius', () => {
      expect(
        testElement.nativeElement.classList.contains('br-r-2')
      ).toBeTruthy();
    });

    it('Should NOT be raised as default', () => {
      expect(
        testElement.nativeElement.classList.contains('elevation-0')
      ).toBeTruthy();
    });
  });

  describe('Button with custom properties', () => {
    let fixture: ComponentFixture<CustomButtonTestComponent>;
    let testElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CustomButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(CustomButtonTestComponent);
      testElement = fixture.debugElement.query(By.directive(ButtonDirective));
      fixture.detectChanges();
    });

    it('should create an instance via TestBed', () => {
      const directiveInstance = testElement.injector.get(ButtonDirective);
      expect(directiveInstance).toBeTruthy();
    });

    it('Should have size as "sm"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-sm')
      ).toBeTruthy();
    });

    it('Should have outline variant with secondary appearance', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-outline-secondary')
      ).toBeTruthy();
    });

    it('Should have appearance as "secondary"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-outline-secondary')
      ).toBeTruthy();
    });

    it('Should have border radius as "br-r-4"', () => {
      expect(
        testElement.nativeElement.classList.contains('br-r-4')
      ).toBeTruthy();
    });

    it('Should have shape as "rounded"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-rounded')
      ).toBeTruthy();
    });

    it('Should have be raised with elevation-3 class', () => {
      expect(
        testElement.nativeElement.classList.contains('elevation-3')
      ).toBeTruthy();
    });
  });

  describe('Disabled Button', () => {
    let fixture: ComponentFixture<DisabledButtonTestComponent>;
    let testElement: DebugElement;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [DisabledButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DisabledButtonTestComponent);
      testElement = fixture.debugElement.query(By.directive(ButtonDirective));

      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should create an instance via TestBed', () => {
      const directiveInstance = testElement.injector.get(ButtonDirective);
      expect(directiveInstance).toBeTruthy();
    });

    it('Should have disabled attribute', () => {
      expect(testElement.nativeElement.hasAttribute('disabled')).toBeTruthy();
    });
    it('Should not be clicbale', () => {
      const clickEvent = new MouseEvent('click');
      vi.spyOn(clickEvent, 'preventDefault');
      vi.spyOn(clickEvent, 'stopPropagation');
      testElement.nativeElement.dispatchEvent(clickEvent);
      fixture.detectChanges();
      expect(clickEvent.preventDefault).toHaveBeenCalled();
      expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Non-button element with ButtonDirective', () => {
    let fixture: ComponentFixture<NonButtonTestComponent>;
    let testElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NonButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(NonButtonTestComponent);
      testElement = fixture.debugElement.query(By.directive(ButtonDirective));
    });

    it('should create an instance via TestBed', () => {
      const directiveInstance = testElement.injector.get(ButtonDirective);
      expect(directiveInstance).toBeTruthy();
    });

    it('should show console warning if the tag is not button or anchor tag', () => {
      vi.spyOn(console, 'warn');
      fixture.detectChanges();
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
