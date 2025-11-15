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

export type FullScreenStrategy = 'native' | 'css';
export type FullScreenConfig = Partial<
  Record<'mobile' | 'tablet' | 'desktop', FullScreenStrategy | false>
> & {
  default?: FullScreenStrategy | false;
};
type FullScreenStateChange = 'open' | 'close' | 'none';

const DEFAULT_FULLSCREEN_CONFIG: FullScreenConfig = {
  mobile: 'css',
};

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
  /* v8 ignore start */
  readonly fullscreenChildSelector = input<string>('');
  readonly fullScreenConfig = input<FullScreenConfig>(
    DEFAULT_FULLSCREEN_CONFIG
  );
  readonly openFullScreen = model.required<boolean>();
  /* v8 ignore end */
  //#endregion

  //#region internal state
  private host: HTMLElement | null = null;
  private lastShouldBeOpen = false;
  private activeStrategy: FullScreenStrategy | null = null;

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
    this.activeStrategy = null;
    if (
      this.doc.fullscreenEnabled &&
      this.doc.fullscreenElement === this.host
    ) {
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

    const strategy = this.resolveStrategyForCurrentDevice();
    const shouldBeOpen = Boolean(strategy) && this.openFullScreen();
    const change = this.updateOpenState(shouldBeOpen);
    if (change === 'none') return;

    if (change === 'open') {
      if (!strategy) return;
      this.activeStrategy = strategy;
    }

    const activeStrategy = this.activeStrategy;
    if (!activeStrategy) {
      this.unsetFullScreen();
      return;
    }

    if (activeStrategy === 'native') {
      this.applyNativeFullScreen(change);
    } else {
      this.applyCssFullScreen(shouldBeOpen);
    }

    if (change === 'close') {
      this.activeStrategy = null;
    }
  }

  private resolveHostTarget() {
    const root = this.hostElementRef.nativeElement;
    const selector = this.fullscreenChildSelector();
    const child = selector ? root.querySelector(selector) : null;
    return child ?? root;
  }

  private updateHost(target: HTMLElement): void {
    if (this.host && this.host !== target) {
      this.unsetFullScreen();
    }
    this.host = target;
  }

  private resolveStrategyForCurrentDevice(): FullScreenStrategy | null {
    const config = this.fullScreenConfig();
    if (!config) return null;

    const fallback = this.normalizeStrategy(config.default);

    if (this.deviceType.isMobile()) {
      return this.normalizeStrategy(config.mobile, fallback);
    }

    if (this.deviceType.isTablet()) {
      return this.normalizeStrategy(config.tablet, fallback);
    }

    if (this.deviceType.isDesktop()) {
      return this.normalizeStrategy(config.desktop, fallback);
    }

    return fallback;
  }

  private normalizeStrategy(
    strategy?: FullScreenStrategy | false,
    fallback: FullScreenStrategy | null = null
  ): FullScreenStrategy | null {
    if (strategy === false) return null;
    if (strategy) return strategy;
    return fallback;
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
      this.activeStrategy === 'native' &&
      !fullscreenEl &&
      this.lastShouldBeOpen
    ) {
      console.log('exist full screem');
      this.unsetFullScreen();
      this.activeStrategy = null;
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
          this.activeStrategy === 'native' &&
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
