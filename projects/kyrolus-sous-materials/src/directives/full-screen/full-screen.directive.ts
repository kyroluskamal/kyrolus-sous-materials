import {
  afterEveryRender,
  ComponentRef,
  createComponent,
  Directive,
  DOCUMENT,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  inputBinding,
  model,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { DeviceTypeService } from '../../services/device-info/device-type/device-type.service';
import { IconDirective } from '../directives.export';
import { ButtonComponent } from '../../components/button/button.component';

type FullScreenMode = 'mobile' | 'tablet' | 'desktop' | 'always';
type FullScreenStateChange = 'open' | 'close' | 'none';

@Directive({
  selector: '[ksFullScreen]',
})
export class FullScreenDirective implements OnDestroy {
  //#region injections
  private readonly deviceType = inject(DeviceTypeService);
  private readonly hostElementRef = inject<ElementRef<HTMLElement>>(
    ElementRef as any
  );
  private readonly renderer = inject(Renderer2);
  private readonly env = inject(EnvironmentInjector);
  private readonly doc = inject(DOCUMENT);
  //#endregion

  //#region inputs / outputs
  readonly childSelector = input<string>('');
  readonly fullScreenMode = input<FullScreenMode>('mobile');
  readonly useNativeRequestFullScreen = input<boolean>(false);
  readonly openFullScreen = model.required<boolean>();
  //#endregion

  //#region internal state
  private host: HTMLElement | null = null;
  private lastShouldBeOpen = false;

  private closeButtonRef: ComponentRef<ButtonComponent> | null = null;
  private closeButtonHost?: HTMLElement;
  private unlistenCloseClick?: () => void;
  private unlistenFullscreenChange?: () => void;

  eff = afterEveryRender(() => this.handleRender());
  //#endregion

  constructor() {
    this.unlistenFullscreenChange = this.renderer.listen(
      this.doc,
      'fullscreenchange',
      () => this.onFullscreenChange()
    );
  }

  ngOnDestroy(): void {
    this.unsetFullScreen();
    if (this.doc.fullscreenElement === this.host) {
      void this.doc.exitFullscreen();
    }
    this.unlistenFullscreenChange?.();
    this.unlistenFullscreenChange = undefined;
  }

  //#region render logic

  private handleRender(): void {
    const target = this.resolveHostTarget() as HTMLElement;
    if (!target) return;
    this.updateHost(target);

    const shouldBeOpen = this.computeShouldBeOpenForDevice();
    console.log('shouldBeOpen', shouldBeOpen);

    const change = this.updateOpenState(shouldBeOpen);
    if (change === 'none') return;

    if (this.useNativeRequestFullScreen()) {
      this.applyNativeFullScreen(change);
    } else {
      this.applyCssFullScreen(shouldBeOpen);
    }
  }

  private resolveHostTarget() {
    const root = this.hostElementRef.nativeElement;
    const selector = this.childSelector();
    const child = selector ? root.querySelector(selector) : null;
    return child ?? root;
  }

  private updateHost(target: HTMLElement): void {
    if (this.host && this.host !== target) {
      this.unsetFullScreen();
    }
    this.host = target;
  }

  private computeShouldBeOpenForDevice(): boolean {
    const mode = this.fullScreenMode();
    const matchesDevice =
      mode === 'always' ||
      (mode === 'mobile' && this.deviceType.isMobile()) ||
      (mode === 'desktop' && this.deviceType.isDesktop()) ||
      (mode === 'tablet' && this.deviceType.isTablet());

    return this.openFullScreen() && matchesDevice;
  }

  private updateOpenState(shouldBeOpen: boolean): FullScreenStateChange {
    const wasOpen = this.lastShouldBeOpen;
    this.lastShouldBeOpen = shouldBeOpen;

    if (shouldBeOpen && !wasOpen) return 'open';
    if (!shouldBeOpen && wasOpen) return 'close';
    return 'none';
  }

  //#endregion

  //#region CSS fullscreen (class-based)

  private applyCssFullScreen(shouldBeOpen: boolean): void {
    if (!this.host) return;

    const hasClass = this.host.classList.contains('fullscreen');
    if (shouldBeOpen === hasClass) return;

    if (shouldBeOpen) {
      this.setFullScreen();
    } else {
      this.unsetFullScreen();
      this.openFullScreen.set(false);
    }
  }

  //#endregion

  //#region native fullscreen (requestFullscreen)

  private applyNativeFullScreen(change: FullScreenStateChange): void {
    if (change === 'open') {
      if (!this.doc.fullscreenElement) {
        this.requestNativeFullScreen();
      }
      return;
    }

    if (change === 'close') {
      if (this.doc.fullscreenElement === this.host) {
        this.exitNativeFullScreen();
      }
    }
  }

  private requestNativeFullScreen(): void {
    if (!this.host) return;

    if (!this.doc.fullscreenEnabled || !this.host.requestFullscreen) {
      this.setFullScreen();
      return;
    }

    this.host
      .requestFullscreen()
      .then(() => {
        this.detachCloseButton();
        this.attachCloseButton();
      })
      .catch(() => {
        this.setFullScreen();
      });
  }

  private exitNativeFullScreen(): void {
    this.doc.exitFullscreen().finally(() => {
      this.unsetFullScreen();
      this.openFullScreen.set(false);
    });
  }

  private onFullscreenChange(): void {
    // This runs when user exits fullscreen via ESC / browser UI, etc.
    const fullscreenEl = this.doc.fullscreenElement as HTMLElement | null;

    if (
      this.useNativeRequestFullScreen() &&
      !fullscreenEl &&
      this.lastShouldBeOpen
    ) {
      this.unsetFullScreen();
      this.openFullScreen.set(false);
    }
  }

  //#endregion

  //#region helpers: button + class handling

  private setFullScreen(): void {
    if (!this.host) return;
    this.host.classList.add('fullscreen');
    this.detachCloseButton();
    this.attachCloseButton();
  }

  private unsetFullScreen(): void {
    this.detachCloseButton();
    if (this.host?.classList.contains('fullscreen')) {
      this.host.classList.remove('fullscreen');
    }
  }

  private detachCloseButton(): void {
    this.unlistenCloseClick?.();
    this.unlistenCloseClick = undefined;

    this.closeButtonRef?.destroy();
    this.closeButtonRef = null;

    if (this.closeButtonHost?.parentNode) {
      this.renderer.removeChild(
        this.closeButtonHost.parentNode,
        this.closeButtonHost
      );
    }
    this.closeButtonHost = undefined;
  }

  private attachCloseButton(): void {
    if (!this.host) return;

    this.closeButtonHost = this.renderer.createElement('button');

    this.unlistenCloseClick = this.renderer.listen(
      this.closeButtonHost,
      'click',
      () => {
        if (
          this.useNativeRequestFullScreen() &&
          this.doc.fullscreenElement === this.host
        ) {
          this.exitNativeFullScreen();
        } else {
          this.unsetFullScreen();
          this.openFullScreen.set(false);
        }
      }
    );

    this.renderer.addClass(this.closeButtonHost, 'position-absolute');
    this.renderer.setStyle(this.closeButtonHost, 'top', '10px');
    this.renderer.setStyle(this.closeButtonHost, 'right', '10px');

    this.closeButtonRef = createComponent(ButtonComponent, {
      environmentInjector: this.env,
      hostElement: this.closeButtonHost,
      bindings: [
        inputBinding('size', () => 'sm'),
        inputBinding('variant', () => 'ghost'),
        inputBinding('appearance', () => 'danger'),
        inputBinding('shape', () => 'circle'),
      ],
      directives: [
        {
          type: IconDirective,
          bindings: [
            inputBinding('ksIcon', () => 'close'),
            inputBinding('isNotDecorativeIcon', () => true),
          ],
        },
      ],
    });

    this.closeButtonRef.changeDetectorRef.detectChanges();
    this.renderer.appendChild(this.host, this.closeButtonHost);
  }

  //#endregion
}
