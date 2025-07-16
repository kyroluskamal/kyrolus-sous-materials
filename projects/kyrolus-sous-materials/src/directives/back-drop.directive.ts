import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
@Directive({
  selector: '[ksBackDrop]',
  host: { class: 'position-fixed w-100 h-100' },
})
export class BackDropDirective {
  elementRef = inject(ElementRef);
  styleClases = input<string>('');
  show = model<boolean>(true);
  closeByClick = input<boolean>(true);
  closeByEscape = input<boolean>(true);
  BackdropClick = output<boolean>();
  zIndex = input<number>(4);
  backDropClicked = signal<boolean>(false);
  @HostBinding('class') get _show() {
    if (this.show())
      return (
        'backdrop-show position-fixed w-100 h-100 top-0 left-0 ' +
        this.styleClases()
      );
    return 'd-none';
  }

  @HostBinding('style.z-index') get _zIndex() {
    return this.zIndex();
  }
  @HostListener('click')
  onClick() {
    if (this.closeByClick()) {
      this.show.update((x) => !x);
    }
    this.BackdropClick.emit(this.closeByClick());
    this.backDropClicked.set(true);
  }
  @HostListener('keydown.esc')
  onEscClick() {
    if (this.closeByEscape()) {
      this.show.update((x) => !x);
    }
  }
}
