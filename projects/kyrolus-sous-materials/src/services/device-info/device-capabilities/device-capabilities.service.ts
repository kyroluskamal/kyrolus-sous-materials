import { Injectable, Signal, signal } from '@angular/core';
import { collectSnapshot, hasWindow, onChange } from './device-capabilities-helpers';
import { ColorScheme, ContrastPreference, DeviceCapabilities, DynamicRange, Hover, Pointer, ReducedMotion } from './device-capabilities-types';



@Injectable({ providedIn: 'root' })
export class DeviceCapabilitiesService {
  /* v8 ignore next */
  private readonly _cap = signal<DeviceCapabilities>(collectSnapshot());
  private rafId: number | null = null;
  private readonly unsubscribers: Array<() => void> = [];

  constructor() {
    if (!hasWindow()) return;

    const queries = [
      '(prefers-color-scheme: dark)',
      '(prefers-color-scheme: light)',
      '(prefers-reduced-motion: reduce)',
      '(prefers-contrast: more)',
      '(prefers-contrast: less)',
      '(forced-colors: active)',
      '(color-gamut: rec2020)',
      '(color-gamut: p3)',
      '(color-gamut: srgb)',
      '(dynamic-range: high)',
      '(pointer: fine)',
      '(pointer: coarse)',
      '(pointer: none)',
      '(any-pointer: fine)',
      '(any-pointer: coarse)',
      '(any-pointer: none)',
      '(hover: hover)',
      '(hover: none)',
      '(any-hover: hover)',
      '(any-hover: none)',
      '(prefers-reduced-data: reduce)',
    ] as const;

    const schedule = () => {
      if (this.rafId != null) return;
      const raf =
        typeof globalThis.window.requestAnimationFrame === 'function'
          ? globalThis.window.requestAnimationFrame.bind(globalThis.window)
          : (cb: FrameRequestCallback) => globalThis.window.setTimeout(cb, 0);
      this.rafId = raf(() => {
        this.rafId = null;
        this._cap.set(collectSnapshot());
      });
    };

    for (const q of queries) {
      this.unsubscribers.push(onChange(q, () => schedule()));
    }
  }

  capabilities(): Signal<DeviceCapabilities> {
    return this._cap.asReadonly();
  }
  snapshot(): DeviceCapabilities {
    return this._cap();
  }

  colorScheme(): ColorScheme {
    return this._cap().colorScheme;
  }
  reducedMotion(): ReducedMotion {
    return this._cap().reducedMotion;
  }
  contrast(): ContrastPreference {
    return this._cap().contrast;
  }
  pointer(): Pointer {
    return this._cap().pointer;
  }
  hover(): Hover {
    return this._cap().hover;
  }
  dynamicRange(): DynamicRange {
    return this._cap().dynamicRange;
  }
  colorGamut(): ColorGamut | null{
    return this._cap().colorGamut;
  }

  _disposeForTests(): void {
    for (const u of this.unsubscribers.splice(0)) {
      try {
        u();
      } catch {}
    }
    if (this.rafId != null) {
      const caf =
        typeof globalThis.window.cancelAnimationFrame === 'function'
          ? globalThis.window.cancelAnimationFrame.bind(globalThis.window)
          : (id: number) => globalThis.window.clearTimeout(id);
      caf(this.rafId);
      this.rafId = null;
    }
  }
}
