import {
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  model,
  output,
  Renderer2,
} from '@angular/core';
import { isNgDevMode } from '../../../public-api';
export type KeyActionEvent = {
  key: string;
  keyAction: KeyAction | KeyAction[];
  targetToFocus?: string;
  preventDefault?: boolean;
};
export type KeyAction = 'click' | 'focus' | 'submit' | 'emit';

@Directive({
  selector: '[ksKeyBindings]',
  standalone: true,
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(keyup)': 'removeActiveClass()',
  },
})
export class KeyBindingsDirective {
  readonly ksKeyBindings = model<KeyActionEvent[]>();
  private readonly hostElement: HTMLElement = inject(ElementRef).nativeElement;
  readonly keyAction = output<KeyboardEvent>();
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  onKeyDown(event: KeyboardEvent): void {
    const actionsList = this.ksKeyBindings();
    if (!actionsList || actionsList?.length === 0) {
      return;
    }
    const matchingActions = actionsList.filter(
      (action) => event.key.toLowerCase() === action.key.toLowerCase()
    );
    matchingActions.forEach((action, index) => {
      if (action.preventDefault) {
        event.preventDefault();
      }
      const keyActions = Array.isArray(action.keyAction)
        ? action.keyAction
        : [action.keyAction];
      let hasFocusEvent = action.keyAction.includes('focus');
      if (isNgDevMode && !hasFocusEvent && action.targetToFocus) {
        throw new Error(
          `The 'targetToFocus' property is set for the key '${action.key}', but no 'focus' action is defined.`
        );
      }
      keyActions.forEach((act) => {
        if (isNgDevMode && act === 'focus' && !action.targetToFocus) {
          throw new Error(
            `The 'focus' action for the key '${action.key}' is set, but no target to focus is provided.`
          );
        }

        this.executeAction(act, event, action);
      });
    });
  }

  private executeAction(
    keyAction: KeyAction,
    event: KeyboardEvent,
    action: KeyActionEvent
  ): void {
    switch (keyAction) {
      case 'click':
        this.hostElement.click();
        this.renderer.addClass(this.hostElement, 'active');
        break;
      case 'focus':
        if (action.targetToFocus) {
          const targetElement = this.document.querySelector(
            action.targetToFocus
          ) as HTMLElement;
          if (targetElement) {
            targetElement.focus();
          } else {
            throw new Error(
              `The target element '${action.targetToFocus}' could not be found.`
            );
          }
        }
        break;
      case 'submit':
        {
          const form = this.hostElement.closest('form') as HTMLFormElement;
          if (form) {
            form.requestSubmit();
          }
        }
        break;
      default:
        this.keyAction.emit(event);
    }
  }

  removeActiveClass(): void {
    this.renderer.removeClass(this.hostElement, 'active');
  }
}
