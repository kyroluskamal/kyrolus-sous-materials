import {
  DeviceBrowser,
  DeviceInfo,
  Bitness,
} from 'projects/kyrolus-sous-materials/src/public-api';
import {
  PRESET_Android,
  PRESET_ChromeOS_DESKTOP,
  PRESET_ChromeOS_TABLET,
  PRESET_iOS,
  PRESET_Linux,
  PRESET_macOS,
  PRESET_WINDOWS,
  DEFAULT_LANG,
  DEFAULT_LANGS,
  DEFAULT_TZ,
  PLATFORM_DEFAULTS,
  DEFAULT_PLATFORM_VERSION,
  DEFAULT_BROWSER_VERSION,
} from './mockup-constants';
import { ExpectedArgs, Preset, UAChArgs, UAMockInput } from './mockup-types';

export function brandsFor(
  browser: string
): { brand: string; version: string }[] {
  const B = (brand: string, v = '125.0.0.0') => ({ brand, version: v });
  switch (browser.toLowerCase()) {
    case 'edge':
      return [B('Microsoft Edge'), B('Chromium')];
    case 'opera':
      return [B('Opera'), B('Chromium')];
    case 'brave':
      return [B('Brave'), B('Chromium')];
    case 'vivaldi':
      return [B('Vivaldi'), B('Chromium')];
    case 'yandex':
      return [B('YaBrowser'), B('Chromium')];
    case 'chrome':
      return [B('Google Chrome'), B('Chromium')];
    case 'firefox':
      return [B('Firefox')];
    case 'safari':
      return [B('Safari'), B('Chromium')];
    case 'samsung internet':
      return [B('Samsung Internet'), B('Chromium')];
    default:
      return [B('Google Chrome'), B('Chromium')];
  }
}

/** UA فيه علامة Chromium؟ (يستبعد Opera/Presto و Firefox و IE/Safari) */
export const isChromiumUA = (ua: string) =>
  /(Edg\/|OPR\/|Chrome\/|Chromium\/|YaBrowser|Brave|Vivaldi)/i.test(ua);
export function resolveVendor(
  browser: DeviceBrowser,
  override?: string
): string {
  if (override !== undefined) return override;
  if (browser === 'Firefox' || browser === 'Unknown') return '';
  return 'Google Inc.';
}
export function augmentNavigatorCommon(p: UAChArgs) {
  const plat = JSON.stringify(p.navPlatform ?? 'Win32');
  const braveBlock = p.brave
    ? `Object.defineProperty(navigator, 'brave', { value: { isBrave: () => true }, configurable: true });`
    : '';
  return `
        Object.defineProperty(navigator, 'platform', { value: ${plat}, configurable: true });
        ${braveBlock}
        `.trim();
}
export const mkUAMockFull = (p: UAMockInput, preset: Preset = 'windows') => {
  let base: any;
  if (preset == 'android') base = PRESET_Android;
  else if (preset == 'chromeOSDesktop') base = PRESET_ChromeOS_DESKTOP;
  else if (preset == 'chromeOSTablet') base = PRESET_ChromeOS_TABLET;
  else if (preset == 'ios') base = PRESET_iOS;
  else if (preset == 'linux') base = PRESET_Linux;
  else if (preset == 'macos') base = PRESET_macOS;
  else base = PRESET_WINDOWS;
  const ua = JSON.stringify(p.ua);
  const v = JSON.stringify(p.vendor ?? 'Google Inc.');
  const lang = JSON.stringify(p.lang ?? DEFAULT_LANG);
  const langs = JSON.stringify(p.langs ?? DEFAULT_LANGS);
  const tz = JSON.stringify(p.timeZone ?? DEFAULT_TZ);

  const num = (val: number | undefined, fallback: number) =>
    Number.isFinite(val ?? Number.NaN) ? (val as number) : fallback;

  const mtp = num(p.maxTouchPoints, base.maxTouchPoints);
  const hc = num(p.hardwareConcurrency, base.hardwareConcurrency);
  const dm = num(p.deviceMemory, base.deviceMemory);
  const w = num(p.innerWidth, base.innerWidth);
  const h = num(p.innerHeight, base.innerHeight);
  const dpr = num(p.dpr, base.dpr);
  const plugins = num(p.pluginsCount, base.pluginsCount);

  return `
vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(${ua});
Object.defineProperty(navigator, 'userAgentData', { value: undefined, configurable: true });

// Locale & vendor
vi.spyOn(navigator, 'language', 'get').mockReturnValue(${lang});
Object.defineProperty(navigator, 'languages', { value: ${langs}, configurable: true });
vi.spyOn(navigator, 'vendor', 'get').mockReturnValue(${v});

// Inputs that service reads
Object.defineProperty(navigator, 'maxTouchPoints', { value: ${mtp}, configurable: true });
Object.defineProperty(navigator, 'hardwareConcurrency', { value: ${hc}, configurable: true });
Object.defineProperty(navigator, 'deviceMemory', { value: ${dm}, configurable: true });

// Avoid headless false-positives
Object.defineProperty(navigator, 'plugins', { value: { length: ${plugins} }, configurable: true });

// Stable timezone
vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => ({
  resolvedOptions: () => ({ timeZone: ${tz} })
}));

// Screen (viewport-first)
Object.defineProperty(window, 'innerWidth', { value: ${w}, configurable: true });
Object.defineProperty(window, 'innerHeight', { value: ${h}, configurable: true });
Object.defineProperty(window, 'devicePixelRatio', { value: ${dpr}, configurable: true });
`.trim();
};

export function expectedUA(args: ExpectedArgs, preset: Preset): DeviceInfo {
  const plat = args.platform;
  const base = PLATFORM_DEFAULTS[preset] ?? PLATFORM_DEFAULTS['windows'];

  const width = args.width ?? base.width;
  const height = args.height ?? base.height;
  const pixelRatio = args.pixelRatio ?? base.pixelRatio;
  const vendor = resolveVendor(args.browser, args.vendor);
  const orientation: string = width >= height ? 'landscape' : 'portrait';

  return {
    // ---- identity / agent ----
    userAgent: args.ua,
    agentType: args.agentType ?? 'human',
    vendor,
    platform: plat,
    deviceType: args.deviceType,
    platformVersion: args.platformVersion,

    // ---- browser ----
    browser: args.browser,
    browserVersion: args.browserVersion ?? undefined,

    // ---- locale ----
    language: args.language ?? DEFAULT_LANG,
    languages: (args.languages?.length
      ? [...args.languages]
      : [...DEFAULT_LANGS]) as readonly string[],
    timezone: args.timeZone ?? DEFAULT_TZ,

    // ---- input / hardware ----
    maxTouchPoints: args.maxTouchPoints ?? base.maxTouchPoints,
    hardwareConcurrency: args.hardwareConcurrency ?? base.hardwareConcurrency,
    deviceMemory: args.deviceMemory ?? base.deviceMemory,

    // ---- screen ----
    screen: { width, height, pixelRatio, orientation },

    // ---- arch / bitness ----
    architecture: args.architecture ?? undefined,
    bitness: (args.bitness ?? undefined) as Bitness,
    wow64: args.wow64 ?? undefined,

    formFactors: args.formFactors ?? undefined,
    model: args.model ?? undefined,
    brands: args.brands ?? undefined,
  } as DeviceInfo;
}
export function mkNavMockWithUAChLow(p: UAChArgs, preset: Preset = 'windows') {
  const base = mkUAMockFull(p, preset);
  const low = `
${augmentNavigatorCommon(p)}
Object.defineProperty(navigator, 'userAgentData', {
  configurable: true,
  value: {
    brands: ${JSON.stringify(p.brands)},
    platform: ${JSON.stringify(p.uaChPlatform ?? 'Windows')},
    mobile: ${p.mobile ? 'true' : 'false'},
    getHighEntropyValues: () => Promise.resolve(undefined)
  }
});
`.trim();
  return `${base}\n${low}`;
}

export function mkNavMockWithUAChHigh(p: UAChArgs, preset: Preset = 'windows') {
  const base = mkUAMockFull(p, preset);
  const fullVersion = p.high?.fullVersion ?? '125.0.0.0';
  const high = `
${augmentNavigatorCommon(p)}
Object.defineProperty(navigator, 'userAgentData', {
  configurable: true,
  value: {
    brands: ${JSON.stringify(p.brands)},
    platform: ${JSON.stringify(p.uaChPlatform ?? 'Windows')},
    mobile: ${p.mobile ? 'true' : 'false'},
    getHighEntropyValues: () => Promise.resolve({
      brands: ${JSON.stringify(p.brands)},
      platform: ${JSON.stringify(p.uaChPlatform ?? 'Windows')},
      mobile: ${p.mobile ? 'true' : 'false'},
      architecture: ${JSON.stringify(p.high?.architecture ?? 'x64')},
      bitness: ${JSON.stringify(p.high?.bitness ?? 64)},
      wow64: ${JSON.stringify(p.high?.wow64 ?? false)},
      platformVersion: ${JSON.stringify(p.high?.platformVersion ?? '10.0.0')},
      uaFullVersion: ${JSON.stringify(fullVersion)},
      fullVersionList: [
        ${JSON.stringify({ brand: 'Chromium', version: fullVersion })},
        ${JSON.stringify({
          brand: p.brands[0]?.brand ?? 'Google Chrome',
          version: fullVersion,
        })}
      ],
      formFactors: ${JSON.stringify(p.high?.formFactors ?? ['Desktop'])},
      model: ${JSON.stringify(p.high?.model ?? undefined)}
    })
  }
});
`.trim();
  return `${base}\n${high}`;
}
export function bumpVersion(
  version?: string,
  fallback = DEFAULT_BROWSER_VERSION
): string {
  const source = version?.trim().length ? version : fallback;
  const parts = source
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return fallback;
  const lastIndex = parts.length - 1;
  const lastSegment = parts[lastIndex];
  const numeric = Number(lastSegment);
  parts[lastIndex] = Number.isFinite(numeric)
    ? String(numeric + 1)
    : `${lastSegment || ''}1`;
  return parts.join('.');
}

export function makeHighPlatformVersion(
  version?: string,
  fallback = DEFAULT_PLATFORM_VERSION
): string {
  const source = version?.trim().length ? version : fallback;
  const parts = source
    .split('.')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) parts.push('0');
  while (parts.length < 3) {
    parts.push('0');
  }
  const lastIndex = parts.length - 1;
  const lastSegment = parts[lastIndex];
  const numeric = Number(lastSegment);
  parts[lastIndex] = Number.isFinite(numeric)
    ? String(numeric + 1)
    : `${lastSegment || ''}1`;
  return parts.join('.');
}

export const formFactorsFor = (deviceType?: string): string[] | undefined => {
  switch (deviceType) {
    case 'mobile':
      return ['Mobile'];
    case 'tablet':
      return ['Tablet'];
    case 'desktop':
      return ['Desktop'];
    default:
      return undefined;
  }
};
