import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
export type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface ResizeEvent {
  handle: ResizeHandle;
  width: number;
  height: number;
  x: number;
  y: number;
}
@Directive({
  selector: '[ksResizable]',
})
export class ResizableDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);

  // Inputs
  enabled = input<boolean>(true);
  minWidth = input<number>(100);
  minHeight = input<number>(100);
  maxWidth = input<number>(2000);
  maxHeight = input<number>(2000);
  gridSize = input<number>(1);

  // Outputs
  resizeStart = output<ResizeEvent>();
  resizing = output<ResizeEvent>();
  resizeEnd = output<ResizeEvent>();
  PLATFORM_ID = inject(PLATFORM_ID);
  // State
  private readonly isResizing = signal(false);
  private currentHandle: ResizeHandle | null = null;
  private startDimensions = { width: 0, height: 0, x: 0, y: 0 };
  private startPosition = { x: 0, y: 0 };

  ngOnInit(): void {
    this.setupResizeHandles();
    this.setupEventListeners();
  }

  private setupResizeHandles(): void {
    const handles: ResizeHandle[] = [
      'n',
      's',
      'e',
      'w',
      'ne',
      'nw',
      'se',
      'sw',
    ];
    if (this.enabled())
      handles.forEach((handle) => this.createResizeHandle(handle));
  }

  private createResizeHandle(position: ResizeHandle): void {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-handle-${position}`;
    handle.dataset['handle'] = position;

    handle.addEventListener('pointerdown', (e: MouseEvent) => {
      if (!this.enabled()) return;
      this.startResize(e, position);
    });

    this.elementRef.nativeElement.appendChild(handle);
  }

  private setupEventListeners(): void {
    const mousemove = (e: MouseEvent) => this.onResize(e);
    const mouseup = () => this.stopResize();
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      window.addEventListener('pointermove', mousemove);
      window.addEventListener('pointerup', mouseup);
    }
  }

  private startResize(event: MouseEvent, handle: ResizeHandle): void {
    event.preventDefault();
    event.stopPropagation();

    this.isResizing.set(true);
    this.currentHandle = handle;

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.startDimensions = {
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    };
    this.startPosition = { x: event.clientX, y: event.clientY };

    this.resizeStart.emit({
      handle,
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    });
  }

  private onResize(event: MouseEvent): void {
    if (!this.isResizing() || !this.currentHandle) return;

    const deltaX = event.clientX - this.startPosition.x;
    const deltaY = event.clientY - this.startPosition.y;

    let { width, height, x, y } = this.calculateNewDimensions(deltaX, deltaY);

    // Apply grid snapping
    // if (this.gridSize() > 1) {
    //   width = Math.round(width / this.gridSize()) * this.gridSize();
    //   height = Math.round(height / this.gridSize()) * this.gridSize();
    // }

    // Apply constraints
    width = Math.max(this.minWidth(), Math.min(width, this.maxWidth()));
    height = Math.max(this.minHeight(), Math.min(height, this.maxHeight()));

    this.updateElementSize(width, height, x, y);

    this.resizing.emit({ handle: this.currentHandle, width, height, x, y });
  }

  private calculateNewDimensions(deltaX: number, deltaY: number) {
    let { width, height, x, y } = { ...this.startDimensions };

    switch (this.currentHandle) {
      case 'e':
        width += deltaX;
        break;
      case 'w':
        width -= deltaX;
        x += deltaX;
        break;
      case 'n':
        height -= deltaY;
        y += deltaY;
        break;
      case 's':
        height += deltaY;
        break;
      case 'ne':
        width += deltaX;
        height -= deltaY;
        y += deltaY;
        break;
      case 'nw':
        width -= deltaX;
        height -= deltaY;
        x += deltaX;
        y += deltaY;
        break;
      case 'se':
        width += deltaX;
        height += deltaY;
        break;
      case 'sw':
        width -= deltaX;
        height += deltaY;
        x += deltaX;
        break;
    }

    return { width, height, x, y };
  }

  private updateElementSize(
    width: number,
    height: number,
    x: number,
    y: number
  ): void {
    const element = this.elementRef.nativeElement;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  }

  private stopResize(): void {
    if (!this.isResizing()) return;

    this.isResizing.set(false);
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    this.resizeEnd.emit({
      handle: this.currentHandle!,
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    });

    this.currentHandle = null;
  }
}
