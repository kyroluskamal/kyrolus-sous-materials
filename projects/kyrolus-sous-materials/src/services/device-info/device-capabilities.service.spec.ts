import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DeviceCapabilitiesService } from './device-capabilities.service';

/* ---------------------- Test helpers & stubs ---------------------- */

type ChangeCb = (e: { matches: boolean; media: string }) => void;

class MQLStub {
  media: string;
  matches: boolean;
  private readonly listeners = new Set<ChangeCb>();

  constructor(media: string, matches: boolean) {
    this.media = media;
    this.matches = matches;
  }

  addEventListener(type: 'change', cb: ChangeCb) {
    if (type === 'change') this.listeners.add(cb);
  }
  removeEventListener(type: 'change', cb: ChangeCb) {
    if (type === 'change') this.listeners.delete(cb);
  }
  addListener(cb: ChangeCb) {
    this.listeners.add(cb);
  }
  removeListener(cb: ChangeCb) {
    this.listeners.delete(cb);
  }

  dispatch(matches: boolean) {
    this.matches = matches;
    const evt = { matches, media: this.media };
    for (const cb of Array.from(this.listeners)) cb(evt);
  }
}

class LegacyMQLStub {
  media: string;
  matches: boolean;
  private  readonly listeners = new Set<ChangeCb>();

  constructor(media: string, matches: boolean) {
    this.media = media;
    this.matches = matches;
  }
  
  addListener(cb: ChangeCb) {
    this.listeners.add(cb);
  }
  removeListener(cb: ChangeCb) {
    this.listeners.delete(cb);
  }

  dispatch(v: boolean) {
    this.matches = v;
    const evt = { matches: v, media: this.media };
    for (const cb of Array.from(this.listeners)) cb(evt);
  }
}

/** أقل Stub ممكن: لا addEventListener ولا addListener (نغطي فرع noop unsubscriber) */
class BareMQLStub {
  media: string;
  matches: boolean;
  constructor(media: string, matches: boolean) {
    this.media = media;
    this.matches = matches;
  }
  /** تحديث داخلي بدون إشعارات */
  setMatches(v: boolean) {
    this.matches = v;
  }
}

type MatchMediaWithHooks<T> = ((q: string) => T | null) & {
  __store: Map<string, T>;
  __set: (q: string, v: boolean) => void;
};

function makeMatchMediaStub(
  initial: Record<string, boolean>,
  unsupported: string[] = []
): MatchMediaWithHooks<MQLStub> {
  const store = new Map<string, MQLStub>();

  const get = (q: string) => {
    if (unsupported.includes(q)) return null;
    if (!store.has(q)) store.set(q, new MQLStub(q, !!initial[q]));
    return store.get(q)!;
  };

  const fn = ((q: string) => get(q)) as unknown as MatchMediaWithHooks<MQLStub>;
  fn.__store = store;
  fn.__set = (q: string, v: boolean) => {
    const m = get(q);
    if (m) m.dispatch(v);
  };
  return fn;
}

function makeLegacyMatchMediaStub(
  initial: Record<string, boolean>
): MatchMediaWithHooks<LegacyMQLStub> {
  const store = new Map<string, LegacyMQLStub>();
  const get = (q: string) => {
    if (!store.has(q)) store.set(q, new LegacyMQLStub(q, !!initial[q]));
    return store.get(q)!;
  };
  const fn = ((q: string) =>
    get(q)) as unknown as MatchMediaWithHooks<LegacyMQLStub>;
  fn.__store = store;
  fn.__set = (q: string, v: boolean) => get(q).dispatch(v);
  return fn;
}

/** mm بدون أي API listeners → onChange يختار return () => {} */
function makeBareMatchMediaStub(
  initial: Record<string, boolean>
): MatchMediaWithHooks<BareMQLStub> {
  const store = new Map<string, BareMQLStub>();
  const get = (q: string) => {
    if (!store.has(q)) store.set(q, new BareMQLStub(q, !!initial[q]));
    return store.get(q)!;
  };
  const fn = ((q: string) =>
    get(q)) as unknown as MatchMediaWithHooks<BareMQLStub>;
  fn.__store = store;
  fn.__set = (q: string, v: boolean) => get(q).setMatches(v);
  return fn;
}

function installWindow(
  mm: any,
  withRAF: boolean,
  withCancelRAF: boolean = true
) {
  const base: any = { matchMedia: mm, setTimeout, clearTimeout };
  if (withRAF) {
    base.requestAnimationFrame = (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now()), 0);
  }
  if (withCancelRAF) {
    base.cancelAnimationFrame = (id: number) => clearTimeout(id);
  }
  vi.stubGlobal('window', base);
  vi.stubGlobal('matchMedia', mm);
}

/* ---------------------- Lifecycle hooks ---------------------- */

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

/* ---------------------- Test suite ---------------------- */

describe('DeviceCapabilitiesService', () => {
  it('SSR: returns DEFAULT_CAPS when window.matchMedia is unavailable', () => {
    vi.stubGlobal('window', { setTimeout, clearTimeout } as any);

    const svc = new DeviceCapabilitiesService();
    const snap = svc.snapshot();

    expect(snap.colorScheme).toBe('no-preference');
    expect(snap.reducedMotion).toBe('no-preference');
    expect(snap.contrast).toBe('no-preference');
    expect(snap.forcedColors).toBe(false);
    expect(snap.colorGamut).toBeNull();
    expect(snap.dynamicRange).toBe('standard');
    expect(snap.pointer).toBe('none');
    expect(snap.anyPointer).toEqual([]);
    expect(snap.hover).toBe('none');
    expect(snap.anyHover).toEqual([]);
    expect(snap.reducedData).toBeNull();

    vi.runAllTimers();
    expect(svc.snapshot()).toEqual(snap);
    svc._disposeForTests();
  });

  it('builds conservative default snapshot and updates via addEventListener', () => {
    const mm = makeMatchMediaStub({
      '(prefers-color-scheme: dark)': false,
      '(prefers-color-scheme: light)': false,
      '(prefers-reduced-motion: reduce)': false,
      '(prefers-contrast: more)': false,
      '(prefers-contrast: less)': false,
      '(forced-colors: active)': false,
      '(color-gamut: rec2020)': false,
      '(color-gamut: p3)': false,
      '(color-gamut: srgb)': false,
      '(dynamic-range: high)': false,
      '(pointer: fine)': false,
      '(pointer: coarse)': false,
      '(pointer: none)': true,
      '(any-pointer: fine)': false,
      '(any-pointer: coarse)': false,
      '(any-pointer: none)': true,
      '(hover: hover)': false,
      '(hover: none)': true,
      '(any-hover: hover)': false,
      '(any-hover: none)': true,
      '(prefers-reduced-data: reduce)': false,
    });
    installWindow(mm, true);

    const svc = new DeviceCapabilitiesService();
    const snap0 = svc.snapshot();

    expect(snap0.anyPointer).toEqual(['none']);
    expect(snap0.anyHover).toEqual(['none']);
    expect(snap0.reducedData).toBe(false);


    mm.__set('(prefers-color-scheme: dark)', true);
    mm.__set('(prefers-reduced-motion: reduce)', true);
    mm.__set('(prefers-contrast: more)', true);
    mm.__set('(color-gamut: p3)', true);
    mm.__set('(dynamic-range: high)', true);
    mm.__set('(hover: hover)', true);
    mm.__set('(hover: none)', false);
    mm.__set('(any-hover: hover)', true);
    mm.__set('(any-hover: none)', false);

    vi.runAllTimers();

    const snap1 = svc.snapshot();
    expect(snap1.colorScheme).toBe('dark');
    expect(snap1.reducedMotion).toBe('reduce');
    expect(snap1.contrast).toBe('more');
    expect(snap1.colorGamut).toBe('p3');
    expect(snap1.dynamicRange).toBe('high');
    expect(snap1.anyHover).toEqual(['hover']);
    svc._disposeForTests();
  });

  it('resolves pointer & any-pointer correctly and switches at runtime', () => {
    const mm = makeMatchMediaStub({
      '(pointer: fine)': false,
      '(pointer: coarse)': true,
      '(pointer: none)': false,
      '(any-pointer: fine)': false,
      '(any-pointer: coarse)': true,
      '(any-pointer: none)': false,
      '(hover: hover)': false,
      '(hover: none)': true,
      '(any-hover: hover)': false,
      '(any-hover: none)': true,
    });
    installWindow(mm, true);

    const svc = new DeviceCapabilitiesService();
    const s0 = svc.snapshot();
    expect(s0.pointer).toBe('coarse');
    expect(s0.anyPointer).toEqual(['coarse']);


    mm.__set('(pointer: coarse)', false);
    mm.__set('(pointer: fine)', true);
    mm.__set('(any-pointer: fine)', true);
    vi.runAllTimers();

    const s1 = svc.snapshot();
    expect(s1.pointer).toBe('fine');
    expect(s1.anyPointer).toEqual(['fine', 'coarse']);
    svc._disposeForTests();
  });

  it('color-gamut priority: rec2020 > p3 > srgb', () => {
    const mm = makeMatchMediaStub({
      '(color-gamut: srgb)': true,
      '(color-gamut: p3)': true,
      '(color-gamut: rec2020)': false,
    });
    installWindow(mm, true);

    const svc = new DeviceCapabilitiesService();
    expect(svc.snapshot().colorGamut).toBe('p3');

    mm.__set('(color-gamut: rec2020)', true);
    vi.runAllTimers();
    expect(svc.snapshot().colorGamut).toBe('rec2020');
    svc._disposeForTests();
  });

  it('prefers-reduced-data: supported false/true; unsupported -> null', () => {

    let mm = makeMatchMediaStub({
      '(prefers-reduced-data: reduce)': false,
    });
    installWindow(mm, true);
    const svc1 = new DeviceCapabilitiesService();
    expect(svc1.snapshot().reducedData).toBe(false);
    mm.__set('(prefers-reduced-data: reduce)', true);
    vi.runAllTimers();
    expect(svc1.snapshot().reducedData).toBe(true);
    svc1._disposeForTests();


    mm = makeMatchMediaStub({}, ['(prefers-reduced-data: reduce)']);
    installWindow(mm, true);
    const svc2 = new DeviceCapabilitiesService();
    expect(svc2.snapshot().reducedData).toBeNull();
    svc2._disposeForTests();
  });

  it('uses legacy addListener/removeListener when addEventListener is missing', () => {
    const mm = makeLegacyMatchMediaStub({
      '(prefers-contrast: more)': false,
    });
    installWindow(mm, true);

    const svc = new DeviceCapabilitiesService();
    mm.__set('(prefers-contrast: more)', true);
    vi.runAllTimers();
    expect(svc.snapshot().contrast).toBe('more');


    svc._disposeForTests();
    mm.__set('(prefers-contrast: more)', false);
    vi.runAllTimers();
    expect(svc.snapshot().contrast).toBe('more');
  });

  it('falls back to setTimeout scheduling when requestAnimationFrame is unavailable', () => {
    const mm = makeMatchMediaStub({
      '(prefers-color-scheme: dark)': false,
    });
    installWindow(mm, /*withRAF*/ false);

    const svc = new DeviceCapabilitiesService();
    mm.__set('(prefers-color-scheme: dark)', true);

    vi.runAllTimers();
    expect(svc.snapshot().colorScheme).toBe('dark');
    svc._disposeForTests();
  });

  it('dispose cancels scheduled recompute and unsubscribes listeners', () => {
    const mm = makeMatchMediaStub({
      '(prefers-color-scheme: dark)': false,
    });
    installWindow(mm, true);

    const svc = new DeviceCapabilitiesService();
    const before = svc.snapshot();

    mm.__set('(prefers-color-scheme: dark)', true);
    svc._disposeForTests();

    vi.runAllTimers();
    expect(svc.snapshot()).toEqual(before);

    mm.__set('(prefers-color-scheme: dark)', false);
    vi.runAllTimers();
    expect(svc.snapshot()).toEqual(before);
  });

  /** يغطي onChange الفرع الثالث: لا addEventListener ولا addListener → () => {} */
  it('onChange returns a noop unsubscriber when no listener APIs exist (no updates fired)', () => {
    const mm = makeBareMatchMediaStub({
      '(hover: hover)': false,
      '(hover: none)': true,
      '(any-hover: hover)': false,
      '(any-hover: none)': true,
    });

    installWindow(mm, true);

    const svc = new DeviceCapabilitiesService();
    const before = svc.snapshot();


    mm.__set('(hover: hover)', true);
    mm.__set('(hover: none)', false);
    mm.__set('(any-hover: hover)', true);
    mm.__set('(any-hover: none)', false);

    vi.runAllTimers();

    expect(svc.snapshot()).toEqual(before);
    svc._disposeForTests();
  });

  /** يغطي فرع clearTimeout في _disposeForTests لما cancelAnimationFrame غايب */
  it('dispose uses clearTimeout fallback when cancelAnimationFrame is undefined', () => {
    const mm = makeMatchMediaStub({
      '(prefers-color-scheme: dark)': false,
    });

    installWindow(mm, /*withRAF*/ true, /*withCancelRAF*/ false);

    const svc = new DeviceCapabilitiesService();
    const before = svc.snapshot();


    mm.__set('(prefers-color-scheme: dark)', true);


    svc._disposeForTests();

    vi.runAllTimers();
    expect(svc.snapshot()).toEqual(before);
  });

  it('any-hover/any-pointer dedupe & ordering', () => {
    const mm = makeMatchMediaStub({
      '(any-pointer: fine)': true,
      '(any-pointer: coarse)': true,
      '(any-pointer: none)': true,
      '(any-hover: hover)': true,
      '(any-hover: none)': true,
      '(pointer: fine)': true,
      '(hover: hover)': true,
      '(hover: none)': false,
    });
    installWindow(mm, true);

    const svc = new DeviceCapabilitiesService();
    const snap = svc.snapshot();

    expect(snap.anyPointer).toEqual(['fine', 'coarse', 'none']);
    expect(snap.anyHover).toEqual(['hover', 'none']);
    expect(snap.pointer).toBe('fine');
    expect(snap.hover).toBe('hover');
    svc._disposeForTests();
  });

  it('capabilities() signal mirrors snapshot() and getters reflect fields', () => {
    const mm = makeMatchMediaStub({
      '(prefers-contrast: less)': true,
      '(color-gamut: srgb)': true,
      '(dynamic-range: high)': true,
      '(pointer: coarse)': true,
      '(hover: hover)': true,
      '(any-hover: hover)': true,
    });
    installWindow(mm, true);

    const svc = new DeviceCapabilitiesService();
    const sig = svc.capabilities();
    const s = svc.snapshot();

    expect(sig().contrast).toBe(s.contrast);
    expect(svc.colorGamut()).toBe('srgb');
    expect(svc.dynamicRange()).toBe('high');
    expect(svc.pointer()).toBe('coarse');
    expect(svc.hover()).toBe('hover');
    svc._disposeForTests();
  });
  it('coalesces multiple MQ changes within the same tick (raf guard path)', () => {

    const mm = makeMatchMediaStub({
      '(hover: hover)': false,
      '(hover: none)': true,
      '(prefers-contrast: more)': false,
      '(color-gamut: srgb)': false,
    });
    installWindow(mm, /*withRAF*/ true);

    const svc = new DeviceCapabilitiesService();
    const before = svc.snapshot();


    mm.__set('(hover: hover)', true);
    mm.__set('(prefers-contrast: more)', true);
    mm.__set('(color-gamut: srgb)', true);



    vi.runAllTimers();

    const after = svc.snapshot();
    expect(after.hover).toBe('hover');
    expect(after.contrast).toBe('more');
    expect(after.colorGamut).toBe('srgb');

    expect(after).not.toEqual(before);

    svc._disposeForTests();
  });

  it('wires listeners for tail queries: (any-hover: none) and (prefers-reduced-data: reduce)', () => {

    const mm = makeMatchMediaStub({
      '(hover: hover)': false,
      '(hover: none)': true,
      '(any-hover: hover)': false,
      '(any-hover: none)': false,
      '(prefers-reduced-data: reduce)': false,
    });
    installWindow(mm, /*withRAF*/ true);

    const svc = new DeviceCapabilitiesService();


    mm.__set('(any-hover: none)', true);

    mm.__set('(prefers-reduced-data: reduce)', true);

    vi.runAllTimers();

    const snap = svc.snapshot();
    expect(snap.anyHover).toContain('none');
    expect(snap.reducedData).toBe(true);

    svc._disposeForTests();
  });
  it('registers listeners for tail queries and unsubscribes them on dispose', () => {


    const mm = makeMatchMediaStub({
      '(any-hover: none)': false,
      '(prefers-reduced-data: reduce)': false,
    });

    const t1 = mm('(any-hover: none)')!;
    const t2 = mm('(prefers-reduced-data: reduce)')!;

    const add1 = vi.spyOn(t1, 'addEventListener');
    const add2 = vi.spyOn(t2, 'addEventListener');
    const rem1 = vi.spyOn(t1, 'removeEventListener');
    const rem2 = vi.spyOn(t2, 'removeEventListener');

    installWindow(mm, /*withRAF*/ true);


    const svc = new DeviceCapabilitiesService();
    expect(add1).toHaveBeenCalledTimes(1);
    expect(add2).toHaveBeenCalledTimes(1);


    svc._disposeForTests();
    expect(rem1).toHaveBeenCalledTimes(1);
    expect(rem2).toHaveBeenCalledTimes(1);
  });

  it('schedule sets rafId and resets it to null after the callback (coalesced triggers)', () => {
    const mm = makeMatchMediaStub({
      '(hover: hover)': false,
      '(hover: none)': true,
    });
    installWindow(mm, /*withRAF*/ true);

    const svc = new DeviceCapabilitiesService();

    mm.__set('(hover: hover)', true);
    mm.__set('(hover: hover)', false);
    mm.__set('(hover: hover)', true);


    expect((svc as any).rafId).not.toBeNull();


    vi.runAllTimers();
    expect((svc as any).rafId).toBeNull();

    svc._disposeForTests();
  });
  it('getter reducedMotion() reflects current media query value', () => {
    const mm = makeMatchMediaStub({
      '(prefers-reduced-motion: reduce)': true,
    });
    installWindow(mm, /*withRAF*/ true);

    const svc = new DeviceCapabilitiesService();
    expect(svc.reducedMotion()).toBe('reduce');
    svc._disposeForTests();
  });

  it('getter contrast() reflects more/less values', () => {
    const mm = makeMatchMediaStub({
      '(prefers-contrast: more)': true,
      '(prefers-contrast: less)': false,
    });
    installWindow(mm, /*withRAF*/ true);

    const svc = new DeviceCapabilitiesService();
    expect(svc.contrast()).toBe('more');


    mm.__set('(prefers-contrast: more)', false);
    mm.__set('(prefers-contrast: less)', true);
    vi.runAllTimers();
    expect(svc.contrast()).toBe('less');

    svc._disposeForTests();
  });
  it('getter colorscheme() reflects the current color scheme', () => {

    const mm = makeMatchMediaStub({
      '(prefers-color-scheme: light)': true,
    });
    installWindow(mm, /*withRAF*/ true);

    const svc = new DeviceCapabilitiesService();


    expect(svc.colorScheme()).toBe('light');

    svc._disposeForTests();
  });
  it('calls window.matchMedia via mql() (covers line 42)', () => {

    const calls: string[] = [];
    const mm = ((q: string) => {
      calls.push(q);
      return {
        media: q,
        matches: false,
        addEventListener: (_t: 'change', _cb: any) => {},
        removeEventListener: (_t: 'change', _cb: any) => {},
      };
    }) as any;


    installWindow(mm, /*withRAF*/ true);

    const svc = new DeviceCapabilitiesService();
    expect(calls.length).toBeGreaterThan(0);

    svc._disposeForTests();
  });

  it('dispose swallows listener removal errors (covers catch at line 257)', () => {

    const target = {
      media: '',
      matches: false,
      addEventListener: (_t: 'change', _cb: any) => {},
      removeEventListener: (_t: 'change', _cb: any) => {
        throw new Error('boom');
      },
    };
    const mm = ((q: string) => target) as any;

    installWindow(mm, /*withRAF*/ true);

    const svc = new DeviceCapabilitiesService();

    expect(() => svc._disposeForTests()).not.toThrow();
  });
  it('mql() true branch: uses globalThis.window.matchMedia when available (covers line 42)', () => {
    const calls: string[] = [];


    const base: any = {
      setTimeout,
      clearTimeout,
      requestAnimationFrame: (cb: FrameRequestCallback) =>
        setTimeout(() => cb(performance.now()), 0),
      cancelAnimationFrame: (id: number) => clearTimeout(id),
      matchMedia: vi.fn((q: string) => {
        calls.push(q);
        return {
          media: q,
          matches: false,
          addEventListener: (_t: 'change', _cb: any) => {},
          removeEventListener: (_t: 'change', _cb: any) => {},
        };
      }),
    };


    vi.stubGlobal('window', base);
    vi.stubGlobal('matchMedia', base.matchMedia);


    const svc = new DeviceCapabilitiesService();

    expect(base.matchMedia).toHaveBeenCalled();
    expect(calls.length).toBeGreaterThan(0);

    svc._disposeForTests();
  });
});
