import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuFooterComponent } from './menu-footer.component';
import { MenuComponent } from '../menu.exports';
import { By } from '@angular/platform-browser';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';

@Component({
  template: `
    <ks-menu>
      <ks-menu-footer useSeparator>Test Footer</ks-menu-footer>
    </ks-menu>
    <ks-menu>
      <ks-menu-footer useSeparator decorativeSeparator
        >Test Footer</ks-menu-footer
      >
    </ks-menu>
    <ks-menu>
      <ks-menu-footer>Test Footer</ks-menu-footer>
    </ks-menu>
  `,
  standalone: true,
  imports: [MenuComponent, MenuFooterComponent],
})
class TestHostComponent {}
describe('MenuFooterComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    debugElement = fixture.debugElement.queryAll(
      By.directive(MenuFooterComponent)
    );
  });

  describe('ِComponent Function Tests', () => {
    it('Should has a separator when useSeparator is true', () => {
      const footer = debugElement[0].componentInstance;
      fixture.detectChanges();
      const separator = fixture.debugElement.query(By.css('hr'));
      expect(separator).not.toBeNull;
      expect(separator.nativeElement.classList).toContain('flex-basis-100');
      expect(footer.useSeparator()).toBeTruthy();
      expect(footer.decorativeSeparator()).toBeFalsy();
    });

    it('Should have a decorative separator when useSeparator and decorativeSeparator are true', () => {
      const footer = debugElement[1].componentInstance;
      fixture.detectChanges();
      const separator = debugElement[1].query(By.css('hr'));
      expect(separator).not.toBeNull;
      expect(footer.useSeparator()).toBeTruthy();
      expect(footer.decorativeSeparator()).toBeTruthy();
      expect(separator.nativeElement.classList).toContain('flex-basis-100');
      expect(
        (separator.nativeElement as HTMLElement).getAttribute('aria-hidden')
      ).toBe('true');
    });

    it('Should throw an error if used outside of ks-menu', () => {
      expect(() => {
        TestBed.createComponent(MenuFooterComponent);
      }).toThrowError(getErrorMessageForMenuItemNotInMenu('Footer'));
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
      const separator = debugElement[0].query(By.css('hr'));
      console.log(
        '//////////////////////////////////////////////////',
        separator.nativeElement.outerHTML
      );
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
