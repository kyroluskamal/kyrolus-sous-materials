import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MenuAriaHandlingDirective } from './menu-aria-handling.directive';
import { MenuModule } from '../menu-module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
@Component({
  selector: 'ks-menu-aria-handling-test',
  template: `<ks-menu ksMenuAriaHandling>
    <ks-menu-header useSeparator>
      <span ksIcon="home"> </span>
      <p>Coding Bible Menu</p>
    </ks-menu-header>
    <ks-menu-section title="Document section">
      <ks-menu-item type="a" disabled>
        <span ksIcon="add"></span>
        <p>New</p>
      </ks-menu-item>
      <ks-menu-item>
        <span ksIcon="search"></span>
        <p>Search</p>
      </ks-menu-item>
    </ks-menu-section>

    <ks-menu-item>
      <span ksIcon="settings"></span>
      <p>Settings</p>
    </ks-menu-item>
    <ks-menu-item>
      <span ksIcon="add"></span>
      <p>Logout</p>
    </ks-menu-item>
    <ks-menu-item>
      <span ksIcon="add"></span>
      <p>leeg</p>
    </ks-menu-item>
    <ks-menu-item></ks-menu-item>

    <ks-menu-footer useSeparator></ks-menu-footer>
  </ks-menu>`,
  standalone: true,
  imports: [MenuModule],
})
class TestHostComponent {}
describe('MenuAriaHandlingDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let debugElement: DebugElement;
  let directive: MenuAriaHandlingDirective;
  let buttons: HTMLElement[];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, MenuAriaHandlingDirective],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(
      By.directive(MenuAriaHandlingDirective)
    );
    directive = debugElement.injector.get(MenuAriaHandlingDirective);
    buttons = directive.buttons();
  });
  describe('initialization', () => {
    it('Should have the first element focusable', () => {
      const firstFocusable = (
        debugElement.nativeElement as HTMLElement
      ).querySelectorAll('button, a');
      expect(firstFocusable[1]).toBeTruthy();
      expect(firstFocusable[1].getAttribute('tabindex')).toBe('0');
      expect(directive.buttons().length).toBe(5);
      expect(directive.menuItems().length).toBe(6);
    });

    it('Should have the first button with tabindex 0 and the others with -1', () => {
      expect(buttons[0].getAttribute('tabindex')).toBe('0');
      expect(buttons[1].getAttribute('tabindex')).toBe('-1');
      expect(buttons[2].getAttribute('tabindex')).toBe('-1');
      expect(buttons[3].getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('buttonsWithText', () => {
    it('Should return the text content of buttons without icons', () => {
      const buttonsWithText = directive.buttonsWithText();
      expect(buttonsWithText).toEqual([
        'search',
        'settings',
        'logout',
        'leeg',
        '',
      ]);
    });
  });

  describe('handleKeydown', () => {
    it('Should focus the first button when ArrowDown is pressed', () => {
      buttons[0].focus();
      expect(buttons[0] === document.activeElement).toBeTruthy();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      debugElement.nativeElement.dispatchEvent(event);
      vi.spyOn(event, 'preventDefault');
      expect(buttons[1] === document.activeElement).toBeTruthy();
    });

    it('Should focus the last button when ArrowUp is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      vi.spyOn(event, 'preventDefault');
      buttons[buttons.length - 1].focus();
      debugElement.nativeElement.dispatchEvent(event);
      expect(
        buttons[buttons.length - 2] === document.activeElement
      ).toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('Should handle typeahead input correctly', () => {
      buttons[buttons.length - 1].focus();

      const event = new KeyboardEvent('keydown', { key: 's' });
      vi.spyOn(directive, 'handleTypeahead');
      debugElement.nativeElement.dispatchEvent(event);
      expect(directive.handleTypeahead).toHaveBeenCalledWith(event);
      expect(buttons[0] === document.activeElement).toBeTruthy();
    });
  });

  describe('handleTypeahead', () => {
    it('Should focus the first button that matches the typed character', () => {
      buttons[buttons.length - 1].focus();
      const event = new KeyboardEvent('keydown', { key: 's' });
      vi.spyOn(event, 'preventDefault');
      debugElement.nativeElement.dispatchEvent(event);
      expect(buttons[0] === document.activeElement).toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('Should not focus any button if no match is found', () => {
      const event = new KeyboardEvent('keydown', { key: 'x' });
      vi.spyOn(event, 'preventDefault');
      directive.handleTypeahead(event);
      expect(directive.handleTypeahead(event)).toBeUndefined();
      expect(
        buttons.every((button) => button !== document.activeElement)
      ).toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
    });
    it('Should focus the first button when Home key is pressed', () => {
      buttons[buttons.length - 1].focus();
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      vi.spyOn(event, 'preventDefault');
      debugElement.nativeElement.dispatchEvent(event);
      expect(buttons[0] === document.activeElement).toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('Should focus the last button when End key is pressed', () => {
      buttons[0].focus();
      const event = new KeyboardEvent('keydown', { key: 'End' });
      vi.spyOn(event, 'preventDefault');
      debugElement.nativeElement.dispatchEvent(event);
      expect(
        buttons[buttons.length - 1] === document.activeElement
      ).toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('Should click the active button when Enter is pressed', () => {
      buttons[0].focus();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      vi.spyOn(event, 'preventDefault');
      vi.spyOn(buttons[0], 'click');
      debugElement.nativeElement.dispatchEvent(event);
      expect(buttons[0].click).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });
    it('Should click the active button when space is pressed', () => {
      buttons[0].focus();
      const event = new KeyboardEvent('keydown', { key: ' ' });
      vi.spyOn(event, 'preventDefault');
      vi.spyOn(buttons[0], 'click');
      debugElement.nativeElement.dispatchEvent(event);
      expect(buttons[0].click).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('Should focus the button by writing more than one character', () => {
      buttons[buttons.length - 1].focus();
      const sevent = new KeyboardEvent('keydown', { key: 's' });
      const eevent = new KeyboardEvent('keydown', { key: 'e' });
      debugElement.nativeElement.dispatchEvent(sevent);
      debugElement.nativeElement.dispatchEvent(eevent);
      expect(buttons[0] === document.activeElement).toBeTruthy();
    });
    it('should clear the searchString after 500ms', () => {
      vi.useFakeTimers();
      const event = new KeyboardEvent('keydown', { key: 's' });
      directive.handleTypeahead(event);
      // @ts-expect-error
      expect(directive.searchString).toBe('s');
      vi.advanceTimersByTime(500);
      // @ts-expect-error
      expect(directive.searchString).toBe('');
      vi.useRealTimers();
    });
  });
});
