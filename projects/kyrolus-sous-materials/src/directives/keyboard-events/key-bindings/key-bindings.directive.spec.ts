import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { KeyBindingsDirective } from './key-bindings.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

@Component({
  selector: 'app-key-bindings',
  template: `
    <div
      tabindex="0"
      [ksKeyBindings]="[
    {
      key: 'enter',
      keyAction: 'click',
      preventDefault: true,
    },
    {
      key: 'escape',
      keyAction: 'focus',
      targetToFocus: 'button',
      preventDefault: false,
    },
    {
      key: ' ',
      keyAction: ['click', 'focus'],
      targetToFocus: 'button',
      preventDefault: true,
    }

    ]"
    ></div>
    <div
      tabindex="0"
      [ksKeyBindings]="[
      {
        key: 'enter',
        keyAction: 'click',
        preventDefault: true,
        targetToFocus: 'button',
      },
    ]"
    ></div>
    <div
      tabindex="0"
      [ksKeyBindings]="[
      {
        key: ' ',
        keyAction: 'focus',
        preventDefault: true,
      },
    ]"
    ></div>

    <form>
      <input />
      <input
        type="submit"
        value="Submit"
        [ksKeyBindings]="[{ key: 'enter', keyAction: 'submit' }]"
      />
    </form>

    <div [ksKeyBindings]="[{ key: 'enter', keyAction: 'emit' }]">TO emit</div>
    <div [ksKeyBindings]="[]">TO emit</div>
    <div [ksKeyBindings]>TO emit</div>
    <div
      [ksKeyBindings]="[{
        key: ' ',
        keyAction: 'focus',
        preventDefault: true,
        targetToFocus: '#myelement',
      },]"
    >
      TO emit
    </div>
    <button>focus me</button>
  `,
  standalone: true,
  imports: [KeyBindingsDirective],
})
export class KeyBindingsComponent {}

describe('KeyBindingsDirective', () => {
  let fixture: ComponentFixture<KeyBindingsComponent>;
  let testElement: DebugElement[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyBindingsComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyBindingsComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    testElement = fixture.debugElement.queryAll(
      By.directive(KeyBindingsDirective)
    );
  });

  it('should create an instance via TestBed', () => {
    const directiveInstance = testElement[0].injector.get(KeyBindingsDirective);
    expect(directiveInstance).toBeTruthy();
  });

  it('should set key bindings correctly', () => {
    const directiveInstance = testElement[0].injector.get(KeyBindingsDirective);
    const keyBindings = directiveInstance.ksKeyBindings();
    expect(keyBindings).toBeDefined();
    expect(keyBindings?.length).toBe(3);
    expect(keyBindings![0].key).toBe('enter');
    expect(keyBindings![0].keyAction).toBe('click');
    expect(keyBindings![1].key).toBe('escape');
    expect(keyBindings![1].keyAction).toBe('focus');
    expect(keyBindings![2].key).toBe(' ');
    expect(keyBindings![2].keyAction).toEqual(['click', 'focus']);
  });

  it('should Click the div if Enter is pressed and preventDefault is true', () => {
    const hostElement = testElement[0].nativeElement as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    vi.spyOn(hostElement, 'click');
    vi.spyOn(event, 'preventDefault');
    testElement[0].triggerEventHandler('keydown', event);
    fixture.detectChanges();

    expect(hostElement.click).toHaveBeenCalled();
    expect(hostElement.classList.contains('active')).toBeTruthy();
    expect(event.preventDefault).toHaveBeenCalled();
    const eventAfter = new KeyboardEvent('keyup', { key: 'Enter' });
    testElement[0].triggerEventHandler('keyup', eventAfter);
    fixture.detectChanges();
    expect(hostElement.classList.contains('active')).toBeFalsy();
  });

  it('should focus the button if Escape is pressed', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    const hostElement = testElement[0].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    testElement[0].triggerEventHandler('keydown', event);
    fixture.detectChanges();

    expect(document.activeElement).toBe(button);
  });

  it('should Click and focus the button if Space is pressed', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    const hostElement = testElement[0].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();
    vi.spyOn(hostElement, 'click');

    const event = new KeyboardEvent('keydown', { key: ' ' });
    vi.spyOn(event, 'preventDefault');
    testElement[0].triggerEventHandler('keydown', event);
    fixture.detectChanges();

    expect(hostElement.click).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(button);
  });

  it('should throw an error if focus action is NOT set WITH targetToFocus', () => {
    const hostElement = testElement[1].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    expect(() => {
      testElement[1].triggerEventHandler('keydown', event);
    }).toThrowError(
      `The 'targetToFocus' property is set for the key 'enter', but no 'focus' action is defined.`
    );
  });
  it('should throw an error if focus action is set without targetToFocus', () => {
    const hostElement = testElement[2].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: ' ' });
    expect(() => {
      testElement[2].triggerEventHandler('keydown', event);
    }).toThrowError(
      `The 'focus' action for the key ' ' is set, but no target to focus is provided.`
    );
  });

  it('should submit the form when Enter is pressed on the submit input', () => {
    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    const hostElement = testElement[3].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    vi.spyOn(form, 'requestSubmit');
    testElement[3].triggerEventHandler('keydown', event);
    fixture.detectChanges();
    expect(form.requestSubmit).toHaveBeenCalled();
  });

  it('should emit an event when Enter is pressed on the div', () => {
    const hostElement = testElement[4].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();
    const directiveInstance = testElement[4].injector.get(KeyBindingsDirective);
    vi.spyOn(directiveInstance.keyAction, 'emit');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    testElement[4].triggerEventHandler('keydown', event);
    fixture.detectChanges();
    expect(directiveInstance.keyAction.emit).toHaveBeenCalled();
    expect(directiveInstance.keyAction.emit).toHaveBeenCalledWith(event);
  });

  it('should not do anything if no key bindings are set', () => {
    const hostElement = testElement[5].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    vi.spyOn(hostElement, 'click');
    testElement[5].triggerEventHandler('keydown', event);
    fixture.detectChanges();
    expect(hostElement.click).not.toHaveBeenCalled();
  });

  it('should not do anything if ksKeyBindings is not set', () => {
    const hostElement = testElement[6].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    vi.spyOn(hostElement, 'click');
    testElement[6].triggerEventHandler('keydown', event);
    fixture.detectChanges();
    expect(hostElement.click).not.toHaveBeenCalled();
  });

  it('Should throw an error if the targetToFocus is set and the action is focus but the target element is not found', () => {
    const hostElement = testElement[7].nativeElement as HTMLElement;
    hostElement.focus();
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', { key: ' ' });
    expect(() => {
      testElement[7].triggerEventHandler('keydown', event);
      fixture.detectChanges();
    }).toThrowError(`The target element '#myelement' could not be found.`);
  });
});
