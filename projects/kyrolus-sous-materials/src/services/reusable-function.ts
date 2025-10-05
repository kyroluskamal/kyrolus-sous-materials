import { Signal, DestroyRef } from '@angular/core';
import {
  toSignal,
  ToSignalOptions,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import { defer, from, Observable } from 'rxjs';

type NoSync<T> = Omit<ToSignalOptions<T>, 'requireSync'> & {
  requireSync?: false;
};
type PSOptions<T> = NoSync<T> & {
  destroyRef?: DestroyRef;
};

export function promiseToSignal<T, U extends T>(
  factory: () => Promise<T>,
  options: PSOptions<T | U> & { initialValue: U }
): Signal<T | U>;

export function promiseToSignal<T>(
  factory: () => Promise<T>,
  options: PSOptions<T | null>
): Signal<T | null>;

export function promiseToSignal<T>(
  factory: () => Promise<T>,
  options?: PSOptions<T | undefined>
): Signal<T | undefined>;

// ---------------- Implement ----------------
export function promiseToSignal<T>(
  factory: () => Promise<T>,
  options?: PSOptions<T>
): Signal<T | undefined> {
  let src: Observable<T> = defer(() => from(factory()));
  if (options?.destroyRef) {
    src = src.pipe(takeUntilDestroyed(options.destroyRef));
  }

  return toSignal(src, options as any);
}
