import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  model,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  TemplateRef,
  Type,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BackDropDirective } from '../../directives/back-drop.directive';
import { DialogConfig } from './dialog.types';
import {
  isPlatformBrowser,
  NgComponentOutlet,
  NgTemplateOutlet,
} from '@angular/common';
import { fadeInOut } from '../../animations/animations.export';
import { DialogHeaderComponent } from './dialog-header.component';
import { DialogActionsComponent } from './dialog-actions.component';
import { DialogContentComponent } from './dialog-content.component';
import { DialogTitleDirective } from './dialog-title.directive';
import { ButtonDirective } from '../button/button.directive';
import { DialogService } from './dialog.service';
import {
  DraggableDirective,
  DraggableEvent,
} from '../../directives/draggable.directive';
import {
  ResizableDirective,
  ResizeEvent,
} from '../../directives/resizable.directive';
import { DIALOG_DEFAULT_CONFIG } from './dialog.tokens';
import { IconDirective } from '../../directives/icon.directive';

@Component({
  selector: 'ks-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  animations: [fadeInOut],
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    DialogHeaderComponent,
    DialogActionsComponent,
    DialogContentComponent,
    DialogTitleDirective,
    BackDropDirective,
    ButtonDirective,
    DraggableDirective,
    ResizableDirective,
    IconDirective,
  ],
})
export class DialogComponent implements AfterViewInit, OnInit {
  ngOnInit(): void {
    this.applyBreakpoints();
  }
  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }
  backDrop = viewChild(BackDropDirective);
  dialogRef = viewChild('dialog', { read: ElementRef });
  elementRef = inject(ElementRef);
  id = model<string>('dialog');
  componentContentType = input<Type<any> | null>(null);
  config = model<DialogConfig<any>>(inject(DIALOG_DEFAULT_CONFIG));
  result = signal<any>(null);
  contentComponent = model<Type<any> | null>(null);
  opendProgrammatically = signal<boolean>(false);
  open = model<boolean>(false);
  onBackdropClick = output<boolean>();
  freeStyleDialogTemplate = input<TemplateRef<any> | null>(null);
  dialogService = inject(DialogService);
  PLATFORM_ID = inject(PLATFORM_ID);

  readonly isMinimized = computed(
    () => this.config().isMinimized && this.config().isMinimizable
  );
  readonly isMaximized = computed(
    () => this.config().isMaximized && this.config().isMaximizable
  );
  @HostBinding('class')
  get dialogClass() {
    return [
      this.config()?.position ?? 'center',
      this.config()?.width == 'full' ? 'full' : '',
    ];
  }
  @HostBinding('attr.id')
  get Id() {
    return this.id();
  }
  toTemplateRef(ele: any) {
    return ele as TemplateRef<any>;
  }
  backdropClicked(event: boolean) {
    if (this.config()?.hasBackdrop && this.config().closeOnBackdropClick) {
      this.close();
      this.onBackdropClick.emit(event);
    }
  }
  close(result?: any) {
    this.open.set(false);
    this.result.set(result);
  }
  @HostBinding('tabindex') get tabIndex() {
    return -1;
  }
  @HostListener('keydown.esc')
  onEscClick() {
    this.elementRef.nativeElement.focus();
    if (this.config()?.closeOnEscape) {
      this.close();
    }
  }
  minimize(minimize: boolean) {
    this.config.update((config) => {
      let conf = { ...config, isMinimized: minimize };
      if (minimize && config.isMaximized && config.isMaximizable) {
        conf = { ...conf, isMaximized: false };
      }

      if (
        !minimize &&
        config.fullscreen &&
        !conf.isMaximized &&
        config.isMaximizable
      ) {
        conf = { ...conf, isMaximized: true };
      }

      return conf;
    });
  }

  maximize(maximize: boolean) {
    this.config.update((config) => {
      let conf = { ...config, isMaximized: maximize, fullscreen: maximize };
      if (maximize && config.isMinimized && config.isMinimizable) {
        conf = { ...conf, isMinimized: false };
      }
      return conf;
    });
  }

  private applyBreakpoints(): void {
    if (isPlatformBrowser(this.PLATFORM_ID)) {
      const screenWidth = window.innerWidth;
      if (this.config().breakpoints !== undefined) {
        // Iterate over breakpoints and find the most suitable one
        for (const breakpoint of Object.keys(this.config().breakpoints!).sort(
          (a, b) => parseInt(b) - parseInt(a)
        )) {
          if (screenWidth <= parseInt(breakpoint)) {
            this.config.update((config) => {
              return {
                ...config,
                width: this.config().breakpoints![breakpoint],
              };
            });
            return;
          }
        }
      }
    }
  }
  onResizeEnd(event: ResizeEvent) {
    this.config.update((config) => {
      return {
        ...config,
        width: `${event.width}px`,
        height: `${event.height}px`,
      };
    });
  }
  setTransform(event: DraggableEvent) {
    this.config.update((config) => {
      return { ...config, transform: event.transform };
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.applyBreakpoints();
  }
}
