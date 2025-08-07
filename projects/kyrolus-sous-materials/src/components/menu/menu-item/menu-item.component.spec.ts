import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemComponent } from './menu-item.component';
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
      <ks-menu-item type="button">Test Item</ks-menu-item>
      <ks-menu-item type="a">Test Item</ks-menu-item>
      <ks-menu-item type="a" disabled>Test Item</ks-menu-item>
    </ks-menu>
  `,
  standalone: true,
  imports: [MenuComponent, MenuItemComponent],
})
class TestHostComponent {}
describe('MenuItemComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement[];
  let buttons: DebugElement[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [MenuItemComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    debugElement = fixture.debugElement.queryAll(
      By.directive(MenuItemComponent)
    );
  });
  describe('Component  tests', () => {
    it('should render a button element when type is "button"', () => {
      const buttonElement =
        debugElement[0].nativeElement.querySelector('button');
      expect(buttonElement).toBeTruthy();
      expect(buttonElement.textContent.trim()).toBe('Test Item');
    });
    it('should render an anchor element when type is "a"', () => {
      const anchorElement = debugElement[1].nativeElement.querySelector('a');
      expect(anchorElement).toBeTruthy();
      expect(anchorElement.textContent.trim()).toBe('Test Item');
    });
    it('should render a disabled button when disabled is true', () => {
      const disabledButton = debugElement[2].nativeElement.querySelector('a');
      expect(disabledButton).toBeTruthy();
      expect(disabledButton.textContent.trim()).toBe('Test Item');
      expect(disabledButton.hasAttribute('disabled')).toBeTruthy();
    });
    it('should not be disabled as default', () => {
      expect(debugElement[0].componentInstance.disabled()).toBeFalsy();
    });
    it('should throw an error if the parent is not a ks-menu', () => {
      expect(() => TestBed.createComponent(MenuItemComponent)).toThrowError(
        getErrorMessageForMenuItemNotInMenu('Item')
      );
    });
  });

  describe('Aria tests', () => {
    it('should set aria-disabled attribute when disabled is true', () => {
      const disabledButton = debugElement[2].nativeElement.querySelector('a');
      expect(disabledButton.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not set aria-disabled attribute when disabled is false', () => {
      const buttonElement =
        debugElement[0].nativeElement.querySelector('button');
      expect(buttonElement.getAttribute('aria-disabled')).toBeNull();
    });

    it('should set role="menuitem" on the host element', () => {
      const menuItemElement = debugElement[0].nativeElement;
      expect(menuItemElement.getAttribute('role')).toBe('menuitem');
    });
  });
});
