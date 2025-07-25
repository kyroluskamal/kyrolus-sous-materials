import { WritableSignal } from '@angular/core';
import { IconOptions, IconProvider } from '../../directives/icon/icon.types';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPriority = 'high' | 'medium' | 'low';

export enum ToastPriorityOrderEnum {
  high = 3,
  medium = 2,
  low = 1,
}

export enum ToastTypeEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export enum ToastPriorityEnum {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  priority: ToastPriority;
  duration: number;
  timestamp: number;
  actionText?: string;
  timeoutId?: ReturnType<typeof setTimeout>;
  actionCallback?: () => void;
  isPaused?: WritableSignal<boolean>;
  icon?: { options: IconOptions; name: string };
  remainingTime: WritableSignal<number>;
  lastUpdate: WritableSignal<number>;
}
