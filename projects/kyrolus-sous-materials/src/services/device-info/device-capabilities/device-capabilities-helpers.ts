import { ColorScheme, ContrastPreference, DeviceCapabilities, DynamicRange, Hover, MQLEvent, MQLike, Pointer, ReducedMotion } from "./device-capabilities-types";

export function hasWindow(): boolean {
  return (
    globalThis.window !== undefined &&
    typeof globalThis.window.matchMedia === 'function'
  );
}
export function mql(query: string): MQLike | null {
  /* v8 ignore next */
  return hasWindow() ? globalThis.window.matchMedia(query) : null;
}
export function queryTrue(q: string): boolean {
  const m = mql(q);
  return !!m && !!m.matches;
}
export function onChange(q: string, cb: (e: MQLEvent) => void): () => void {
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

export function detectColorScheme(): ColorScheme {
  if (queryTrue('(prefers-color-scheme: dark)')) return 'dark';
  if (queryTrue('(prefers-color-scheme: light)')) return 'light';
  return 'no-preference';
}

export function detectReducedMotion(): ReducedMotion {
  return queryTrue('(prefers-reduced-motion: reduce)')
    ? 'reduce'
    : 'no-preference';
}

export function detectContrast(): ContrastPreference {
  if (queryTrue('(prefers-contrast: more)')) return 'more';
  if (queryTrue('(prefers-contrast: less)')) return 'less';
  return 'no-preference';
}

export function detectForcedColors(): boolean {
  return queryTrue('(forced-colors: active)');
}

export function detectColorGamut(): ColorGamut | null{
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

export function detectDynamicRange(): DynamicRange {
  return queryTrue('(dynamic-range: high)') ? 'high' : 'standard';
}

export function detectPointer(): Pointer {
  if (queryTrue('(pointer: fine)')) return 'fine';
  if (queryTrue('(pointer: coarse)')) return 'coarse';
  return 'none';
}

export function detectHover(): Hover {
  return queryTrue('(hover: hover)') ? 'hover' : 'none';
}

export function collectFlags<T extends string>(pairs: Array<[string, T]>): T[] {
  const out: T[] = [];
  for (const [q, v] of pairs) {
    if (queryTrue(q) && !out.includes(v)) out.push(v);
  }
  return out;
}

export function detectAnyPointer(): Pointer[] {
  return collectFlags<Pointer>([
    ['(any-pointer: fine)', 'fine'],
    ['(any-pointer: coarse)', 'coarse'],
    ['(any-pointer: none)', 'none'],
  ]);
}

export function detectAnyHover(): Hover[] {
  return collectFlags<Hover>([
    ['(any-hover: hover)', 'hover'],
    ['(any-hover: none)', 'none'],
  ]);
}

export function detectReducedData(): boolean | null {
  if (mql('(prefers-reduced-data: reduce)') === null) return null;
  return queryTrue('(prefers-reduced-data: reduce)');
}

export function collectSnapshot(): DeviceCapabilities {
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
