import {
  afterNextRender,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  Renderer2,
  signal,
} from '@angular/core';
@Directive({
  selector: '[ksMenuAriaHandling]',
  host: {
    '(keydown)': 'handleKeydown($event)',
  },
})
export class MenuAriaHandlingDirective {
  /* v8 ignore start */
  readonly firstButtonIsFocused = input(false);
  readonly el = inject(ElementRef);
  readonly buttons = signal<HTMLElement[]>([]);
  private readonly renderer2 = inject(Renderer2);
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
  /* v8 ignore end */

  private searchString = '';
  private searchTimeout: any;

  constructor() {
    afterNextRender(() => {
      this.buttons.set(
        Array.from<HTMLElement>(
          this.el.nativeElement.querySelectorAll('[ksbutton], button, a')
        ).filter((el) => !el.hasAttribute('disabled'))
      );
      const buttons = this.buttons();
      this.resetTabIndex();
      buttons.forEach((button) => {
        this.renderer2.setAttribute(button, 'tabindex', '-1');
      });
      if (buttons[0]) {
        this.renderer2.setAttribute(buttons[0], 'tabindex', '0');
        if (this.firstButtonIsFocused()) buttons[0].focus();
      }
    });
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      return;
    }
    const buttons = this.buttons();
    if (
      !['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)
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
        document.activeElement?.classList.add('active');
        break;
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
    } else {
      this.resetTabIndex();
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
