import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ToggleButtonDirective } from './toggle-button.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-tests',
  imports: [ToggleButtonDirective],
  standalone: true,
  template: `
    <button
      ksToggleButton
      [iconOptions]="{
        provider: 'google'
      }"
      iconName="menu"
      iconToggled="close"
      [(toggled)]="isToggled"
    ></button>
    <button
      ksToggleButton
      [iconOptions]="{
        provider: 'bi'
      }"
      iconName="list"
      iconToggled="x"
    >
      fwerwerw
    </button>
  `,
})
export class ToggleButtonDirectiveSpec {
  // This is a placeholder for the test suite for the ToggleButtonDirective.
  // You can add your test cases here.
  isToggled = false;
}

describe('ToggleButtonDirective', () => {
  let fixture: ComponentFixture<ToggleButtonDirectiveSpec>;
  let testElement: DebugElement[];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToggleButtonDirective],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleButtonDirectiveSpec);
    testElement = fixture.debugElement.queryAll(
      By.directive(ToggleButtonDirective)
    );
  });
  describe('Using Google Icons', () => {
    it('toggled should changed on click', () => {
      const toggleButton = testElement[0].injector.get(ToggleButtonDirective);
      const initialIcon = toggleButton.iconDirective.ksIcon();
      expect(toggleButton.toggled()).toBeFalsy();
      testElement[0].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(toggleButton.toggled()).toBeTruthy();
      expect(toggleButton.iconDirective.ksIcon()).not.toBe(initialIcon);
    });
    it('Icon should be "close icon" when toggled and returns back to the inical icon when toggled == false', () => {
      const toggleButton = testElement[0].injector.get(ToggleButtonDirective);
      testElement[0].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(toggleButton.iconDirective.ksIcon()).not.toBe('menu');
      expect(toggleButton.iconDirective.ksIcon()).toBe('close');
      testElement[0].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(toggleButton.iconDirective.ksIcon()).toBe('menu');
    });
    it('the text node should be close when toggled == true', () => {
      testElement[0].triggerEventHandler('click', null);
      fixture.detectChanges();
      const nodes = Array.from<Node>(testElement[0].nativeElement.childNodes);
      const hasTextNodes = nodes.some(
        (node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== ''
      );
      expect(hasTextNodes).toBeTruthy();
      expect(nodes[0].textContent?.trim()).toBe('close');
    });

    it('should has toggled == true if isToggled==true"', async () => {
      fixture.componentInstance.isToggled = true;
      fixture.detectChanges();
      await fixture.whenStable();
      const toggleButton = testElement[0].injector.get(ToggleButtonDirective);
      expect(toggleButton.toggled()).toBeTruthy();
      expect(toggleButton.iconDirective.ksIcon()).toBe('close');

      testElement[0].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(toggleButton.toggled()).toBeFalsy();
      expect(toggleButton.iconDirective.ksIcon()).toBe('menu');
      expect(fixture.componentInstance.isToggled).toBeFalsy();
    });
  });

  describe('Using Bootstrap Icons', () => {
    it('toggled should changed on click', () => {
      const toggleButton = testElement[1].injector.get(ToggleButtonDirective);
      expect(toggleButton.toggled()).toBeFalsy();
      testElement[1].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(toggleButton.toggled()).toBeTruthy();
      expect(toggleButton.iconDirective.ksIcon()).toBe('x');
    });
    it('Icon should be "x" when toggled and returns back to the inical icon when toggled == false', () => {
      const toggleButton = testElement[1].injector.get(ToggleButtonDirective);
      testElement[1].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(toggleButton.iconDirective.ksIcon()).not.toBe('list');
      expect(toggleButton.iconDirective.ksIcon()).toBe('x');
      testElement[1].triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(toggleButton.iconDirective.ksIcon()).toBe('list');
    });

    it('should not have text nodes when the icon type is bootstrap', () => {
      fixture.detectChanges();
      const nodes = Array.from<Node>(testElement[1].nativeElement.childNodes);
      const hasTextNodes = nodes.some(
        (node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== ''
      );
      expect(hasTextNodes).toBeFalsy();
    });
  });
});
