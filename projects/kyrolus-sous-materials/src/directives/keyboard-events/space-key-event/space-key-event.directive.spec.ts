import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpaceKeyEventDirective } from './space-key-event.directive';
import { vi } from 'vitest';

@Component({
  selector: 'app-escape-key-event',
  standalone: true,
  imports: [SpaceKeyEventDirective],
  template: `
    <div
      tabindex="0"
      ksSpaceKeyEvent
      [actions]="['click', 'focus']"
      preventDefault
      [targetToFocus]="'button'"
    >
      Press Escape
    </div>
    <button>Button to focus</button>

    <div
      tabindex="0"
      ksSpaceKeyEvent
      [actions]="['click']"
      preventDefault
      [targetToFocus]="'button'"
    >
      Should throw error if targetToFocus is set but action is not focus
    </div>

    <div tabindex="0" ksSpaceKeyEvent [actions]="['focus']" preventDefault>
      should throw error if the action is focus but targetToFocus is not set
    </div>
    <div
      tabindex="0"
      ksSpaceKeyEvent
      [actions]="['focus']"
      preventDefault
      [targetToFocus]="'#myelement'"
    >
      should throw error if the action is focus and targetToFocus is not a valid
      selector
    </div>
  `,
})
export class SpaceKeyEventComponent {}

describe('SpaceKeyEventDirective', () => {
  let fixture: ComponentFixture<SpaceKeyEventComponent>;
  let testElement: DebugElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpaceKeyEventComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceKeyEventComponent);
    fixture.detectChanges();
    testElement = fixture.debugElement.queryAll(
      By.directive(SpaceKeyEventDirective)
    );
  });

  it('should click the div and focus the button on space key press', () => {
    const hostElement = testElement[0].nativeElement;
    hostElement.focus();
    fixture.detectChanges();
    vi.spyOn(hostElement, 'click');
    const spaceKeyEvent = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
    });
    testElement[0].triggerEventHandler('keydown', spaceKeyEvent);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(document.activeElement).toBe(button.nativeElement);
    expect(hostElement.click).toHaveBeenCalled();
  });
  it('should throw error if targetToFocus is set but the action is not focus', () => {
    const hostElement = testElement[1].nativeElement;
    hostElement.focus();
    fixture.detectChanges();
    expect(() => {
      const spaceKeyEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      });
      testElement[1].triggerEventHandler('keydown', spaceKeyEvent);
    }).toThrowError(
      "The 'targetToFocus' property is set for the key ' ', but no 'focus' action is defined."
    );
  });

  it('should throw error if the action is focus but targetToFocus is not set', () => {
    const hostElement = testElement[2].nativeElement;
    hostElement.focus();
    fixture.detectChanges();
    expect(() => {
      const spaceKeyEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      });
      testElement[2].triggerEventHandler('keydown', spaceKeyEvent);
    }).toThrowError(
      "The 'focus' action for the key ' ' is set, but no target to focus is provided."
    );
  });

  it('should throw error if the action is focus and targetToFocus is not a valid selector', () => {
    const hostElement = testElement[3].nativeElement;
    hostElement.focus();
    fixture.detectChanges();
    expect(() => {
      const spaceKeyEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      });
      testElement[3].triggerEventHandler('keydown', spaceKeyEvent);
    }).toThrowError("The target element '#myelement' could not be found.");
  });
});
