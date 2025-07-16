import { WritableSignal } from '@angular/core';
import { IconType } from '../../directives/icon.types';

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
  icon?: { type: IconType; name: string };
  remainingTime: WritableSignal<number>;
  lastUpdate: WritableSignal<number>;
}
