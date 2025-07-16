import { Signal, TemplateRef } from '@angular/core';
import { Draggable } from '../../public-api';

export type DialogPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'center';

export class DialogConfig<T = any> {
  id?: string;
  width: string = '10rem';
  height: string = 'auto';
  position?: DialogPosition = 'center';
  data?: T;
  title?: string;
  draggable: Draggable = { isDraggable: true, reset: false };
  resizable: boolean = true;
  fullscreen?: boolean = false;
  freeStyleDialogTemplate?: TemplateRef<any> | null = null;
  closeOnEscape: boolean = false;
  closeOnBackdropClick: boolean = true;
  zIndex?: number = 99999;
  panelClass?: string | string[] = '';
  hasBackdrop?: boolean = true;
  backdropClasses: string = '';
  autoFocus?: boolean = false;
  restoreFocus?: boolean = true;
  headerTemplate: string | TemplateRef<any> = '';
  contentTemplate: TemplateRef<any> | null = null;
  footerTemplate: string | TemplateRef<any> = '';
  closeButtonText: string = 'Close';
  useActionButton: boolean = true;
  actionButtonText: string = 'Ok';
  isMinimizable: boolean = false;
  isMinimized: boolean = true;
  isMaximizable: boolean = true;
  isMaximized: boolean = false;
  breakpoints?: { [key: string]: string } = {};
  textWhenMinimized: string = '';
  transform: string = '';
}
export interface DialogRef<TComponent = any, Tdata = any, TResponse = any> {
  afterClosed: Signal<TResponse | null>;
  getData: () => Tdata;
  componentInstance: TComponent;
}
