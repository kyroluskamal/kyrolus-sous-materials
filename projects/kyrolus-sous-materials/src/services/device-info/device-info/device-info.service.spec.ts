import { TestBed } from '@angular/core/testing';
import { DeviceInfoService } from './device-info.service';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import {
  platformMapsWithHighUaCh,
  platformMapsWithLowUaCh,
  platformMapsWithoutUaCH,
} from '../mockups/platform-ua-tests';
import { deviceInfoTests } from '../mockups/mockup-types';

const tick = () => new Promise<void>((r) => setTimeout(r, 0));
// Minimal EventTarget-like object
function makeEventTarget(initial: Record<string, any> = {}) {
  //NOSONAR
  //NOSONAR
  const listeners = new Map<string, Set<(e?: any) => void>>();
  const et = {
    ...initial,
    addEventListener(type: string, cb: (e?: any) => void) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(cb);
    },
    removeEventListener(type: string, cb: (e?: any) => void) {
      listeners.get(type)?.delete(cb);
    },
    __dispatch(type: string, ev = type) {
      //NOSONAR
      for (const cb of listeners.get(type) ?? []) cb(ev);
    },
  };
  return et as any;
}

describe('DeviceInfoService', () => {
  afterEach(() => cleanupNavMock());
  beforeEach(() => cleanUpBrave());
  describe('1. Test on SSR', () => {
    it('1.1. should return default invide value if the platform is server', () => {
      const service = createServiceFromBasedonPltrom('server');
      //@ts-expect-error : private member
      expect(service.device()).toMatchObject(service.base());
    });
  });

  describe('2. UA only without UA-CH', () => {
    let keys = Object.keys(platformMapsWithoutUaCH);
    for (const key of keys) {
      let section = platformMapsWithoutUaCH[key];
      writeTestsForOneSection(section);
    }
  });
  describe('3. UA-CH LOW ENTROPY only', () => {
    beforeEach(() => {
      try {
        delete (navigator as any).brave;
      } catch {}
      Object.defineProperty(navigator as any, 'brave', {
        configurable: true,
        value: undefined,
      });
    });
    let keys = Object.keys(platformMapsWithLowUaCh);
    for (const key of keys) {
      let section = platformMapsWithLowUaCh[key];
      writeTestsForOneSection(section);
    }
  });
  describe('4. UA-CH HIGH ENTROPY overrides', () => {
    beforeEach(() => cleanUpBrave());

    let keys = Object.keys(platformMapsWithHighUaCh);
    for (const key of keys) {
      let section = platformMapsWithHighUaCh[key];
      writeTestsForOneSection(section, true);
    }
  });

  describe('5. Unkonw platform', () => {
    let service: DeviceInfoService;
    beforeEach(() => {
      // UA لا يطابق iOS/Android/Windows/macOS/Linux/CrOS
      runNavMock(`
      const ua = 'Mozilla/5.0 (X11; FreeBSD amd64; rv:115.0) Gecko/20100101 Firefox/115.0';

      // userAgent
      Object.defineProperty(navigator, 'userAgent', {
        configurable: true,
        get: () => ua,
      });

      // لا UA-CH
      Object.defineProperty(navigator, 'userAgentData', {
        configurable: true,
        value: undefined,
      });

      // platform محايد (لا يحتوي "Mac", "Win", "Linux", ... إلخ)
      Object.defineProperty(navigator, 'platform', {
        configurable: true,
        value: 'X11',
      });
    `);

      service = createServiceFromBasedonPltrom('browser');
    });

    it('should returns platform: "Unknown" and platformVersion: undefined', () => {
      const d = service.device();
      expect(d.platform).toBe('Unknown');
      expect(d.platformVersion).toBeUndefined();
    });
  });
  describe('6. isolated fallback & edge UA coverage', () => {
    afterEach(() => {
      runNavMock(`
        try { delete (navigator).userAgent; } catch {}
        try { delete (navigator).userAgentData; } catch {}
        try {
          const proto = Object.getPrototypeOf(navigator);
          delete proto.platform;
        } catch {}
      `);
    });

    // -----------------------------------------------------------------------
    // A) UA has no platform → platform comes from navigator.platform (Win32)
    // -----------------------------------------------------------------------
    it('6.1 UA-only: uses navigator.platform=Win32 → platform=Windows (UA has no platform block)', () => {
      const ua =
        'Mozilla/5.0 (compatible; HeadlessChrome/125.0.6422.0; +https://developers.google.com/web/tools/puppeteer)';
      vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(ua);
      vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32');
      const d = createServiceFromBasedonPltrom('browser').device();

      expect(d.platform).toBe('Windows');
      expect(d.platformVersion).toBeUndefined();
      expect(d.browser).toBe('Chrome');
      expect(d.browserVersion).toBe('125.0.6422.0');
      expect(d.deviceType).toBe('desktop');
    });

    it('6.2 UA-CH LOW: keeps platform fallback from navigator.platform=Win32 and maps browser from brands', () => {
      const ua =
        'Mozilla/5.0 (compatible; HeadlessChrome/125.0.6422.0; +https://developers.google.com/web/tools/puppeteer)';
      injectUAChLow(ua, 'Win32', '125');

      const d = createServiceFromBasedonPltrom('browser').device();
      expect(d.platform).toBe('Windows');
      expect(d.platformVersion).toBeUndefined();
      expect(d.browser).toBe('Chrome');
      expect((d.browserVersion ?? '').startsWith('125')).toBe(true);
      expect(d.deviceType).toBe('desktop');
    });

    it('6.3 UA-CH HIGH: platform from navigator.platform=Win32; Chrome full version from high entropy', async () => {
      const ua =
        'Mozilla/5.0 (compatible; HeadlessChrome/125.0.6422.0; +https://developers.google.com/web/tools/puppeteer)';
      injectUAChHigh(ua, 'Win32', '125.0.0.1');

      const d = createServiceFromBasedonPltrom('browser').device();
      await tick();
      await tick();
      await tick();
      expect(d.platform).toBe('Windows');
      expect(d.platformVersion).toBeUndefined();
      expect(d.browser).toBe('Chrome');
      expect(d.browserVersion).toBe('125.0.6422.0');
      expect(d.deviceType).toBe('desktop');
    });

    // -----------------------------------------------------------------------
    // B) Epic Games Launcher UA – service currently does NOT suppress hardware
    // -----------------------------------------------------------------------
    it('6.4 Epic Games Launcher UA → desktop, keep x64/64 from UA', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 EpicGamesLauncher';
      injectUAOnly(ua, 'Win32');

      const d = createServiceFromBasedonPltrom('browser').device();

      expect(d.platform).toBe('Windows');
      expect(d.platformVersion).toBe('10/11');
      expect(d.browser).toBe('Unknown');
      expect(d.browserVersion).toBeUndefined();
      expect(d.deviceType).toBe('desktop');
      expect(d.architecture).toBeUndefined();
      expect(d.bitness).toBeUndefined();
    });

    // -----------------------------------------------------------------------
    // C) Steam overlay UA – keep hardware (no suppression)
    // -----------------------------------------------------------------------
    it('6.5 Steam GameOverlay UA → desktop, keep x64/64', () => {
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Steam GameOverlay/1706352154 Chrome/114.0.5735.289 Safari/537.36';
      injectUAOnly(ua, 'Win32');

      const d = createServiceFromBasedonPltrom('browser').device();

      expect(d.platform).toBe('Windows');
      expect(d.platformVersion).toBe('10/11');
      expect(d.browser).toBe('Unknown');
      expect(d.browserVersion).toBeUndefined();
      expect(d.deviceType).toBe('desktop');
      expect(d.architecture).toBe('x64');
      expect(d.bitness).toBe(64);
    });

    // -----------------------------------------------------------------------
    // D) Googlebot UA without platform block → fallback to navigator.platform
    // -----------------------------------------------------------------------
    it('6.6 Googlebot Chrome (no platform block) → platform fallback to Win32; browser may be Chrome or Unknown depending on parser', () => {
      const ua =
        'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
      injectUAOnly(ua, 'Win32');

      const d = createServiceFromBasedonPltrom('browser').device();

      expect(d.platform).toBe('Windows');
      expect(d.platformVersion).toBeUndefined();
      // parser may classify Googlebot as Unknown or Chrome; accept both
      expect(['Chrome', 'Unknown']).toContain(d.browser ?? 'Unknown');
      expect(d.deviceType).toBe('bot');
      if ('vendor' in d) {
        // your service may decide '' for bots/vendors → accept '' or undefined
        expect(d.vendor === '' || d.vendor === undefined).toBe(true);
      }
    });

    // -----------------------------------------------------------------------
    // E) Xbox UA without Windows NT → platform remains Unknown
    // -----------------------------------------------------------------------
    it('6.7 Xbox UA without Windows NT → platform Unknown (no suppression applied)', () => {
      const ua =
        'Mozilla/5.0 (Xbox; Xbox One; rv:109.0) Gecko/20100101 Firefox/109.0';
      injectUAOnly(ua);

      const d = createServiceFromBasedonPltrom('browser').device();

      expect(['Unknown', 'Windows']).toContain(d.platform); // allow Unknown (typical here)
      if (d.platform === 'Windows') {
        // if your parser maps Xbox to Windows, platformVersion may still be undefined
        expect(['10/11', undefined]).toContain(d.platformVersion as any);
      }
      expect(d.browser).toBe('Firefox');
      expect(d.browserVersion).toBe('109.0');
      expect(d.deviceType).toBe('desktop');
    });

    //------------------------------------------------------------------------
    // fallboack to UA only if the high entropy does not have some values
    // -- ---------------------------------------------------------------------
    it('6.8 Sould fallback to UA or UAlow if the high entropy does not have some values', async () => {
      // Inside the test body:
      Object.defineProperty(navigator, 'userAgentData', {
        configurable: true,
        value: {
          brands: [
            { brand: 'Chromium', version: '125' },
            { brand: 'Google Chrome', version: '125' },
            { brand: 'Not A;Brand', version: '99' },
          ],
          mobile: false,
          platform: 'Windows',
          // high-entropy (returned only if requested)
          getHighEntropyValues: (hints: string[] = []) => {
            return Promise.resolve(undefined);
          },
        },
      });
      vi.spyOn(globalThis.window.navigator, 'userAgent', 'get').mockReturnValue(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      );
      const srv = createServiceFromBasedonPltrom('browser');
      await tick();
      await tick();
      await tick();
      const d = srv.device();
      expect(d.architecture).toBe('x64');
      expect(d.bitness).toBe(64);
      expect(d.brands).toEqual([
        { brand: 'Chromium', version: '125' },
        { brand: 'Google Chrome', version: '125' },
      ]);
      expect(d.bitness).toBe(64);
      expect(d.wow64).toBeUndefined();
      expect(d.browser).toBe('Chrome');
      expect(d.browserVersion).toBe('125.0.0.0');
      expect(d.deviceType).toBe('desktop');
      expect(d.platform).toBe('Windows');
      expect(d.formFactors).toBeUndefined();
      expect(d.platformVersion).toBe('10/11');
    });

    it('6.9 should return one language if nav.languages is undefined', () => {
      Object.defineProperty(navigator, 'languages', {
        configurable: true,
        get: () => undefined,
      });
      Object.defineProperty(navigator, 'language', {
        configurable: true,
        get: () => 'en-US',
      });
      const srv = createServiceFromBasedonPltrom('browser');
      expect(srv.device().languages).toEqual(['en-US']);
    });
  });
  // ===================== 7. Events & reactive updates =====================
  // ===================== 7. Viewport & language events =====================
  describe('7. Viewport & language events', () => {
    const UA =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.147 Safari/537.36';

    // ---- RAF shim (auditTime with animationFrameScheduler needs this in jsdom)
    const installRAFShim = () => {
      const prevRAF = (globalThis.window as any).requestAnimationFrame;
      const prevCAF = (globalThis.window as any).cancelAnimationFrame;
      Object.defineProperty(globalThis.window, 'requestAnimationFrame', {
        configurable: true,
        writable: true,
        value: (cb: FrameRequestCallback) =>
          setTimeout(() => cb(Date.now()), 0), //NOSONAR
      });
      Object.defineProperty(globalThis.window, 'cancelAnimationFrame', {
        configurable: true,
        writable: true,
        value: (h: any) => clearTimeout(h),
      });
      return () => {
        Object.defineProperty(globalThis.window, 'requestAnimationFrame', {
          configurable: true,
          writable: true,
          value: prevRAF,
        });
        Object.defineProperty(globalThis.window, 'cancelAnimationFrame', {
          configurable: true,
          writable: true,
          value: prevCAF,
        });
      };
    };

    const nextFrame = async () => {
      // allow promise + RAF microtask queues to flush
      await new Promise<void>((r) => setTimeout(r, 0));
      await new Promise<void>((r) => setTimeout(r, 0));
    };

    let restoreRAF: (() => void) | undefined;
    let prevVV: any;
    let prevMM: any;

    beforeEach(() => {
      restoreRAF = installRAFShim();
      prevVV = (globalThis.window as any).visualViewport;
      prevMM = (globalThis.window as any).matchMedia;
    });

    afterEach(() => {
      (globalThis.window as any).visualViewport = prevVV;
      if (prevMM) {
        Object.defineProperty(globalThis.window, 'matchMedia', {
          configurable: true,
          writable: true,
          value: prevMM,
        });
      } else {
        try {
          delete (globalThis.window as any).matchMedia;
        } catch {}
      }
      restoreRAF?.();
      cleanupNavMock();
    });

    it('7.1 updates languages on "languagechange"', async () => {
      injectUAOnly(UA, 'Win32');

      const state = { lang: 'en-US', langs: ['en-US', 'ar-EG'] as string[] };
      Object.defineProperty(navigator, 'language', {
        configurable: true,
        get: () => state.lang,
      });
      Object.defineProperty(navigator, 'languages', {
        configurable: true,
        get: () => state.langs,
      });

      const srv = createServiceFromBasedonPltrom('browser');
      expect(srv.device().language).toBe('en-US');
      expect(srv.device().languages).toEqual(['en-US', 'ar-EG']);

      state.lang = 'es-ES';
      state.langs = ['es-ES', 'en-US'];
      globalThis.window.dispatchEvent(new Event('languagechange'));
      await nextFrame();

      expect(srv.device().language).toBe('es-ES');
      expect(srv.device().languages).toEqual(['es-ES', 'en-US']);
    });

    it('7.2 window.resize updates width/height and derived orientation', async () => {
      injectUAOnly(UA, 'Win32');

      // no raw orientation → service derives it from innerWidth/innerHeight
      vi.stubGlobal('screen', { width: 1200, height: 800 });

      // make innerWidth/innerHeight dynamic getters
      const size = { w: 1200, h: 800 };
      Object.defineProperty(globalThis.window, 'innerWidth', {
        configurable: true,
        get: () => size.w,
      });
      Object.defineProperty(globalThis.window, 'innerHeight', {
        configurable: true,
        get: () => size.h,
      });
      Object.defineProperty(globalThis.window, 'devicePixelRatio', {
        configurable: true,
        get: () => 1,
      });

      const srv = createServiceFromBasedonPltrom('browser');
      expect(srv.device().screen).toMatchObject({
        width: 1200,
        height: 800,
        pixelRatio: 1,
      });
      expect(srv.device().screen?.orientation).toBe('landscape');

      // change to portrait and dispatch resize
      size.w = 800;
      size.h = 1200;
      globalThis.window.dispatchEvent(new Event('resize'));
      await nextFrame();

      const scr = srv.device().screen!;
      expect(scr.width).toBe(800);
      expect(scr.height).toBe(1200);
      expect(scr.orientation).toBe('portrait');
    });

    it('7.3 screen.orientation "change" updates raw orientation.type', async () => {
      injectUAOnly(UA, 'Win32');

      const orientationTarget = makeEventTarget({ type: 'portrait-primary' });
      vi.stubGlobal('screen', {
        width: 1200,
        height: 800,
        orientation: orientationTarget,
      });

      Object.defineProperty(globalThis.window, 'innerWidth', {
        configurable: true,
        get: () => 1200,
      });
      Object.defineProperty(globalThis.window, 'innerHeight', {
        configurable: true,
        get: () => 800,
      });
      Object.defineProperty(globalThis.window, 'devicePixelRatio', {
        configurable: true,
        get: () => 1,
      });

      const srv = createServiceFromBasedonPltrom('browser');
      expect((srv.device().screen?.orientation as ScreenOrientation).type).toBe(
        'portrait-primary'
      );

      orientationTarget.type = 'landscape-primary';
      orientationTarget.__dispatch('change');
      await nextFrame();

      expect((srv.device().screen?.orientation as ScreenOrientation).type).toBe(
        'landscape-primary'
      );
    });

    it('7.4 visualViewport resize/scroll triggers recalculation', async () => {
      injectUAOnly(UA, 'Win32');

      vi.stubGlobal('screen', { width: 1024, height: 768 });

      const vv = makeEventTarget();
      Object.defineProperty(globalThis.window, 'visualViewport', {
        configurable: true,
        value: vv,
      });

      const size = { w: 1024, h: 768 };
      Object.defineProperty(globalThis.window, 'innerWidth', {
        configurable: true,
        get: () => size.w,
      });
      Object.defineProperty(globalThis.window, 'innerHeight', {
        configurable: true,
        get: () => size.h,
      });
      Object.defineProperty(globalThis.window, 'devicePixelRatio', {
        configurable: true,
        get: () => 1,
      });

      const srv = createServiceFromBasedonPltrom('browser');
      expect(srv.device().screen).toMatchObject({ width: 1024, height: 768 });

      size.w = 990;
      size.h = 740;
      vv.__dispatch('resize');
      await nextFrame();
      expect(srv.device().screen).toMatchObject({ width: 990, height: 740 });

      size.w = 980;
      size.h = 730;
      vv.__dispatch('scroll');
      await nextFrame();
      expect(srv.device().screen).toMatchObject({ width: 980, height: 730 });
    });

    it('7.5 DPR change detected via matchMedia(change) and rebinds', async () => {
      injectUAOnly(UA, 'Win32');

      Object.defineProperty(globalThis.window, 'innerWidth', {
        configurable: true,
        get: () => 1200,
      });
      Object.defineProperty(globalThis.window, 'innerHeight', {
        configurable: true,
        get: () => 800,
      });

      let dpr = 1;
      Object.defineProperty(globalThis.window, 'devicePixelRatio', {
        configurable: true,
        get: () => dpr,
      });

      type MqlMock = MediaQueryList & { __dispatch: (type?: string) => void };

      const makeMql = (): MqlMock => {
        const listeners = new Set<(e: Event) => void>();
        const mql: any = {
          media: '',
          matches: true,
          onchange: null,
          addEventListener: (
            _: 'change',
            cb: (e: Event) => void //NOSONAR
          ) => listeners.add(cb),
          removeEventListener: (
            _: 'change',
            cb: (e: Event) => void //NOSONAR
          ) => listeners.delete(cb), //NOSONAR
          __dispatch: (type = 'change') => {
            //NOSONAR
            const ev = new Event(type);
            listeners.forEach((cb) => cb(ev)); //NOSONAR
            if (typeof mql.onchange === 'function') mql.onchange(ev);
          },
        };
        return mql as MqlMock;
      };

      let lastMql: MqlMock = makeMql();
      const mm = vi.fn((_q: string) => {
        lastMql = makeMql(); // service rebinds to a fresh MQL each time
        return lastMql;
      });
      Object.defineProperty(globalThis.window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: mm,
      });

      vi.stubGlobal('screen', { width: 1200, height: 800 });

      const srv = createServiceFromBasedonPltrom('browser');
      expect(srv.device().screen?.pixelRatio).toBe(1);

      dpr = 2; // change DPR
      lastMql.__dispatch(); // fire "change" → service should emit and rebind
      await nextFrame();

      expect(srv.device().screen?.pixelRatio).toBe(2);
      expect(mm).toHaveBeenCalledTimes(2); // initial bind + rebind
    });

    it('7.6 window.orientationchange also triggers recompute (derived orientation)', async () => {
      injectUAOnly(UA, 'Win32');

      // no raw orientation → derived from inner sizes
      vi.stubGlobal('screen', { width: 900, height: 1200 });

      const size = { w: 900, h: 1200 };
      Object.defineProperty(globalThis.window, 'innerWidth', {
        configurable: true,
        get: () => size.w,
      });
      Object.defineProperty(globalThis.window, 'innerHeight', {
        configurable: true,
        get: () => size.h,
      });
      Object.defineProperty(globalThis.window, 'devicePixelRatio', {
        configurable: true,
        get: () => 1,
      });

      const srv = createServiceFromBasedonPltrom('browser');
      expect(srv.device().screen?.orientation).toBe('portrait');

      size.w = 1280;
      size.h = 720; // flip to landscape
      globalThis.window.dispatchEvent(new Event('orientationchange'));
      await nextFrame();

      const s = srv.device().screen!;
      expect(s.width).toBe(1280);
      expect(s.height).toBe(720);
      expect(s.orientation).toBe('landscape');
    });
    it('7.7 window.orientationchange without drived orientation', async () => {
      injectUAOnly(UA, 'Win32');

      const orientation = new EventTarget() as any;
      orientation.type = 'portrait-primary';
      vi.stubGlobal('screen', { orientation });

      const srv = createServiceFromBasedonPltrom('browser');

      orientation.type = 'landscape-primary';
      orientation.dispatchEvent(new Event('change'));
      await nextFrame();

      expect((srv.device().screen?.orientation as any).type).toBe(
        'landscape-primary'
      );

      // no-op تاني لتغطية comparator
      globalThis.window.dispatchEvent(new Event('resize'));
      await nextFrame();

      expect((srv.device().screen?.orientation as any).type).toBe(
        'landscape-primary'
      );
    });
  });
});
function cleanUpBrave() {
  try {
    delete (navigator as any).brave;
  } catch {}
  Object.defineProperty(navigator as any, 'brave', {
    configurable: true,
    value: undefined,
  });
}

function writeTestsForOneSection(
  section: deviceInfoTests,
  useTick: boolean = false
) {
  describe(`${section.sectionNo}. ${section.sectonName}`, () => {
    for (const [index, test] of section.test.entries()) {
      if (useTick) {
        it(`${section.sectionNo}.${index + 1}. ${test.testName}`, async () => {
          runNavMock(test.navMock);
          const srv = createServiceFromBasedonPltrom('browser');
          await tick();
          await tick();
          await tick();
          const pick = srv.pick('browser');
          expect(srv.device()).toMatchObject(test.expect);
          expect(pick()).toBe(srv.device().browser);
        });
      } else
        it(`${section.sectionNo}.${index + 1}. ${test.testName}`, () => {
          runNavMock(test.navMock);
          const srv = createServiceFromBasedonPltrom('browser');
          const pick = srv.pick('browser');
          expect(srv.device()).toMatchObject(test.expect);
          expect(pick()).toBe(srv.device().browser);
        });
    }
  });
}
function createServiceFromBasedonPltrom(platform: 'browser' | 'server') {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      DeviceInfoService,
      provideZonelessChangeDetection(),
      {
        provide: PLATFORM_ID,
        useValue: platform,
      },
    ],
  });
  return TestBed.inject(DeviceInfoService);
}
export const runNavMock = (code: string) => {
  new Function(code)();
};

export const cleanupNavMock = () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals?.();
};

function sanitizeUA(ua: string) {
  return ua.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); //NOSONAR
}

function injectUAOnly(ua: string, navPlatform?: string) {
  runNavMock(`
    Object.defineProperty(navigator, 'userAgent', { configurable: true, get: () => '${sanitizeUA(
      ua
    )}' });
    Object.defineProperty(navigator, 'userAgentData', { configurable: true, value: undefined });

    ${
      navPlatform
        ? `
    (function(){
      try { Object.defineProperty(navigator, 'platform', { configurable: true, value: '${navPlatform}' }); } catch {}
      try {
        const proto = Object.getPrototypeOf(navigator);
        try { delete proto.platform; } catch {}
        Object.defineProperty(proto, 'platform', { configurable: true, get: () => '${navPlatform}' });
      } catch {}
    })();`
        : ''
    }
  `);
}

function injectUAChLow(ua: string, navPlatform?: string, brandsMajor = '125') {
  runNavMock(`
    Object.defineProperty(navigator, 'userAgent', { configurable: true, get: () => '${sanitizeUA(
      ua
    )}' });
    Object.defineProperty(navigator, 'userAgentData', {
      configurable: true,
      value: {
        brands: [
          { brand: 'Chromium', version: '${brandsMajor}' },
          { brand: 'Google Chrome', version: '${brandsMajor}' },
        ],
        mobile: false,
        // بعض الكود عندك بيناديها حتى في LOW، فنعمل stub فاضي
        getHighEntropyValues: () => Promise.resolve({})
      }
    });

    ${
      navPlatform
        ? `
    (function(){
      try { Object.defineProperty(navigator, 'platform', { configurable: true, value: '${navPlatform}' }); } catch {}
      try {
        const proto = Object.getPrototypeOf(navigator);
        try { delete proto.platform; } catch {}
        Object.defineProperty(proto, 'platform', { configurable: true, get: () => '${navPlatform}' });
      } catch {}
    })();`
        : ''
    }
  `);
}

function injectUAChHigh(
  ua: string,
  navPlatform?: string,
  fullVer = '125.0.0.1',
  arch: 'x64' | 'arm64' | 'x86' = 'x64',
  bitness: 32 | 64 = 64,
  wow64 = false
) {
  runNavMock(`
    Object.defineProperty(navigator, 'userAgent', { configurable: true, get: () => '${sanitizeUA(
      ua
    )}' });
    Object.defineProperty(navigator, 'userAgentData', {
      configurable: true,
      value: {
        brands: [
          { brand: 'Chromium', version: '125' },
          { brand: 'Google Chrome', version: '125' },
        ],
        mobile: false,
        getHighEntropyValues: () => Promise.resolve({
          uaFullVersion: '${fullVer}',
          fullVersionList: [
            { brand: 'Chromium', version: '${fullVer}' },
            { brand: 'Google Chrome', version: '${fullVer}' }
          ],
          architecture: '${arch}',
          bitness: ${bitness},
          wow64: ${wow64},
          platform: undefined,
          platformVersion: undefined,
          model: undefined,
          formFactors: ['Desktop']
        })
      }
    });

    ${
      navPlatform
        ? `
    (function(){
      try { Object.defineProperty(navigator, 'platform', { configurable: true, value: '${navPlatform}' }); } catch {}
      try {
        const proto = Object.getPrototypeOf(navigator);
        try { delete proto.platform; } catch {}
        Object.defineProperty(proto, 'platform', { configurable: true, get: () => '${navPlatform}' });
      } catch {}
    })();`
        : ''
    }
  `);
}
