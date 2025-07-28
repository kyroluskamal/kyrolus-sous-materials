import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { EnterKeyEventDirective } from './enter-key-event.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
@Component({
  selector: 'app-enter-key-event',
  standalone: true,
  imports: [EnterKeyEventDirective],
  template: `
    <div
      tabindex="0"
      ksEnterKeyEvent
      [actions]="['click', 'focus']"
      [preventDefault]="true"
      [targetToFocus]="'button'"
    >
      Press Enter
    </div>
    <button>Button to focus</button>

    <div
      tabindex="0"
      ksEnterKeyEvent
      [actions]="['click']"
      [preventDefault]="true"
      [targetToFocus]="'button'"
    >
      Should throw error if targetToFocus is set but action is not focus
    </div>
    <div
      tabindex="0"
      ksEnterKeyEvent
      [actions]="['focus']"
      [preventDefault]="true"
    >
      should throw error if the action is focus but targetToFocus is not set
    </div>
    <div
      tabindex="0"
      ksEnterKeyEvent
      [actions]="['focus']"
      [preventDefault]="true"
      [targetToFocus]="'#myelement'"
    >
      should throw error if the action is focus and targetToFocus is not a valid
      selector
    </div>
  `,
})
export class EnterKeyEventComponent {}
describe('EnterKeyEventDirective', () => {
  let fixture: ComponentFixture<EnterKeyEventComponent>;
  let testElement: DebugElement[];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnterKeyEventComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(EnterKeyEventComponent);
    testElement = fixture.debugElement.queryAll(
      By.directive(EnterKeyEventDirective)
    );
    fixture.detectChanges();
  });

  it('Should click the button when Enter is pressed', () => {
    const divElement = testElement[0].nativeElement;
    divElement.focus();
    fixture.detectChanges();
    spyOn(divElement, 'click');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    testElement[0].triggerEventHandler('keydown', event);
    fixture.detectChanges();
    expect(divElement.click).toHaveBeenCalled();
  });

  it('Should focus the button when Enter is pressed', () => {
    const divElement = testElement[0].nativeElement;
    const buttonElement = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    divElement.focus();
    fixture.detectChanges();
    spyOn(buttonElement, 'focus');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    testElement[0].triggerEventHandler('keydown', event);
    fixture.detectChanges();
    expect(buttonElement.focus).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('Should throw error if targetToFocus is set but the action is not focus', () => {
    const divElement = testElement[1].nativeElement;
    divElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    expect(() => {
      testElement[1].triggerEventHandler('keydown', event);
      fixture.detectChanges();
    }).toThrowError(
      "The 'targetToFocus' property is set for the key 'enter', but no 'focus' action is defined."
    );
  });
  it('Should throw error if the action is focus but targetToFocus is not set', () => {
    const divElement = testElement[2].nativeElement;
    divElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    expect(() => {
      testElement[2].triggerEventHandler('keydown', event);
      fixture.detectChanges();
    }).toThrowError(
      "The 'focus' action for the key 'enter' is set, but no target to focus is provided."
    );
  });

  it('Should throw error if the action is focus and targetToFocus is not a valid selector', () => {
    const divElement = testElement[3].nativeElement;
    divElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    expect(() => {
      testElement[3].triggerEventHandler('keydown', event);
      fixture.detectChanges();
    }).toThrowError("The target element '#myelement' could not be found.");
  });
});
