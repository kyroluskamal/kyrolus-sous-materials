import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ButtonDirective } from './button.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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
  selector: 'app-button-test',
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
      expect(testElement.nativeElement.classList.contains('btn-md')).toBeTrue();
    });
    it('Should have default solid variant meaning have btn-primary', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-primary')
      ).toBeTrue();
    });
    it('Should have default appearance as "primary"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-primary')
      ).toBeTrue();
    });

    it('Should have default border radius as "br-none"', () => {
      expect(
        testElement.nativeElement.classList.contains('br-none')
      ).toBeTrue();
    });

    it('Should have small border radius', () => {
      expect(testElement.nativeElement.classList.contains('br-r-2')).toBeTrue();
    });

    it('Should NOT be raised as default', () => {
      expect(
        testElement.nativeElement.classList.contains('elevation-0')
      ).toBeTrue();
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
      expect(testElement.nativeElement.classList.contains('btn-sm')).toBeTrue();
    });

    it('Should have outline variant with secondary appearance', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-outline-secondary')
      ).toBeTrue();
    });

    it('Should have appearance as "secondary"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-outline-secondary')
      ).toBeTrue();
    });

    it('Should have border radius as "br-r-4"', () => {
      expect(testElement.nativeElement.classList.contains('br-r-4')).toBeTrue();
    });

    it('Should have shape as "rounded"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-rounded')
      ).toBeTrue();
    });

    it('Should have be raised with elevation-3 class', () => {
      expect(
        testElement.nativeElement.classList.contains('elevation-3')
      ).toBeTrue();
    });
  });

  describe('Disabled Button', () => {
    let fixture: ComponentFixture<DisabledButtonTestComponent>;
    let testElement: DebugElement;
    let styles: CSSStyleDeclaration;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [DisabledButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DisabledButtonTestComponent);
      testElement = fixture.debugElement.query(By.directive(ButtonDirective));

      fixture.detectChanges();
      await fixture.whenStable();
      styles = window.getComputedStyle(testElement.nativeElement);
    });

    it('should create an instance via TestBed', () => {
      const directiveInstance = testElement.injector.get(ButtonDirective);
      expect(directiveInstance).toBeTruthy();
    });

    it('Should have disabled attribute', () => {
      expect(testElement.nativeElement.hasAttribute('disabled')).toBeTrue();
    });

    it('Should have opacity .6', () => {
      expect(styles.opacity).toBe('0.6');
    });
    it('Should have backgroundColor rgb(182, 182, 182', () => {
      expect(styles.backgroundColor).toBe('rgb(182, 182, 182)');
    });
    it('Should have cursor as not-allowed', () => {
      expect(styles.cursor).toBe('not-allowed');
    });
    it('Should have color rgb(27, 25, 25)', () => {
      expect(styles.color).toBe('rgb(27, 25, 25)');
    });
    it('Should not be clicbale', () => {
      const clickEvent = new MouseEvent('click');
      spyOn(clickEvent, 'preventDefault');
      spyOn(clickEvent, 'stopPropagation');
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
      spyOn(console, 'warn');
      fixture.detectChanges();
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
