import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
export type Draggable = { isDraggable: boolean; reset: boolean };
export interface DraggableEvent {
  transform: string;
}
@Directive({
  selector: '[ksDraggable]',
})
export class DraggableDirective {
  ksDraggable = input<Draggable>({ isDraggable: true, reset: false });
  elementRef = input(inject(ElementRef));
  isDragging = signal<boolean>(false);
  reset = signal<boolean>(false);
  onDrag = output<DraggableEvent>();
  onDragEnd = output<DraggableEvent>();
  private readonly elementPosition = signal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  private readonly startPosition = signal<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  @HostListener('pointerdown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!this.ksDraggable() || event.button !== 0) return;
    if (this.ksDraggable().isDraggable && event.button === 0) {
      this.isDragging.set(true);
      this.startPosition.set({
        x: event.clientX - this.elementPosition().x,
        y: event.clientY - this.elementPosition().y,
      });

      this.elementPosition.set({
        x: this.startPosition().x,
        y: this.startPosition().y,
      });
      this.elementRef().nativeElement.style.cursor = 'move';
    }
  }
  @HostListener('document:pointermove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging()) return;
    this.elementPosition.set({
      x: event.clientX - this.startPosition().x,
      y: event.clientY - this.startPosition().y,
    });

    let traslate = `translate(${this.elementPosition().x}px, ${
      this.elementPosition().y
    }px)`;
    this.elementRef().nativeElement.style.transform = traslate;
    this.onDrag.emit({ transform: traslate });
  }
  @HostListener('document:pointerup', ['$event'])
  onMouseUp(event: Event) {
    if (!this.isDragging()) return;
    this.isDragging.set(false);

    let translate = `translate(${this.elementPosition().x}px, ${
      this.elementPosition().y
    }px)`;

    this.elementRef().nativeElement.style.cursor = 'default';
    this.elementRef().nativeElement.style.transform = translate;
    if (this.reset()) {
      this.elementPosition.set({ x: 0, y: 0 });
      this.elementRef().nativeElement.style.transform = `translate(0px, 0px)`;
      translate = `translate(0px, 0px)`;
    }

    this.onDragEnd.emit({ transform: translate });
  }
}
