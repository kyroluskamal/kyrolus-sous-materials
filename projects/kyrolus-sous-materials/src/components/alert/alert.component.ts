import { Component, computed, effect, inject } from '@angular/core';
import { AlertService } from './alert.service';
import { AlertPosition, AlertType } from './alert.types';
import { IconDirective } from '../../directives/icon.directive';
import { ButtonDirective } from '../button/button.directive';
import { ButtonAppearance } from '../button/button.types';
import { BackDropDirective } from '../../directives/back-drop.directive';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { fadeInOut } from '../../animations/animations.export';

@Component({
  selector: 'ks-alert',
  imports: [
    IconDirective,
    ButtonDirective,
    BackDropDirective,
    ProgressBarComponent,
  ],
  animations: [fadeInOut],

  templateUrl: `./alert.component.html`,
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  private readonly alertService = inject(AlertService);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private remainingTime: number = 0;
  private startTime: number = Date.now();
  // Connect to service signals
  isVisible = this.alertService.isVisible;

  // Computed values from service config
  title = computed(() => this.alertService.config()?.title ?? '');
  text = computed(() => this.alertService.config()?.text ?? '');
  type = computed(
    () => this.alertService.config()?.type ?? ('info' as AlertType)
  );
  position = computed(
    () => this.alertService.config()?.position ?? ('center' as AlertPosition)
  );

  pauseTimer() {
    this.alertService.pauseTimer();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.remainingTime = this.castAutoClose() - (Date.now() - this.startTime);
    }
  }
  resumeTimer() {
    this.alertService.resumeTimer();
    if (this.remainingTime > 0) {
      this.timeoutId = setTimeout(() => {
        this.alertService.close(false);
      }, this.remainingTime);
    }
  }
  theme = computed(() => this.alertService.config()?.theme ?? 'light');
  icon = computed(() => this.alertService.config()?.icon);
  showCancelButton = computed(
    () => this.alertService.config()?.showCancelButton ?? false
  );
  confirmButtonText = computed(
    () => this.alertService.config()?.confirmButtonText ?? 'OK'
  );
  cancelButtonText = computed(
    () => this.alertService.config()?.cancelButtonText ?? 'Cancel'
  );
  autoClose = computed(() => this.alertService.config()?.autoClose ?? false);
  castAutoClose = computed(() =>
    typeof this.autoClose() == 'number' ? (this.autoClose() as number) : 0
  );
  isPaused = computed(() => this.alertService.config()?.isPaused);
  buttonAppearance = computed(() => {
    const appearnce = this.type();
    if (this.type() === 'question') {
      return 'secondary';
    }
    return appearnce as ButtonAppearance;
  });

  constructor() {
    effect(() => {
      if (this.isVisible() && this.autoClose()) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        if (!this.isPaused()) {
          // Start or resume the timer with the remaining time
          this.startTime = Date.now();
          this.timeoutId = setTimeout(
            () => {
              this.alertService.close(false);
            },
            this.remainingTime > 0 ? this.remainingTime : this.castAutoClose()
          );
        }
      } else {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = null;
        this.remainingTime = 0;
      }
    });
  }

  onConfirm() {
    this.alertService.close(true);
  }

  onCancel() {
    this.alertService.close(false);
  }

  onOverlayClick(event: MouseEvent) {
    this.onCancel();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onCancel();
    }
  }
}
