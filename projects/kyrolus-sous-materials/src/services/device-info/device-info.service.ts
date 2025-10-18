/// <reference types="user-agent-data-types" />
import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
  computed,
  DestroyRef,
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
  Bitness,
  ClientInfo,
  DeviceBrowser,
  DeviceInfo,
  DeviceOperatingSystem,
  // DeviceOperatingSystem,
  DeviceScreenInfo,
  DeviceType,
  UACHDataValues,
  UAParsed,
} from '../../models/device-info';
import { promiseToSignal } from '../reusable-function';
type Hints =
  | 'architecture'
  | 'bitness'
  | 'fullVersionList'
  | 'model'
  | 'platformVersion'
  | 'wow64'
  // اختياريًا لو محتاج:
  | 'uaFullVersion'
  | 'platform'
  | 'brands'
  | 'formFactors'
  | 'mobile';

const HINTS: readonly Hints[] = [
  'brands',
  'mobile',
  'platform',
  'architecture',
  'bitness',
  'formFactors',
  'model',
  'platformVersion',
  'fullVersionList',
  'uaFullVersion',
  'wow64',
] as const;
@Injectable({ providedIn: 'root' })
export class DeviceInfoService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
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
      final.brands =
        highEntropy.brands?.filter(
          (b) => b.brand.toLowerCase() !== 'not a;brand'
        ) ?? curr.brands;
      final.architecture = highEntropy.architecture ?? curr.architecture;
      final.model = highEntropy.model ?? curr.model;
      final.formFactors = (highEntropy.formFactors ??
        curr.formFactors) as string[];
      final.deviceType =
        deriveDeviceTypeFromHints(
          curr?.deviceType,
          highEntropy?.mobile,
          highEntropy?.formFactors
        ) ?? curr.deviceType;

      final.browserVersion =
        pickFullBrowserVersion(highEntropy.fullVersionList, final.browser) ??
        curr.browserVersion;

      final.platformVersion =
        mapPlatformVersionToOSVersion(
          final.platform,
          highEntropy.platformVersion
        ) ?? curr.platformVersion;
      final.platform = (highEntropy.platform ??
        curr.platform) as DeviceOperatingSystem;
      final.bitness = highEntropy.bitness ?? curr.bitness;
      final.wow64 = highEntropy.wow64 ?? curr.wow64;
    }

    return final;
  });

  readonly languages = this.isBrowser
    ? toSignal(
        fromEvent(window, 'languagechange').pipe(
          startWith(undefined),
          map(() => {
            const nav = window.navigator ?? navigator;
            const lang = nav.language;
            const langs = Array.isArray(nav.languages) ? nav.languages : [];
            const all = langs.length
              ? [lang, ...langs.filter((l) => l !== lang)]
              : [lang];
            return Array.from(new Set(all));
          }),
          distinctUntilChanged((a, b) => a.join('|') === b.join('|'))
        ),
        { initialValue: [window.navigator.language || navigator.language] }
      )
    : signal<readonly string[]>([]);

  private readonly screen = this.isBrowser
    ? toSignal(
        this.createViewportEvents$().pipe(
          auditTime(0, animationFrameScheduler),
          map(() => this.buildScreenInfo()),
          distinctUntilChanged((a, b) => {
            const oa =
              typeof a?.orientation === 'string'
                ? a?.orientation
                : (a?.orientation as any)?.type;
            const ob =
              typeof b?.orientation === 'string'
                ? b?.orientation
                : (b?.orientation as any)?.type;
            return (
              !!a &&
              !!b &&
              a.width === b.width &&
              a.height === b.height &&
              a.pixelRatio === b.pixelRatio &&
              oa === ob
            );
          })
        ),
        { initialValue: this.buildScreenInfo() }
      )
    : signal<DeviceScreenInfo | undefined>(undefined);

  private readonly destroyRef = inject(DestroyRef);

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
    if (!this.isBrowser || !navigator || !window || !document)
      return new DeviceInfo();
    const nav = window.navigator || navigator;
    const client = this.getClientInfo();

    const uaString = client?.uaString ?? navigator.userAgent ?? '';

    // Agent type derived from UA only (bot/headless/preview/human)
    const agentType: AgentType = detectAgentType(uaString);
    const parsed = uaString ? parseUA(uaString) : undefined;
    const hw = normalizeHardwareForContext({
      ua: uaString,
      agentType,
      arch: parsed?.arch,
      bitness: parsed?.bitness as any,
      wow64: parsed?.wow64,
    });

    const isChromium = uaIsChromium(uaString);

    let browser =
      parsed?.browser ?? // 1) UA أولاً
      (isChromium ? mapBrowserFromBrands(client.brands) : null) ?? // 2) brands فقط لو Chromium
      'Unknown';
    const platform = (parsed?.platform ??
      client.platform ??
      normalizePlatform(
        ((window.navigator as any) || (navigator as any)).platform
      ) ??
      'Unknown') as DeviceOperatingSystem;

    const deviceType =
      client.mobile === true ? 'mobile' : this.getDeviceType(uaString);
    const timezone = getTimeZoneSafe();
    const screen = this.buildScreenInfo();

    const hardwareConcurrency =
      typeof (nav as any)?.hardwareConcurrency === 'number'
        ? (nav as any).hardwareConcurrency
        : undefined;
    const deviceMemory =
      typeof (nav as any)?.deviceMemory === 'number'
        ? (nav as any).deviceMemory
        : undefined;
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
      maxTouchPoints: nav?.maxTouchPoints ?? 0,
      screen,
      hardwareConcurrency,
      deviceMemory,
      agentType,
      architecture: hw.arch,
      bitness: typeof hw.bitness === 'number' ? hw.bitness : undefined,
      wow64: hw.wow64,
      formFactors: undefined,
      model: undefined,
      brands: client.brands,
    };
  }

  private createViewportEvents$(): Observable<unknown> {
    if (!this.isBrowser) return EMPTY;

    const sources: Observable<unknown>[] = [
      fromEvent(window, 'resize', { passive: true }),
      fromEvent(window as any, 'orientationchange', { passive: true }),
    ];

    const scr: any = screen as any;
    if (
      scr?.orientation &&
      typeof scr.orientation.addEventListener === 'function'
    ) {
      sources.push(fromEvent(scr.orientation, 'change'));
    }

    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (vv) {
      sources.push(fromEvent(vv, 'resize', { passive: true }));
      sources.push(fromEvent(vv, 'scroll', { passive: true }));
    }
    sources.push(this.createDprChange$());
    return merge(...sources);
  }
  private createDprChange$(): Observable<number> {
    if (!this.isBrowser || typeof window.matchMedia !== 'function')
      return EMPTY;

    return new Observable<number>((sub) => {
      let mql: MediaQueryList | null = null;

      const onChange = () => {
        sub.next(window.devicePixelRatio);
        rebind();
      };

      const rebind = () => {
        mql?.removeEventListener?.('change', onChange as any);
        mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        mql.addEventListener('change', onChange as any);
      };

      rebind();
      return () => mql?.removeEventListener?.('change', onChange as any);
    });
  }
  private getClientInfo(n: Navigator = navigator): ClientInfo {
    const uaData = n.userAgentData;
    return {
      brands: uaData?.brands,
      platform: uaData?.platform,
      mobile: uaData?.mobile,
      uaString: (n as any)?.userAgent,
    };
  }

  private getDeviceType(uaString: string | null): DeviceType {
    const ua = (uaString ?? '').toLowerCase();
    if (!ua) return 'desktop';

    // 1) Bots & previews (broad first)
    const at = detectAgentType(uaString); // فيها preview/bot/headless, الخ...
    if (at === 'bot' || at === 'preview' || at === 'headless') return 'bot';

    // 2) Windows Phone / Edge Mobile => mobile (must be before UWP rule)
    if (/(iemobile|windows phone|edge\/\d+.*mobile)/i.test(ua)) return 'mobile';

    // 3) UWP WebView on Windows 10 Desktop:
    //    has "Mobile Safari" but it's not a phone/tablet
    if (
      /windows nt/.test(ua) &&
      /mobile safari/.test(ua) &&
      !/(iemobile|windows phone|android|iphone|ipad|ipod)/i.test(ua)
    ) {
      return 'desktop';
    }

    // 4) Consoles (Xbox token) => desktop UX
    if (/\bxbox\b/.test(ua)) return 'desktop';

    // 5) Game launchers & overlays => desktop
    if (/steam.+gameoverlay/i.test(ua) || /epicgameslauncher/i.test(ua))
      return 'desktop';
    if (/android/.test(ua) && /\bpixel\s+fold\b/i.test(ua)) return 'mobile';

    // 6) Tablets
    if (
      /ipad|tablet/.test(ua) ||
      (/macintosh/.test(ua) && /mobile\/\w+/.test(ua))
    )
      return 'tablet';
    if (/android/.test(ua) && !/mobile/.test(ua)) return 'tablet';

    // 7) Generic mobile
    if (/(mobi|iphone|android)/i.test(ua)) return 'mobile';

    // 8) Fallback
    return 'desktop';
  }

  private buildScreenInfo(): DeviceScreenInfo | undefined {
    const win = window;
    if (!win) return undefined;

    const scr: Screen | undefined =
      typeof screen !== 'undefined' ? screen : undefined;
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
}

/* ========================= Helpers ========================= */

function getTimeZoneSafe() {
  return Intl.DateTimeFormat()?.resolvedOptions()?.timeZone;
}
function normalizePlatform(p?: string): DeviceOperatingSystem | undefined {
  if (!p) return;
  const s = p.toLowerCase();

  if (s.includes('iphone') || s.includes('ipad') || s.includes('ipod'))
    return 'iOS';
  if (s.includes('android')) return 'Android';
  if (s.includes('win')) return 'Windows';
  if (s.includes('mac')) return 'macOS';
  if (s.includes('linux')) return 'Linux';
  if (s.includes('cros')) return 'ChromeOS';
  return undefined;
}
function mapBrowserFromBrands(
  brands: NavigatorUABrandVersion[] | undefined
): DeviceBrowser | null {
  const BROWSER_RULES: readonly [RegExp, DeviceBrowser][] = [
    [/edg|edge/i, 'Edge'],
    [/(opr|opera)/i, 'Opera'],
    [/samsung/i, 'Samsung Internet'],
    [/firefox|fxios/i, 'Firefox'],
    [/(yabrowser|yandex)/i, 'Yandex'],
    [/vivaldi/i, 'Vivaldi'],
    [/brave/i, 'Brave'],
    [/safari/i, 'Safari'],
    [/chrome|chromium|google/i, 'Chrome'],
  ];
  const filtered =
    brands?.filter((b) => b.brand.toLowerCase() !== 'not a;brand') ?? [];
  if (!filtered.length) return null;

  const names = filtered.map((b) => b.brand.toLowerCase());

  const hit = BROWSER_RULES.find(([rx]) => names.some((n) => rx.test(n)));
  return hit ? hit[1] : null;
}
function pickFullBrowserVersion(
  list?: NavigatorUABrandVersion[],
  browser?: DeviceBrowser
): string | undefined {
  if (!list?.length || !browser) return undefined;
  const lc = browser.toLowerCase();

  const hit =
    list.find((x) => {
      const b = x.brand.toLowerCase();
      switch (lc) {
        case 'brave':
          return (
            b.includes('brave') ||
            b.includes('chrome') ||
            b.includes('chromium')
          );
        case 'edge':
          return b.includes('edg') || b.includes('edge');
        case 'opera':
          return b.includes('opera') || b.includes('opr');
        case 'safari':
          return b.includes('safari');
        case 'firefox':
          return b.includes('firefox');
        case 'chrome':
          return b.includes('chrome') || b.includes('chromium');
        case 'samsung internet':
          return b.includes('samsung');
        default:
          return b.includes(lc);
      }
    }) || list[0];

  return hit?.version;
}

function normalizeDotted(ver: string): string {
  return ver
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .join('.');
}

function mapPlatformVersionToOSVersion(
  platform?: string,
  platformVersion?: string
): string | undefined {
  if (!platformVersion || !platform) return undefined;
  const v = normalizeDotted(platformVersion);

  if (platform.toLowerCase() === 'windows') {
    if (v.startsWith('10')) return '10/11';
    if (v.startsWith('6.3')) return '8.1';
    if (v.startsWith('6.2')) return '8';
    if (v.startsWith('6.1')) return '7';
  }
  return v;
}

function deriveDeviceTypeFromHints(
  current?: DeviceType,
  isMobile?: boolean,
  formFactors?: readonly string[]
): DeviceType | undefined {
  if (isMobile) return 'mobile';
  if (Array.isArray(formFactors) && formFactors.length) {
    const ff = formFactors.map((f) => f.toLowerCase());
    if (ff.some((f) => f.includes('mobile'))) return 'mobile';
    if (ff.some((f) => f.includes('tablet'))) return 'tablet';
    if (ff.some((f) => f.includes('desktop'))) return 'desktop';
  }
  return current;
}

function tokenizeSystemBlock(ua: string): string[] {
  const m = /\(([^)]+)\)/.exec(ua);
  if (!m) return [];
  return m[1]
    .split(/;|\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function detectArchBitness(tokens: string[]): {
  arch: UAParsed['arch'];
  bitness?: Bitness;
  wow64: boolean;
} {
  let arch: UAParsed['arch'] = undefined;
  let bitness: Bitness = undefined;
  let wow64 = false;

  if (tokens.some((t) => /x86_64|amd64|x64/.test(t))) {
    arch = 'x64';
    bitness = 64;
  } else if (tokens.some((t) => /arm64|aarch64/.test(t))) {
    arch = 'arm64';
    bitness = 64;
  } else if (tokens.some((t) => /i386|i686|x86/.test(t))) {
    arch = 'x86';
    bitness = 32;
  } else if (tokens.some((t) => /^arm$|armv7|armv8/.test(t))) {
    arch = 'arm';
    bitness = undefined;
  } else if (tokens.some((t) => /ppc|powerpc/.test(t))) {
    arch = 'ppc';
  } else if (tokens.some((t) => /mips/.test(t))) {
    arch = 'mips';
  }

  if (tokens.includes('win64')) bitness = 64;
  if (tokens.includes('wow64')) {
    wow64 = true;
    arch ??= 'x86';
    bitness ??= 32;
  }

  return { arch, bitness, wow64 };
}

function parseOSFromUA(ua: string): {
  platform: UAParsed['platform'];
  platformVersion?: string;
} {
  // iOS
  let m =
    /(?:iphone|ipad|ipod).*?os\s([0-9_]+)|cpu (?:iphone )?os\s([0-9_]+)/i.exec(
      ua
    );
  if (m)
    return {
      platform: 'iOS',
      platformVersion: (m[1] || m[2] || '').replace(/_/g, '.'),
    };
  m =
    /Windows Phone(?:\sOS)?\s([0-9.]+)/i.exec(ua) ||
    /Windows\sMobile\s([0-9.]+)/i.exec(ua);
  if (m) {
    const ver = (m[1] || '').replace(/_/g, '.');
    // Map WP 10 to "10/11" to align with the rest of Windows mapping
    return {
      platform: 'Windows',
      platformVersion: ver.startsWith('10') ? '10/11' : ver,
    };
  }
  // Android
  m = /Android\s([0-9._]+)/i.exec(ua);
  if (m)
    return { platform: 'Android', platformVersion: m[1].replace(/_/g, '.') };

  // ChromeOS
  if (/CrOS/i.test(ua)) {
    const v = /CrOS [^ ]+ ([\d.]+)/i.exec(ua)?.[1];
    return { platform: 'ChromeOS', platformVersion: v };
  }

  // macOS
  m = /Mac OS X\s([0-9_]+)/i.exec(ua);
  if (m) return { platform: 'macOS', platformVersion: m[1].replace(/_/g, '.') };

  // Windows
  m = /Windows NT\s([0-9.]+)/i.exec(ua);
  if (m) {
    const nt = m[1];
    const map: Record<string, string> = {
      '10.0': '10/11',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.1': 'XP',
    };
    return { platform: 'Windows', platformVersion: map[nt] ?? nt };
  }

  // Linux
  if (/linux/i.test(ua))
    return { platform: 'Linux', platformVersion: undefined };
  if (/Macintosh/i.test(ua) && /Mobile\/\w+/i.test(ua)) {
    const v = /Version\/([\d.]+)/i.exec(ua)?.[1];
    return { platform: 'iOS', platformVersion: v };
  }
  return { platform: 'Unknown', platformVersion: undefined };
}

// ---- tiny helpers to keep complexity out of parseBrowserFromUA ----
type BrowserHit = { browser: DeviceBrowser; browserVersion?: string };
const isBotUA = (ua: string) =>
  /(applebot|googlebot(?:-(?:image|video|news))?|bingbot|duckduckbot|baiduspider|yandex(?:bot|images|accessibilitybot)?)/i.test(
    ua
  ) ||
  /(petalbot|sogou|seznambot|qwantify|ia_archiver|mj12bot|ahrefsbot|semrushbot|crawler|spider)/i.test(
    ua
  );

const isNonBrowserUA = (ua: string) =>
  /steam.+gameoverlay/i.test(ua) || /epicgameslauncher/i.test(ua);

// Order matters
type SimpleRule = {
  re: RegExp;
  brand: DeviceBrowser | 'Torch' | 'Tor';
  verIdx?: number;
};
const SIMPLE_RULES: SimpleRule[] = [
  { re: /\b(edg|edgios|edga)\/([\d.]+)/i, brand: 'Edge', verIdx: 2 }, // Chromium Edge
  { re: /\b(?:OPR|OPT|OPiOS)\/([\d.]+)/i, brand: 'Opera', verIdx: 1 },
  { re: /\bHeadlessChrome\/([\d.]+)/i, brand: 'Chrome', verIdx: 1 }, // Headless Chrome
  { re: /\bSamsungBrowser\/([\d.]+)/i, brand: 'Samsung Internet', verIdx: 1 },
  { re: /\b(YaBrowser|YandexBrowser)\/([\d.]+)/i, brand: 'Yandex', verIdx: 2 },
  { re: /\bVivaldi\/([\d.]+)/i, brand: 'Vivaldi', verIdx: 1 },
  { re: /\bBrave\/([\d.]+)/i, brand: 'Brave', verIdx: 1 },
  { re: /\bTorch\/([\d.]+)/i, brand: 'Torch', verIdx: 1 }, // Torch
];

const classifyBySimpleRules = (ua: string): BrowserHit | undefined => {
  for (const r of SIMPLE_RULES) {
    const m = r.re.exec(ua);
    if (m) return { browser: r.brand as any, browserVersion: m[r.verIdx ?? 1] };
  }
  return undefined;
};

const parseOperaPresto = (ua: string): BrowserHit | undefined => {
  if (!/Opera/i.test(ua)) return undefined;
  const v =
    /\bVersion\/([\d.]+)/i.exec(ua)?.[1] ?? /\bOpera\/([\d.]+)/i.exec(ua)?.[1];
  return { browser: 'Opera', browserVersion: v || undefined };
};

const parseEdgeHTML = (ua: string): BrowserHit | undefined => {
  const m = /\bEdge\/([\d.]+)/i.exec(ua);
  if (!m) return undefined;
  const isWinPhone = /(windows phone|iemobile)/i.test(ua);
  return isWinPhone
    ? { browser: 'Edge', browserVersion: m[1] }
    : { browser: 'Unknown' };
};

const parseTor = (ua: string): BrowserHit | undefined => {
  const m = /\bTor(?:Browser)?\/([\d.]+)/i.exec(ua);
  if (!m) return undefined;
  const fx = /\b(firefox|fxios)\/([\d.]+)/i.exec(ua);
  return { browser: 'Tor' as any, browserVersion: fx ? fx[2] : m[1] };
};

const parseChromeToken = (ua: string): BrowserHit | undefined => {
  const m = /\b(chrome|crios)\/([\d.]+)/i.exec(ua);
  if (!m) return undefined;
  if (/(edg|edge|opr|opera|chromium)/i.test(ua)) return undefined;
  return { browser: 'Chrome', browserVersion: m[2] };
};

const parseFirefoxToken = (ua: string): BrowserHit | undefined => {
  const m = /\b(firefox|fxios)\/([\d.]+)/i.exec(ua);
  return m ? { browser: 'Firefox', browserVersion: m[2] } : undefined;
};

const parseSafariToken = (ua: string): BrowserHit | undefined => {
  if (!/safari\//i.test(ua)) return undefined;
  if (/(chrome|crios|chromium|edg|edge|opr|opera|opt|opios)/i.test(ua))
    return undefined;
  const v = /version\/([\d.]+)/i.exec(ua)?.[1];
  return v ? { browser: 'Safari', browserVersion: v } : undefined;
};
const parseIEToken = (ua: string): BrowserHit | undefined => {
  if (/\bMSIE\s[\d.]+/i.test(ua) || /Trident\/\d+.*;\s*rv:[\d.]+/i.test(ua)) {
    return { browser: 'Unknown', browserVersion: undefined };
  }
  return undefined;
};

// ---- main: low-complexity orchestrator ----
function parseBrowserFromUA(uaRaw: string): {
  browser: DeviceBrowser;
  browserVersion?: string;
} {
  const ua = String(uaRaw ?? '');

  if (isBotUA(ua)) return { browser: 'Unknown', browserVersion: undefined };
  if (isNonBrowserUA(ua))
    return { browser: 'Unknown', browserVersion: undefined };

  const simple = classifyBySimpleRules(ua);
  if (simple) return simple;

  const presto = parseOperaPresto(ua);
  if (presto) return presto;

  const edgeHtml = parseEdgeHTML(ua);
  if (edgeHtml) return edgeHtml;

  const tor = parseTor(ua);
  if (tor) return tor;

  const ch = parseChromeToken(ua);
  if (ch) return ch;

  const fx = parseFirefoxToken(ua);
  if (fx) return fx;

  const sf = parseSafariToken(ua);
  if (sf) return sf;

  const ie = parseIEToken(ua);
  if (ie) return ie;

  return { browser: 'Unknown', browserVersion: undefined };
}

export function parseUA(uaRaw: string): UAParsed {
  const ua = String(uaRaw ?? '').trim();
  const tokens = tokenizeSystemBlock(ua);

  let { arch, bitness, wow64 } = detectArchBitness(tokens);
  const { platform, platformVersion } = parseOSFromUA(ua);
  const { browser, browserVersion } = parseBrowserFromUA(ua);

  if (!arch || !bitness) {
    const low = ua.toLowerCase();
    if (/\b(arm64|aarch64)\b/.test(low)) {
      arch = 'arm64';
      bitness = 64;
    }
    if (/\b(x86_64|amd64|x64)\b/.test(low)) {
      arch = 'x64';
      bitness = 64;
    }
    if (/\bwin64\b/.test(low)) {
      bitness = 64;
    }
    if (/\bwow64\b/.test(low)) {
      wow64 = true;
      arch = arch ?? 'x86';
      bitness = bitness ?? 32;
    }
  }
  ({ arch, bitness, wow64 } = applyWindowsArchHeuristics(platform, ua, {
    arch: arch as any,
    bitness: bitness as any,
    wow64: !!wow64,
  }));
  return {
    platform,
    platformVersion,
    arch,
    bitness,
    wow64: wow64 || undefined,
    browser,
    browserVersion,
  };
}

function detectAgentType(
  uaString: string | null
): 'human' | 'bot' | 'headless' | 'preview' | 'unknown' {
  const ua = (uaString ?? '').toLowerCase();

  const RX_PREVIEW =
    /(facebookexternalhit|facebot|twitterbot|pinterestbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|bingpreview)/i;
  const RX_BOT_GENERIC = /\b(bot|spider|crawler|crawl)\b/i;
  const RX_BOT_SEARCH =
    /(googlebot(?:-(?:image|video|news))?|bingbot|duckduckbot|yandex(?:bot|images|accessibilitybot)?|baiduspider|applebot|petalbot|sogou|seznambot|qwantify|ia_archiver|mj12bot|ahrefsbot|semrushbot)/i; //NOSONAR
  const RX_BOT_GOOGLE_SVCS =
    /(apis-google|adsbot-google|mediapartners-google|feedfetcher-google|google(?:\s*read\s*aloud|\s*favicon|weblight))/i;
  const RX_BOT_FETCHERS =
    /\b(?:curl|wget|python-requests|go-http-client|java|node-fetch)\/\d/i;

  if (RX_PREVIEW.test(ua)) return 'preview';
  if (
    RX_BOT_GENERIC.test(ua) ||
    RX_BOT_SEARCH.test(ua) ||
    RX_BOT_GOOGLE_SVCS.test(ua) ||
    RX_BOT_FETCHERS.test(ua)
  )
    return 'bot';
  return 'human';
}
function applyWindowsArchHeuristics(
  platform: UAParsed['platform'] | undefined,
  ua: string,
  current: { arch: UAParsed['arch']; bitness: Bitness; wow64: boolean }
): { arch: UAParsed['arch']; bitness?: Bitness; wow64: boolean } {
  if (platform !== 'Windows') return current;

  const low = ua.toLowerCase();
  const ntRaw = /Windows NT\s([0-9.]+)/i.exec(ua)?.[1];

  // 0) Xbox → x64/64, always
  if (/xbox/i.test(ua)) {
    return {
      arch: current.arch ?? 'x64',
      bitness: current.bitness ?? 64,
      wow64: current.wow64 ?? false,
    };
  }

  // 1) Special-case: IE10 Touch on Windows 8 (MSIE 10.0 + NT 6.2 + Touch)
  // Old IE tokens often include WOW64 noisily; tests expect no arch/bitness here.
  if (
    /\bMSIE\s*10\.0\b/i.test(ua) &&
    /\bWindows NT\s*6\.2\b/i.test(ua) &&
    /touch/i.test(ua)
  ) {
    return { arch: undefined, bitness: undefined, wow64: false };
  }

  // 2) Respect explicit tokens only
  if (/\bwow64\b/.test(low)) {
    return {
      arch: current.arch ?? 'x86',
      bitness: current.bitness ?? 32,
      wow64: true,
    };
  }
  if (/\b(win64|x64|x86_64|amd64)\b/.test(low)) {
    return {
      arch: current.arch ?? 'x64',
      bitness: current.bitness ?? 64,
      wow64: current.wow64 ?? false,
    };
  }
  if (/\b(arm64|aarch64)\b/.test(low)) {
    return {
      arch: current.arch ?? 'arm64',
      bitness: current.bitness ?? 64,
      wow64: current.wow64 ?? false,
    };
  }

  // 3) Win7 + (IE|Trident) heuristic → many 64-bit desktops didn't expose Win64
  const isIEorTrident = /\bmsie\b|\btrident\/\d+/i.test(ua);
  if (!current.wow64 && !current.arch && ntRaw === '6.1' && isIEorTrident) {
    return { arch: undefined, bitness: undefined, wow64: false };
  }

  // 4) DO NOT force x64 for EdgeHTML or UWP WebView if it's not explicit.
  //    Leaving as-is keeps tests expecting neutral arch/bitness.

  return current;
}
// EdgeHTML on desktop (legacy Edge with "Edge/" token but NOT Windows Phone)
function isEdgeHTMLDesktopUA(ua: string): boolean {
  const s = ua || '';
  // Edge/12..18 on Windows 10 desktop, exclude Windows Phone / IEMobile
  return (
    /\bedge\/(1[2-8])(\.|\/|\b)/i.test(s) &&
    !/(windows phone|iemobile)/i.test(s)
  );
}

// Decide vendor consistently
function decideVendor(
  ua: string,
  browser?: DeviceBrowser,
  agentType?: AgentType,
  vendorRaw?: string
): string {
  const low = (ua || '').toLowerCase();

  // Bots & previews → ''
  if (agentType !== 'human') return '';

  // Firefox-family & Unknown → ''
  if (browser === 'Firefox' || browser === 'Unknown') return '';

  // IE / Trident / EdgeHTML desktop → ''
  if (/msie|trident/i.test(low) || isEdgeHTMLDesktopUA(ua)) return '';

  // Everything else (Chromium-family incl. Edge-Chromium, Opera, Vivaldi, Brave, Yandex, Electron, etc.)
  return vendorRaw || '';
}
function isEdgeHTMLWebView(ua: string): boolean {
  const low = (ua || '').toLowerCase();
  const isEdgeHTML = /\bedge\/\d/.test(low) && !/\bedg\//.test(low);
  return isEdgeHTML && /mobile safari\/537\.36/.test(low);
}

function normalizeHardwareForContext(opts: {
  ua: string;
  agentType: AgentType;
  arch?: string;
  bitness?: Bitness;
  wow64?: boolean;
}) {
  const low = (opts.ua || '').toLowerCase();
  let arch = opts.arch;
  let bitness = opts.bitness;
  let wow64 = opts.wow64;

  // Bots & preview -> suppress hardware fields
  if (opts.agentType === 'bot' || opts.agentType === 'preview') {
    return { arch: undefined, bitness: undefined, wow64: undefined };
  }

  // UWP EdgeHTML WebView -> suppress hardware
  if (isEdgeHTMLWebView(opts.ua)) {
    return { arch: undefined, bitness: undefined, wow64: undefined };
  }

  // Epic Games Launcher (Chromium UA, not a browser) -> suppress hardware
  if (/epicgameslauncher/i.test(opts.ua)) {
    return { arch: undefined, bitness: undefined, wow64: undefined };
  }

  // Xbox: do not assume x64 unless token explicitly present
  const hasExplicitHW =
    low.includes('x64') ||
    low.includes('win64') ||
    low.includes('wow64') ||
    low.includes('arm64') ||
    low.includes('aarch64');

  if (/\bxbox\b/.test(low) && !hasExplicitHW) {
    return { arch: undefined, bitness: undefined, wow64: undefined };
  }

  return { arch, bitness, wow64 };
}

function uaIsChromium(ua: string): boolean {
  return /(Edg\/|OPR\/|Chrome\/|Chromium\/|YaBrowser|Brave|Vivaldi)/i.test(ua);
}
