import { Injectable, signal } from '@angular/core';
import { AlertConfig } from './alert.types';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  readonly config = signal<AlertConfig>({
    title: '',
    text: '',
    type: 'info',
    position: 'center',
    theme: 'light',
    isPaused: false,
    showCancelButton: false,
    cancelButtonText: 'Cancel',
    autoClose: false,
  });
  readonly isVisible = signal<boolean | null>(false);
  readonly isConfirmed = signal<boolean | null>(null);
  show(config: AlertConfig) {
    this.config.update((x) => ({ ...x, ...config }));
    this.isVisible.set(true);
  }
  update(config: Partial<AlertConfig>) {
    this.config.update((x) => ({ ...x, ...config }));
  }
  close(result: boolean | null) {
    this.isVisible.set(null);
    this.isConfirmed.set(result);
  }

  success(
    text: string,
    title: string = 'Success',
    config: Partial<AlertConfig> = {
      cancelButtonText: 'Close',
      autoClose: 2000,
      icon: { options: { provider: 'bi' }, name: 'check-circle' },
    }
  ) {
    this.show({
      ...config,
      icon: config.icon ?? {
        options: { provider: 'bi' },
        name: 'check-circle',
      },
      text,
      title,
      type: 'success',
    });
  }

  error(
    text: string,
    title: string = 'Error',
    config: Partial<AlertConfig> = {
      cancelButtonText: 'Close',
      icon: { options: { provider: 'bi' }, name: 'x-circle' },
    }
  ) {
    this.show({
      ...config,
      icon: config.icon ?? { options: { provider: 'bi' }, name: 'x-circle' },
      text,
      title,
      type: 'danger',
    });
  }

  warning(
    text: string,
    title: string = 'Warning',
    config: Partial<AlertConfig> = {
      showCancelButton: true,
      cancelButtonText: 'Close',
      confirmButtonText: 'OK',
      icon: { options: { provider: 'bi' }, name: 'exclamation-triangle' },
    }
  ) {
    this.show({
      ...config,
      icon: config.icon ?? {
        options: { provider: 'bi' },
        name: 'exclamation-triangle',
      },
      text,
      title,
      type: 'warning',
    });
  }

  info(
    text: string,
    title?: string,
    config: Partial<AlertConfig> = {
      autoClose: 5000,
      cancelButtonText: 'Close',
      icon: { options: { provider: 'bi' }, name: 'info-circle' },
    }
  ) {
    this.show({
      ...config,
      icon: config.icon ?? { options: { provider: 'bi' }, name: 'info-circle' },
      text,
      title,
    });
  }

  question(
    text: string,
    title?: string,
    config: Partial<AlertConfig> = {
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      icon: { options: { provider: 'bi' }, name: 'question-circle' },
    }
  ) {
    this.show({
      ...config,
      icon: config.icon ?? {
        options: { provider: 'bi' },
        name: 'question-circle',
      },
      text,
      title,
      type: 'question',
    });
  }

  pauseTimer() {
    this.config.update((x) => ({ ...x, isPaused: true }));
  }

  resumeTimer() {
    this.config.update((x) => ({ ...x, isPaused: false }));
  }
}
