import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItemComponent } from './menu-item.component';
import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ButtonConfig, MenuComponent } from '../menu.exports';
import { By } from '@angular/platform-browser';
import { getErrorMessageForMenuItemNotInMenu } from '../menu.const';
import { vi } from 'vitest';
import { ButtonDirective } from '../../../directives/button/button.directive';
@Component({
  selector: 'ks-menu-header-test',
  template: `
    <ks-menu>
      <ks-menu-item [buttonConfig]="testConfig">Test Item</ks-menu-item>
      <ks-menu-item href="www.google.com">Test Item</ks-menu-item>
      <ks-menu-item routerLink="/test">Test Item</ks-menu-item>
      <ks-menu-item disabled>Test Item</ks-menu-item>
      <ks-menu-item href="www.google.com" disabled>Test Item</ks-menu-item>
    </ks-menu>
  `,
  standalone: true,
  imports: [MenuComponent, MenuItemComponent],
})
class TestHostComponent {
  testConfig: ButtonConfig = {
    size: 'sm',
    variant: 'text',
    appearance: 'dark',
    isRaised: true,
    shape: 'default',
    RaisedClass: 'raised',
    borderRadius: 'br-r-2',
    id: `test-button-${Math.random().toString(36).substring(2, 15)}`,
  };
}
@Component({
  selector: 'ks-menu-header-test',
  template: `
    <ks-menu>
      <ks-menu-item href="www.google.com" routerLink="/tests"
        >Test Item</ks-menu-item
      >
    </ks-menu>
  `,
  standalone: true,
  imports: [MenuComponent, MenuItemComponent],
})
class TestErrorHostComponent {}
describe('MenuItemComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement[];
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
    it('should forward buttonConfig properties to the underlying ButtonDirective', () => {
      let btn = debugElement[0].query(By.directive(ButtonDirective))
        ?.nativeElement as HTMLElement;
      const classList = Array.from(btn.classList);
      expect(classList).to.include.members([
        'btn-sm',
        'btn-text-dark',
        'raised',
        'br-r-2',
        'btn-default',
      ]);
      expect(btn.getAttribute('id')).toMatch(/^test-button-/);
    });
    it('should render a button element when no href nor routerLink is provided"', () => {
      const buttonElement =
        debugElement[0].nativeElement.querySelector('button');
      expect(buttonElement).toBeTruthy();
      expect(buttonElement.textContent.trim()).toBe('Test Item');
    });
    it('should render an anchor element when the href is provided', () => {
      const anchorElement = debugElement[1].nativeElement.querySelector('a');
      expect(anchorElement).toBeTruthy();
      expect(anchorElement.textContent.trim()).toBe('Test Item');
    });
    it('should render an anchor element when the routerLink is provided', () => {
      const anchorElement = debugElement[2].nativeElement.querySelector('a');
      expect(anchorElement).toBeTruthy();
      expect(anchorElement.textContent.trim()).toBe('Test Item');
    });
    it('should render a disabled button when disabled is true', () => {
      const disabledButton =
        debugElement[3].nativeElement.querySelector('button');
      expect(disabledButton).toBeTruthy();
      expect(disabledButton.textContent.trim()).toBe('Test Item');
      expect(disabledButton.hasAttribute('disabled')).toBeTruthy();
    });
    it('should render a disabled anchor element when disabled is true and href or routerLink is provided', () => {
      const disabledButton = debugElement[4].nativeElement.querySelector('a');
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
    it('should throw an error if the href and routerLInk are provided together', () => {
      const fixture = TestBed.createComponent(TestErrorHostComponent);
      expect(() => fixture.detectChanges()).toThrowError(
        'MenuItem has both href and routerLink. Please choose one.'
      );
    });
  });

  describe('Aria tests', () => {
    it('should set aria-disabled attribute when disabled is true', () => {
      const disabledButton =
        debugElement[3].nativeElement.querySelector('button');
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
  describe('Event emission tests', () => {
    it('should emit itemClcik event when a non-disabled item is clicked', () => {
      const clickSpy = vi.fn();
      const menuItemInstance = debugElement[0]
        .componentInstance as MenuItemComponent;
      const subscription = menuItemInstance.itemClcik.subscribe(clickSpy);
      const menuItemElementButton = debugElement[0].query(
        By.directive(ButtonDirective)
      );
      menuItemElementButton.triggerEventHandler(
        'click',
        new MouseEvent('click')
      );
      fixture.detectChanges();
      expect(clickSpy).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    });
    it('should NOT emit itemClcik event when a disabled item is clicked', () => {
      const clickSpy = vi.fn();
      const disabledMenuItemInstance = debugElement[3]
        .componentInstance as MenuItemComponent;
      const subscription =
        disabledMenuItemInstance.itemClcik.subscribe(clickSpy);
      const disabledMenuItemElement = debugElement[3].query(
        By.directive(ButtonDirective)
      );
      let event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      vi.spyOn(event, 'preventDefault');
      vi.spyOn(event, 'stopPropagation');
      disabledMenuItemElement.triggerEventHandler('click', event);
      fixture.detectChanges();
      expect(clickSpy).not.toHaveBeenCalled();
      subscription.unsubscribe();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
