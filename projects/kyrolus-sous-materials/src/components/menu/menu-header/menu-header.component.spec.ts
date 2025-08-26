import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHeaderComponent } from './menu-header.component';
import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MenuComponent } from '../menu.exports';
import { By } from '@angular/platform-browser';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';
@Component({
  selector: 'ks-menu-header-test',
  template: `
    <ks-menu>
      <ks-menu-header useSeparator>Test Footer</ks-menu-header>
    </ks-menu>
    <ks-menu>
      <ks-menu-header useSeparator decorativeSeparator
        >Test Footer</ks-menu-header
      >
    </ks-menu>
    <ks-menu>
      <ks-menu-header> Test Footer</ks-menu-header>
    </ks-menu>
  `,
  standalone: true,
  imports: [MenuComponent, MenuHeaderComponent],
})
class TestHostComponent {}
describe('MenuHeaderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    debugElement = fixture.debugElement.queryAll(
      By.directive(MenuHeaderComponent)
    );
  });

  describe('ِComponent Function Tests', () => {
    it('Should has a separator when useSeparator is true', () => {
      const footer = debugElement[0].componentInstance;
      fixture.detectChanges();
      const separator = debugElement[0].query(By.css('hr'));
      expect(separator).not.toBeNull;
      expect(separator.nativeElement.classList).toContain('flex-basis-100');
      expect(footer.useSeparator()).toBeTruthy();
      expect(footer.decorativeSeparator()).toBeFalsy();
    });

    it('Should have a decorative separator when useSeparator and decorativeSeparator are true', () => {
      const footer = debugElement[1].componentInstance;
      fixture.detectChanges();
      const separator = debugElement[1].nativeElement.querySelector(
        'hr'
      ) as HTMLHRElement;
      expect(separator).not.toBeNull;
      expect(footer.useSeparator()).toBeTruthy();
      expect(footer.decorativeSeparator()).toBeTruthy();
      expect(separator.classList).toContain('flex-basis-100');

      expect(separator.getAttribute('aria-hidden')).toBe('true');
    });

    it('Should throw an error if used outside of ks-menu', () => {
      expect(() => {
        TestBed.createComponent(MenuHeaderComponent);
      }).toThrowError(getErrorMessageForMenuItemNotInMenu('Header'));
    });
    it('should not have a separator when useSeparator is false', () => {
      const footer = debugElement[2].componentInstance;
      fixture.detectChanges();
      const separator = debugElement[2].query(By.css('hr'));
      expect(separator).toBeNull();
      expect(footer.useSeparator()).toBeFalsy();
      expect(footer.decorativeSeparator()).toBeFalsy();
    });
  });

  describe('Aria tests', () => {
    it('should have role="none" on the host element', () => {
      const footer = debugElement[0].nativeElement;
      expect(footer.getAttribute('role')).toBe('none');
    });

    it('should have a separator with role="separator" when useSeparator is true and decorativeSeparator is false', () => {
      const separator = fixture.debugElement.query(By.css('hr'));
      expect(separator).not.toBeNull();
      expect(separator.nativeElement.getAttribute('role')).toBe('separator');
      expect(separator.nativeElement.getAttribute('aria-hidden')).toBeNull();
    });

    it('should have a decorative separator with role=null and aria-hidden="true" when useSeparator and decorativeSeparator are true', () => {
      const separator = fixture.debugElement.queryAll(By.css('hr'))[1];
      expect(separator).not.toBeNull();
      expect(separator.nativeElement.getAttribute('role')).toBeNull();
      expect(separator.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
