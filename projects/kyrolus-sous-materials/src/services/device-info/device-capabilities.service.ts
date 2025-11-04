import { Injectable, Signal, signal } from '@angular/core';

export type ColorScheme = 'light' | 'dark' | 'no-preference';
export type ReducedMotion = 'reduce' | 'no-preference';
export type ContrastPreference = 'more' | 'less' | 'no-preference';
export type ColorGamut = 'srgb' | 'p3' | 'rec2020' | null;
export type DynamicRange = 'high' | 'standard';
export type Pointer = 'none' | 'coarse' | 'fine';
export type Hover = 'none' | 'hover';

export interface DeviceCapabilities {
  colorScheme: ColorScheme;
  reducedMotion: ReducedMotion;
  contrast: ContrastPreference;
  forcedColors: boolean;
  colorGamut: ColorGamut;
  dynamicRange: DynamicRange;
  pointer: Pointer;
  anyPointer: Pointer[];
  hover: Hover;
  anyHover: Hover[];
  reducedData: boolean | null;
}

type MQLEvent = { matches: boolean; media: string };
type MQLike = {
  media: string;
  matches: boolean;
  addEventListener?: (type: 'change', cb: (e: MQLEvent) => void) => void;
  removeEventListener?: (type: 'change', cb: (e: MQLEvent) => void) => void;
  addListener?: (cb: (e: MQLEvent) => void) => void; // legacy
  removeListener?: (cb: (e: MQLEvent) => void) => void; // legacy
};

function hasWindow(): boolean {
  return (
    globalThis.window !== undefined &&
    typeof globalThis.window.matchMedia === 'function'
  );
}
function mql(query: string): MQLike | null {
  /* v8 ignore next */
  return hasWindow() ? globalThis.window.matchMedia(query) : null;
}
function queryTrue(q: string): boolean {
  const m = mql(q);
  return !!m && !!m.matches;
}
function onChange(q: string, cb: (e: MQLEvent) => void): () => void {
  const m = mql(q);
  if (!m) return () => {};
  if (typeof m.addEventListener === 'function') {
    m.addEventListener('change', cb);
    return () => m.removeEventListener?.('change', cb);
  }
  if (typeof m.addListener === 'function') {
    m.addListener(cb);
    return () => m.removeListener?.(cb);
  }
  return () => {};
}

const DEFAULT_CAPS: DeviceCapabilities = {
  colorScheme: 'no-preference',
  reducedMotion: 'no-preference',
  contrast: 'no-preference',
  forcedColors: false,
  colorGamut: null,
  dynamicRange: 'standard',
  pointer: 'none',
  anyPointer: [],
  hover: 'none',
  anyHover: [],
  reducedData: null,
};

function detectColorScheme(): ColorScheme {
  if (queryTrue('(prefers-color-scheme: dark)')) return 'dark';
  if (queryTrue('(prefers-color-scheme: light)')) return 'light';
  return 'no-preference';
}

function detectReducedMotion(): ReducedMotion {
  return queryTrue('(prefers-reduced-motion: reduce)')
    ? 'reduce'
    : 'no-preference';
}

function detectContrast(): ContrastPreference {
  if (queryTrue('(prefers-contrast: more)')) return 'more';
  if (queryTrue('(prefers-contrast: less)')) return 'less';
  return 'no-preference';
}

function detectForcedColors(): boolean {
  return queryTrue('(forced-colors: active)');
}

function detectColorGamut(): ColorGamut {
  const candidates: Array<[string, ColorGamut]> = [
    ['(color-gamut: rec2020)', 'rec2020'],
    ['(color-gamut: p3)', 'p3'],
    ['(color-gamut: srgb)', 'srgb'],
  ];
  for (const [q, val] of candidates) {
    if (queryTrue(q)) return val;
  }
  return null;
}

function detectDynamicRange(): DynamicRange {
  return queryTrue('(dynamic-range: high)') ? 'high' : 'standard';
}

function detectPointer(): Pointer {
  if (queryTrue('(pointer: fine)')) return 'fine';
  if (queryTrue('(pointer: coarse)')) return 'coarse';
  return 'none';
}

function detectHover(): Hover {
  return queryTrue('(hover: hover)') ? 'hover' : 'none';
}

function collectFlags<T extends string>(pairs: Array<[string, T]>): T[] {
  // dedupe while keeping order
  const out: T[] = [];
  for (const [q, v] of pairs) {
    if (queryTrue(q) && !out.includes(v)) out.push(v);
  }
  return out;
}

function detectAnyPointer(): Pointer[] {
  return collectFlags<Pointer>([
    ['(any-pointer: fine)', 'fine'],
    ['(any-pointer: coarse)', 'coarse'],
    ['(any-pointer: none)', 'none'],
  ]);
}

function detectAnyHover(): Hover[] {
  return collectFlags<Hover>([
    ['(any-hover: hover)', 'hover'],
    ['(any-hover: none)', 'none'],
  ]);
}

function detectReducedData(): boolean | null {
  if (mql('(prefers-reduced-data: reduce)') === null) return null;
  return queryTrue('(prefers-reduced-data: reduce)');
}

function collectSnapshot(): DeviceCapabilities {
  if (!hasWindow()) return DEFAULT_CAPS;

  return {
    colorScheme: detectColorScheme(),
    reducedMotion: detectReducedMotion(),
    contrast: detectContrast(),
    forcedColors: detectForcedColors(),
    colorGamut: detectColorGamut(),
    dynamicRange: detectDynamicRange(),
    pointer: detectPointer(),
    anyPointer: detectAnyPointer(),
    hover: detectHover(),
    anyHover: detectAnyHover(),
    reducedData: detectReducedData(),
  };
}

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

  // convenience getters (unchanged)
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
  colorGamut(): ColorGamut {
    return this._cap().colorGamut;
  }

  // tests/dispose
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
