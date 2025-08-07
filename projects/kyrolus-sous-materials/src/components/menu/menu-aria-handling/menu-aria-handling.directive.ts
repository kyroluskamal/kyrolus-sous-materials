import {
  afterNextRender,
  computed,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { MenuItemComponent } from '../menu.exports';

@Directive({
  selector: '[ksMenuAriaHandling]',
  host: {
    '(keydown)': 'handleKeydown($event)',
  },
})
export class MenuAriaHandlingDirective {
  readonly menuItems = contentChildren(MenuItemComponent, {
    descendants: true,
  });
  private readonly renderer2 = inject(Renderer2);
  readonly buttons = computed<HTMLElement[]>(() =>
    this.menuItems()
      .filter((item) => !item.button()?.nativeElement.hasAttribute('disabled'))
      .map((item) => item.button()?.nativeElement)
  );
  readonly buttonsWithText = computed(() => {
    return this.buttons().map((button) => {
      const clone = button.cloneNode(true) as HTMLElement;
      const icon = clone.querySelector('[ksicon]');
      if (icon) {
        icon.remove();
      }
      return clone.textContent?.trim().toLowerCase() || '';
    });
  });
  readonly elemRef = inject(ElementRef);

  private searchString = '';
  private searchTimeout: any;

  constructor() {
    afterNextRender(() => {
      this.buttons().forEach((button) => {
        this.renderer2.setAttribute(button, 'tabindex', '-1');
      });
      if (this.buttons()[0]) {
        this.renderer2.setAttribute(this.buttons()[0], 'tabindex', '0');
      }
    });
  }

  handleKeydown(event: KeyboardEvent) {
    const buttons = this.buttons();
    if (buttons.length === 0) return;
    if (
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      this.handleTypeahead(event);
      return;
    }

    let currentIndex = buttons.indexOf(document.activeElement as HTMLElement);

    let nextButton: HTMLElement | undefined;
    switch (event.key) {
      case 'ArrowDown':
        nextButton = buttons[(currentIndex + 1) % buttons.length];
        break;
      case 'ArrowUp':
        nextButton =
          buttons[(currentIndex - 1 + buttons.length) % buttons.length];
        break;
      case 'Home':
        nextButton = buttons[0];
        break;
      case 'End':
        nextButton = buttons[buttons.length - 1];
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        (document.activeElement as HTMLElement)?.click();
        return;
    }

    if (nextButton) {
      event.preventDefault();
      this.focusButton(nextButton);
    }
  }

  handleTypeahead(event: KeyboardEvent) {
    event.preventDefault();

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchString += event.key.toLowerCase();

    this.searchTimeout = setTimeout(() => {
      this.searchString = '';
    }, 500);

    // ✅ New, simpler, and more correct search logic
    const buttons = this.buttons();
    const buttonsText = this.buttonsWithText();

    // Find the first button that starts with the complete search string
    const buttonToFocus = buttons.find((_, index) =>
      buttonsText[index].startsWith(this.searchString)
    );
    if (buttonToFocus) {
      this.focusButton(buttonToFocus);
    }
  }
  private focusButton(button: HTMLElement) {
    this.resetTabIndex();
    this.renderer2.setAttribute(button, 'tabindex', '0');
    button.focus();
  }
  resetTabIndex() {
    this.buttons().forEach((button) => {
      this.renderer2.setAttribute(button, 'tabindex', '-1');
    });
  }
}
