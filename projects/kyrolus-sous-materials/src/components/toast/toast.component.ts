import { Component, inject, signal } from '@angular/core';
import { toastStateAnimation } from './toast.animation';
import { Toast } from './toast.type';
import { ToastService } from './toast.service';
import { IconDirective } from '../../directives/icon/icon.directive';

@Component({
  selector: 'ks-toast',
  animations: [toastStateAnimation],
  imports: [IconDirective],
  templateUrl: `./toast.component.html`,
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  toastService = inject(ToastService);
  currentTime = signal(Date.now());

  constructor() {
    const now = this.currentTime();
    this.toastService.sortedToasts.update((currentToasts) => {
      currentToasts.forEach((toast) => {
        if (toast.isPaused?.() === true) {
          toast.lastUpdate.set(now);
          this.pauseTimer(toast);
        } else {
          this.resumeTimer(toast);
        }
      });
      return currentToasts;
    });
  }
  removeToast(toast: Toast) {
    this.toastService.remove(toast.id);
  }

  pauseTimer(toast: Toast) {
    this.toastService.pauseTimer(toast.id);
  }

  resumeTimer(toast: Toast) {
    this.toastService.resumeTimer(toast.id);
  }

  handleAction(toast: Toast) {
    if (toast.actionCallback) {
      toast.actionCallback();
    }
    this.removeToast(toast);
  }
}
