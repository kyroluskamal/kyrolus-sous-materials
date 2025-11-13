import {
  afterEveryRender,
  ComponentRef,
  createComponent,
  Directive,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  inputBinding,
  OnDestroy,
  output,
  Renderer2,
} from '@angular/core';
import { DeviceTypeService } from '../../services/device-info/device-type/device-type.service';
import { IconDirective } from '../directives.export';
import { ButtonComponent } from '../../components/button/button.component';
type fullScreenMode = 'mobile' | 'tablet' | 'desktop' | 'always';
@Directive({
  selector: '[ksFullScreen]',
})
export class FullScreenDirective implements OnDestroy {
  ngOnDestroy(): void {
    this.unsetFullScreen();
  }
  private readonly deviceType = inject(DeviceTypeService);
  private readonly el = inject<ElementRef<HTMLElement>>(
    ElementRef<HTMLElement>
  );
  private readonly renderer = inject(Renderer2);
  private readonly env = inject(EnvironmentInjector);

  readonly fullScreenClosed = output<boolean>();

  readonly childSelector = input<string>('');
  readonly fullScreenMode = input<fullScreenMode>('mobile');

  private buttonRef: ComponentRef<ButtonComponent> | null = null;
  private hostButton?: HTMLElement;
  private unlistenClick?: () => void;
  private host: HTMLElement | null = null;

  eff = afterEveryRender(() => {
    let child = this.childSelector()
      ? (this.el.nativeElement.querySelector(
          this.childSelector()
        ) as HTMLElement)
      : null;
    const target = child ?? this.el.nativeElement;

    if (this.host && this.host !== target) {
      this.unsetFullScreen();
    }
    this.host = target;
    let ShouldFullScreen =
      this.fullScreenMode() === 'always' ||
      (this.fullScreenMode() === 'mobile' && this.deviceType.isMobile()) ||
      (this.fullScreenMode() === 'desktop' && this.deviceType.isDesktop()) ||
      (this.fullScreenMode() === 'tablet' && this.deviceType.isTablet());
    let hasFullScreenClass = this.host?.classList.contains('fullscreen');
    if (this.host && ShouldFullScreen && !hasFullScreenClass) {
      this.setFullScreen();
    } else if (!ShouldFullScreen && hasFullScreenClass) {
      this.unsetFullScreen();
    }
  });

  private setFullScreen() {
    this.renderer.addClass(this.host, 'fullscreen');
    this.ensureCleanBeforeCreate();
    this.renderer.appendChild(this.host, this.createIconComponent());
  }
  private ensureCleanBeforeCreate() {
    this.unlistenClick?.();
    this.unlistenClick = undefined;

    this.buttonRef?.destroy();
    this.buttonRef = null;

    if (this.hostButton?.parentNode) {
      this.renderer.removeChild(this.hostButton.parentNode, this.hostButton);
    }
    this.hostButton = undefined;
  }
  private createIconComponent() {
    const host = this.renderer.createElement('button');
    this.hostButton = host;
    this.unlistenClick = this.renderer.listen(host, 'click', () => {
      this.unsetFullScreen();
      this.fullScreenClosed.emit(true);
    });
    this.renderer.addClass(host, 'position-absolute');
    this.renderer.setStyle(host, 'top', '10px');
    this.renderer.setStyle(host, 'right', '10px');
    this.buttonRef = createComponent(ButtonComponent, {
      environmentInjector: this.env,
      hostElement: host,
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
    this.buttonRef.changeDetectorRef.detectChanges();
    return host;
  }
  private unsetFullScreen() {
    this.ensureCleanBeforeCreate();
    if (this.host?.classList.contains('fullscreen')) {
      this.renderer.removeClass(this.host, 'fullscreen');
    }
    this.host = null;
  }
}
