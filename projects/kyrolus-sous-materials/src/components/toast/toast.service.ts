import { Injectable, linkedSignal, signal } from '@angular/core';
import {
  Toast,
  ToastPriority,
  ToastPriorityEnum,
  ToastTypeEnum,
} from './toast.type';
import { IconType } from '../../directives/icon.types';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly MAX_TOASTS = 5;
  private readonly toasts = signal<Toast[]>([]);
  defaultDuration = 5000;

  // Computed signal that sorts toasts by priority and timestamp
  readonly sortedToasts = linkedSignal(() => {
    const priorityOrder: Record<ToastPriority, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...this.toasts()]
      .sort((a, b) => {
        const priorityDiff =
          priorityOrder[b.priority] - priorityOrder[a.priority];
        return priorityDiff === 0 ? b.timestamp - a.timestamp : priorityDiff;
      })
      .slice(0, this.MAX_TOASTS);
  });

  show(
    title: string,
    message: string,
    config: Partial<Toast> = {
      duration: 5000,
      priority: 'medium',
      actionText: 'Dismiss',
      actionCallback: () => {},
      isPaused: signal(false),
    }
  ) {
    const now = Date.now();
    const toast: Toast = {
      id: crypto.randomUUID(),
      title,
      message,
      timestamp: Date.now(),
      timeoutId: setTimeout(() => {
        this.remove(toast.id);
      }, config.duration ?? this.defaultDuration),
      priority: config.priority ?? ToastPriorityEnum.MEDIUM,
      duration: config.duration ?? this.defaultDuration,
      type: config.type ?? ToastTypeEnum.INFO,
      remainingTime: signal(config.duration ?? this.defaultDuration),
      lastUpdate: signal(now),
      ...config,
    };

    this.toasts.update((current) => [toast, ...current]);
  }

  info(
    title: string,
    message: string,
    config: Partial<Toast> = {
      duration: this.defaultDuration,
      priority: 'medium',
      isPaused: signal(false),
    }
  ) {
    let conf = {
      type: ToastTypeEnum.INFO,
      icon: { type: 'bi' as IconType, name: 'info-circle' },
      ...config,
    };
    this.show(title, message, conf);
  }

  success(
    title: string,
    message: string,
    config: Partial<Toast> = {
      duration: this.defaultDuration,
      priority: 'medium',
      isPaused: signal(false),
    }
  ) {
    let conf = {
      type: ToastTypeEnum.SUCCESS,
      icon: { type: 'bi' as IconType, name: 'check-circle' },
      ...config,
    };
    this.show(title, message, conf);
  }

  warning(
    title: string,
    message: string,
    config: Partial<Toast> = {
      duration: this.defaultDuration,
      priority: 'medium',
      isPaused: signal(false),
    }
  ) {
    let conf = {
      type: ToastTypeEnum.WARNING,
      icon: { type: 'bi' as IconType, name: 'exclamation-triangle' },
      ...config,
    };
    this.show(title, message, conf);
  }

  error(
    title: string,
    message: string,
    config: Partial<Toast> = {
      duration: this.defaultDuration,
      priority: 'medium',
      isPaused: signal(false),
    }
  ) {
    let conf = {
      type: ToastTypeEnum.ERROR,
      icon: { type: 'bi' as IconType, name: 'x-circle' },
      ...config,
    };
    this.show(title, message, conf);
  }

  remove(id: string) {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }

  pauseTimer(id: string) {
    this.toasts.update((current) => {
      return current.map((toast) => {
        if (toast.id === id && toast.isPaused) {
          toast.isPaused.set(true);
          return { ...toast };
        }
        if (toast.timeoutId) {
          clearTimeout(toast.timeoutId);
          toast.remainingTime.set(
            toast.duration - (Date.now() - toast.lastUpdate())
          );
        }
        return toast;
      });
    });
  }

  resumeTimer(id: string) {
    this.toasts.update((current) => {
      return current.map((toast) => {
        if (toast.id === id && toast.isPaused) {
          toast.isPaused.set(false);
          toast.lastUpdate.set(Date.now());
          if (toast.remainingTime() > 0) {
            toast.timeoutId = setTimeout(() => {
              this.remove(toast.id);
            }, toast.remainingTime());
          }
          return { ...toast };
        }
        return toast;
      });
    });
  }
}
