import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { By } from '@angular/platform-browser';
@Component({
  selector: 'app-button-test',
  template: `<ks-button>Test Button</ks-button>`,
  standalone: true,
  imports: [ButtonComponent],
})
export class DefaultButtonTestComponent {}
@Component({
  selector: 'app-button-test',
  template: `<ks-button disabled>Test Button</ks-button>`,
  standalone: true,
  imports: [ButtonComponent],
})
export class DisabledButtonTestComponent {}
@Component({
  selector: 'app-button-test',
  template: `<ks-button
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
  </ks-button>`,
  standalone: true,
  imports: [ButtonComponent],
})
export class NonButtonTestComponent {}
describe('ButtonComponent', () => {
  describe('1. Default Button', () => {
    let fixture: ComponentFixture<DefaultButtonTestComponent>;
    let testElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DefaultButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DefaultButtonTestComponent);
      testElement = fixture.debugElement.query(By.directive(ButtonComponent));
      fixture.detectChanges();
    });
    it('1.1. should create an instance via TestBed', () => {
      const compInstance = testElement.injector.get(ButtonComponent);
      expect(compInstance).toBeTruthy();
    });
    it('1.2. Should have default size as "md"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-md')
      ).toBeTruthy();
    });
    it('1.3. Should have default solid variant meaning have btn-primary', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-primary')
      ).toBeTruthy();
    });
    it('1.4. Should have default appearance as "primary"', () => {
      expect(
        testElement.nativeElement.classList.contains('btn-primary')
      ).toBeTruthy();
    });

    it('1.5. Should have default border radius as "br-none"', () => {
      expect(
        testElement.nativeElement.classList.contains('br-none')
      ).toBeTruthy();
    });

    it('1.6. Should have small border radius', () => {
      expect(
        testElement.nativeElement.classList.contains('br-r-2')
      ).toBeTruthy();
    });

    it('1.7. Should NOT be raised as default', () => {
      expect(
        testElement.nativeElement.classList.contains('elevation-0')
      ).toBeTruthy();
    });
  });

  describe('2. Disabled Button', () => {
    let fixture: ComponentFixture<DisabledButtonTestComponent>;
    let testElement: DebugElement;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [DisabledButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(DisabledButtonTestComponent);
      testElement = fixture.debugElement.query(By.directive(ButtonComponent));

      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('2.1 should create an instance via TestBed', () => {
      const compInstance = testElement.injector.get(ButtonComponent);
      expect(compInstance).toBeTruthy();
    });

    it('2.2 Should have disabled attribute', () => {
      expect(testElement.nativeElement.hasAttribute('disabled')).toBeTruthy();
    });
    it('2.3 Should not be clicbale', () => {
      const clickEvent = new MouseEvent('click');
      vi.spyOn(clickEvent, 'preventDefault');
      vi.spyOn(clickEvent, 'stopPropagation');
      testElement.nativeElement.dispatchEvent(clickEvent);
      fixture.detectChanges();
      expect(clickEvent.preventDefault).toHaveBeenCalled();
      expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('3. Non-button element with ButtonDirective', () => {
    let fixture: ComponentFixture<NonButtonTestComponent>;
    let testElement: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NonButtonTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(NonButtonTestComponent);
      testElement = fixture.debugElement.query(By.directive(ButtonComponent));
    });

    it('3.1. should create an instance via TestBed', () => {
      const compInstance = testElement.injector.get(ButtonComponent);
      expect(compInstance).toBeTruthy();
    });

    it('3.2. should show console warning if the tag is not button or anchor tag', () => {
      vi.spyOn(console, 'warn');
      fixture.detectChanges();
      expect(console.warn).toHaveBeenCalled();
    });
  });
});
