import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { EscapeKeyEventDirective } from './escape-key-event.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

@Component({
  selector: 'app-escape-key-event',
  standalone: true,
  imports: [EscapeKeyEventDirective],
  template: `
    <div
      tabindex="0"
      ksEscapeKeyEvent
      [actions]="['click', 'focus']"
      preventDefault
      [targetToFocus]="'button'"
    >
      Press Escape
    </div>
    <button>Button to focus</button>

    <div
      tabindex="0"
      ksEscapeKeyEvent
      [actions]="['click']"
      preventDefault
      [targetToFocus]="'button'"
    >
      Should throw error if targetToFocus is set but action is not focus
    </div>

    <div tabindex="0" ksEscapeKeyEvent [actions]="['focus']" preventDefault>
      should throw error if the action is focus but targetToFocus is not set
    </div>
    <div
      tabindex="0"
      ksEscapeKeyEvent
      [actions]="['focus']"
      preventDefault
      [targetToFocus]="'#myelement'"
    >
      should throw error if the action is focus and targetToFocus is not a valid
      selector
    </div>
  `,
})
export class EscapeKeyEventComponent {}
describe('EscapeKeyEventDirective', () => {
  let fixture: ComponentFixture<EscapeKeyEventComponent>;
  let testElement: DebugElement[];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EscapeKeyEventComponent],
      providers: [provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(EscapeKeyEventComponent);
    fixture.detectChanges();
    testElement = fixture.debugElement.queryAll(
      By.directive(EscapeKeyEventDirective)
    );
  });

  it('Should click the div when Escape is pressed and focus the button', () => {
    const hostElement = testElement[0].nativeElement;
    hostElement.focus();
    fixture.detectChanges();
    vi.spyOn(hostElement, 'click');
    const escapeKeyEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    testElement[0].triggerEventHandler('keydown', escapeKeyEvent);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(document.activeElement).toBe(button.nativeElement);
    expect(hostElement.click).toHaveBeenCalled();
  });
  it('Should throw error if targetToFocus is set but the action is not focus', () => {
    const hostElement = testElement[1].nativeElement;
    hostElement.focus();
    fixture.detectChanges();
    const escapeKeyEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    expect(() => {
      testElement[1].triggerEventHandler('keydown', escapeKeyEvent);
      fixture.detectChanges();
    }).toThrowError(
      "The 'targetToFocus' property is set for the key 'escape', but no 'focus' action is defined."
    );
  });

  it('Should throw error if the action is focus but targetToFocus is not set', () => {
    const hostElement = testElement[2].nativeElement;
    hostElement.focus();
    fixture.detectChanges();
    const escapeKeyEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    expect(() => {
      testElement[2].triggerEventHandler('keydown', escapeKeyEvent);
      fixture.detectChanges();
    }).toThrowError(
      "The 'focus' action for the key 'escape' is set, but no target to focus is provided."
    );
  });

  it('Should throw error if the action is focus and targetToFocus is not a valid selector', () => {
    const hostElement = testElement[3].nativeElement;
    hostElement.focus();
    fixture.detectChanges();
    const escapeKeyEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    expect(() => {
      testElement[3].triggerEventHandler('keydown', escapeKeyEvent);
      fixture.detectChanges();
    }).toThrowError("The target element '#myelement' could not be found.");
  });
});
