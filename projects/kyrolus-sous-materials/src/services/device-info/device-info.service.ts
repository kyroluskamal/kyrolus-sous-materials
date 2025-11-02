/// <reference types="user-agent-data-types" />
import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
  computed,
  Injector,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  animationFrameScheduler,
  fromEvent,
  map,
  merge,
  distinctUntilChanged,
  auditTime,
  startWith,
  EMPTY,
  Observable,
} from 'rxjs';

import {
  AgentType,
  ClientInfo,
  DeviceInfo,
  DeviceOperatingSystem,
  DeviceScreenInfo,
  DeviceType,
  UACHDataValues,
} from '../../models/device-info';
import { promiseToSignal } from '../reusable-function';
import { HINTS } from './deice-type-const';
import {
  decideVendor,
  deriveDeviceTypeFromHints,
  detectAgentType,
  getTimeZoneSafe,
  mapBrowserFromBrands,
  mapPlatformVersionToOSVersion,
  normalizeHardwareForContext,
  normalizePlatform,
  parseUA,
  pickFullBrowserVersion,
} from './device-service-helpers';

@Injectable({ providedIn: 'root' })
export class DeviceInfoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  /* v8 ignore next */
  private readonly base = signal<DeviceInfo>(this.collectSnapshot());
  injector = inject(Injector);
  pick<K extends keyof DeviceInfo>(key: K) {
    return computed(() => this.device()[key]);
  }
  readonly device = computed<DeviceInfo>(() => {
    const scr = this.screen();
    const curr = this.base();
    const langs = this.languages();
    const highEntropy = this.highEntropy();
    let final: DeviceInfo = {
      ...curr,
      screen: scr ?? curr.screen,
      language: langs[0] ?? '',
      languages: langs,
    };
    if (highEntropy) {
      final.brands = this.filterNotABrand(
        highEntropy.brands ?? curr.brands ?? []
      );
      final.architecture = highEntropy.architecture ?? curr.architecture;
      final.model = highEntropy.model ?? curr.model;

      final.formFactors = highEntropy.formFactors as string[];
      final.deviceType = deriveDeviceTypeFromHints(
        curr?.deviceType,
        highEntropy?.mobile,
        highEntropy?.formFactors,
        final.agentType
      );

      final.browserVersion = pickFullBrowserVersion(
        highEntropy.fullVersionList,
        final.browser
      );
      final.platform = (highEntropy.platform ??
        curr.platform) as DeviceOperatingSystem;
      final.platformVersion =
        mapPlatformVersionToOSVersion(
          final.platform,
          highEntropy.platformVersion
        ) ?? curr.platformVersion;
      final.platform = (highEntropy.platform ??
        curr.platform) as DeviceOperatingSystem;
      final.bitness = highEntropy.bitness ?? curr.bitness;
      final.wow64 = highEntropy.wow64 ?? curr.wow64;
      if (final.platform !== 'Windows') {
        final.wow64 = undefined;
      }
    }
    return final;
  });

  readonly languages = this.isBrowser
    ? toSignal(
        fromEvent(globalThis.window, 'languagechange').pipe(
          startWith(undefined),
          map(() => {
            /* v8 ignore next */
            const nav = globalThis.window.navigator || navigator;
            const lang = nav.language;
            const langs = Array.isArray(nav.languages) ? nav.languages : [];
            const all = langs.length
              ? [lang, ...langs.filter((l) => l !== lang)]
              : [lang];
            return Array.from(new Set(all));
          }),
          distinctUntilChanged((a, b) => a.join('|') === b.join('|'))
        ),
        {
          initialValue: [
            globalThis.window.navigator.language || navigator.language,
          ],
        }
      )
    : signal<readonly string[]>([]);

  private readonly screen = this.isBrowser
    ? toSignal(
        this.createViewportEvents$().pipe(
          auditTime(0, animationFrameScheduler),
          map(() => this.buildScreenInfo()),
          distinctUntilChanged((a, b) => this.sameScreen(a, b))
        ),
        { initialValue: this.buildScreenInfo() }
      )
    : signal<DeviceScreenInfo | undefined>(undefined);

  readonly highEntropy = this.isBrowser
    ? promiseToSignal<UACHDataValues | undefined>(
        () => {
          const ua = navigator?.userAgentData;
          return ua
            ? ua.getHighEntropyValues(HINTS as unknown as string[])
            : Promise.resolve(undefined);
        },
        {
          initialValue: undefined,
          injector: this.injector,
        }
      )
    : signal<UACHDataValues | undefined>(undefined);

  private collectSnapshot(): DeviceInfo {
    if (!this.isBrowser || !navigator || !globalThis.window || !document)
      return new DeviceInfo();
    /* v8 ignore next */
    const nav = globalThis.window.navigator || globalThis.navigator;
    const client = this.getClientInfo();

    const uaString = nav.userAgent;

    const agentType: AgentType = detectAgentType(uaString);
    const parsed = parseUA(uaString);
    const hw = normalizeHardwareForContext({
      ua: uaString,
      agentType,
      arch: parsed?.arch,
      bitness: parsed?.bitness as any,
      wow64: parsed?.wow64,
    });
    let browser = parsed?.browser;
    browser ??= 'Unknown';
    if (browser == 'Unknown') mapBrowserFromBrands(client.brands);

    let platform = parsed?.platform;
    if (!platform || platform == 'Unknown') {
      /* v8 ignore next */
      if (client.platform) platform = client.platform as DeviceOperatingSystem;
      else
        platform = normalizePlatform(
          /* v8 ignore start */
          (
            (globalThis.window.navigator as any) ||
            (globalThis.navigator as any)
          ).platform
        );
      /* v8 ignore end */
    }

    const deviceType =
      client.mobile === true ? 'mobile' : this.getDeviceType(uaString);
    const timezone = getTimeZoneSafe();
    const screen = this.buildScreenInfo();

    const hardwareConcurrency = nav?.hardwareConcurrency;
    const deviceMemory = (nav as any)?.deviceMemory;
    if ((nav as any)?.brave?.isBrave()) {
      browser = 'Brave';
    }

    const vendor = decideVendor(
      uaString,
      browser,
      agentType,
      (navigator as any)?.vendor || ''
    );

    return {
      userAgent: uaString,
      vendor: vendor,
      platform,
      deviceType,
      platformVersion: parsed?.platformVersion,
      browser,
      browserVersion: parsed?.browserVersion,
      timezone,
      maxTouchPoints: nav?.maxTouchPoints,
      screen,
      hardwareConcurrency,
      deviceMemory,
      agentType,
      architecture: hw.arch,
      bitness: hw.bitness,
      wow64: hw.wow64,
      formFactors: undefined,
      model: undefined,
      brands: client.brands,
    };
  }
  private filterNotABrand(brands?: NavigatorUABrandVersion[]) {
    if (!brands) return undefined;
    return brands.filter((b) => {
      let brand = b.brand.toLowerCase();
      return !brand.includes('not a');
    });
  }

  private createViewportEvents$(): Observable<unknown> {
    if (!this.isBrowser) return EMPTY;

    const sources: Observable<unknown>[] = [
      fromEvent(globalThis.window, 'resize', { passive: true }),
      fromEvent(globalThis.window as any, 'orientationchange', {
        passive: true,
      }),
    ];

    const scr: any = screen as any;
    if (
      scr?.orientation &&
      typeof scr.orientation.addEventListener === 'function'
    ) {
      sources.push(fromEvent(scr.orientation, 'change'));
    }

    const vv = (globalThis.window as any).visualViewport as
      | VisualViewport
      | undefined;
    if (vv) {
      sources.push(
        fromEvent(vv, 'resize', { passive: true }),
        fromEvent(vv, 'scroll', { passive: true })
      );
    }
    sources.push(this.createDprChange$());
    return merge(...sources);
  }
  private createDprChange$(): Observable<number> {
    if (!this.isBrowser || typeof globalThis.window.matchMedia !== 'function')
      return EMPTY;

    return new Observable<number>((sub) => {
      let mql: MediaQueryList | null = null;

      const onChange = () => {
        sub.next(globalThis.window.devicePixelRatio);
        rebind();
      };

      const rebind = () => {
        mql?.removeEventListener?.('change', onChange as any);
        mql = globalThis.window.matchMedia(
          `(resolution: ${globalThis.window.devicePixelRatio}dppx)`
        );
        mql.addEventListener('change', onChange as any);
      };

      rebind();
      return () => mql?.removeEventListener?.('change', onChange as any);
    });
  }
  private getClientInfo(n: Navigator = navigator): ClientInfo {
    const uaData = n.userAgentData;
    return {
      brands: this.filterNotABrand(uaData?.brands),
      platform: uaData?.platform,
      mobile: uaData?.mobile,
      uaString: n?.userAgent,
    };
  }

  private getDeviceType(uaString: string | null): DeviceType {
    const ua = (uaString ?? '').toLowerCase();
    if (!ua) return 'desktop';
    const at = detectAgentType(uaString);
    if (at === 'bot' || at === 'preview' || at === 'headless') return 'bot';
    if (/(iemobile|windows phone|edge\/\d+.*mobile)/i.test(ua)) return 'mobile';
    if (
      /windows nt/.test(ua) &&
      /mobile safari/.test(ua) &&
      !/(iemobile|windows phone|android|iphone|ipad|ipod)/i.test(ua)
    ) {
      return 'desktop';
    }
    if (/\bxbox\b/.test(ua)) return 'desktop';
    if (/steam.+gameoverlay/i.test(ua) || /epicgameslauncher/i.test(ua))
      return 'desktop';
    if (/android/.test(ua) && /\bpixel\s+fold\b/i.test(ua)) return 'mobile';
    if (
      /ipad|tablet/.test(ua) ||
      (/macintosh/.test(ua) && /mobile\/\w+/.test(ua))
    )
      return 'tablet';
    if (/android/.test(ua) && !/mobile/.test(ua)) return 'tablet';

    if (/(mobi|iphone|android)/i.test(ua)) return 'mobile';

    return 'desktop';
  }

  private buildScreenInfo(): DeviceScreenInfo | undefined {
    const win = globalThis.window;
    if (!win) return undefined;

    const scr: Screen | undefined = screen ?? undefined;
    const rawOrientation = scr?.orientation;
    const width = win.innerWidth || scr?.width || 0;
    const height = win.innerHeight || scr?.height || 0;
    let derived;
    if (width > 0 && height > 0) {
      derived = height >= width ? 'portrait' : 'landscape';
    }
    const pixelRatio =
      typeof win.devicePixelRatio === 'number' ? win.devicePixelRatio : 1;
    let devScreenInfo: DeviceScreenInfo = {
      width,
      height,
      pixelRatio,
      orientation: rawOrientation ?? derived,
    };
    return devScreenInfo;
  }
  normOrientationType(o: DeviceScreenInfo): string {
    return (o.orientation as ScreenOrientation)?.type ?? o.orientation ?? '';
  }

  sameScreen(a?: DeviceScreenInfo, b?: DeviceScreenInfo): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (
      a.width === b.width &&
      a.height === b.height &&
      a.pixelRatio === b.pixelRatio &&
      this.normOrientationType(a) === this.normOrientationType(b)
    );
  }
}
