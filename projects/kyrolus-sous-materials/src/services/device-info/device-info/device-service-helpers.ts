/* ========================= Helpers ========================= */

import {
  AgentType,
  Bitness,
  DeviceBrowser,
  DeviceOperatingSystem,
  DeviceType,
  UAParsed,
} from '../../../models/device-info';
import {
  classifyBySimpleRules,
  parseOperaPresto,
  parseEdgeHTML,
  parseTor,
  parseChromeToken,
  parseFirefoxToken,
  parseSafariToken,
  parseIEToken,
} from './deice-type-const';
import { isBotUA, isNonBrowserUA } from './device-service-types';

export function getTimeZoneSafe() {
  return Intl.DateTimeFormat()?.resolvedOptions()?.timeZone;
}
export function normalizePlatform(p?: string): DeviceOperatingSystem {
  /* v8 ignore start */
  if (!p) return 'Unknown';
  const s = p.toLowerCase();
  if (s.includes('iphone') || s.includes('ipad') || s.includes('ipod'))
    return 'iOS';
  if (s.includes('android')) return 'Android';
  if (s.includes('win')) return 'Windows';
  if (s.includes('mac')) return 'macOS';
  if (s.includes('linux')) return 'Linux';
  if (s.includes('cros')) return 'ChromeOS';
  return 'Unknown';
  /* v8 ignore end */
}
export function mapBrowserFromBrands(
  brands: NavigatorUABrandVersion[] | undefined
): DeviceBrowser | undefined {
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
  if (!filtered.length) return undefined;

  const names = filtered.map((b) => b.brand.toLowerCase());

  const hit = BROWSER_RULES.find(([rx]) => names.some((n) => rx.test(n)));
  return hit ? hit[1] : undefined;
}

export function pickFullBrowserVersion(
  list?: NavigatorUABrandVersion[],
  browser?: DeviceBrowser
): string | undefined {
  if (!list?.length || !browser || list?.length == 0 || !list) return undefined;
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

export function normalizeDotted(ver: string): string {
  return ver
    .split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .join('.');
}

export function mapPlatformVersionToOSVersion(
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

export function deriveDeviceTypeFromHints(
  current?: DeviceType,
  isMobile?: boolean,
  formFactors?: readonly string[],
  agentType?: AgentType
): DeviceType | undefined {
  if (
    current !== 'bot' &&
    agentType !== 'bot' &&
    agentType !== 'preview' &&
    agentType !== 'headless' &&
    Array.isArray(formFactors) &&
    formFactors.length
  ) {
    if (isMobile) return 'mobile';
    const ff = formFactors.map((f) => f.toLowerCase());
    if (ff.some((f) => f.includes('mobile'))) return 'mobile';
    if (ff.some((f) => f.includes('tablet'))) return 'tablet';
    if (ff.some((f) => f.includes('desktop'))) return 'desktop';
  }
  return current;
}

export function tokenizeSystemBlock(ua: string): string[] {
  const m = /\(([^)]+)\)/.exec(ua);
  if (!m) return [];
  return m[1]
    .split(/;|\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

export function detectArchBitness(tokens: string[]): {
  arch: UAParsed['arch'];
  bitness?: Bitness;
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

  return { arch, bitness };
}

export function parseOSFromUA(ua: string): {
  platform: UAParsed['platform'];
  platformVersion?: string;
} {

  let m =
    /(?:iphone|ipad|ipod).*?os\s([0-9_]+)|cpu (?:iphone )?os\s([0-9_]+)/i.exec(
      ua
    );
  if (m)
    return {
      platform: 'iOS',
      platformVersion: (m[1] || m[2] || '').replaceAll('_', '.'),
    };
  m =
    /Windows Phone(?:\sOS)?\s([0-9.]+)/i.exec(ua) ||
    /Windows\sMobile\s([0-9.]+)/i.exec(ua);
  if (m) {
    const ver = (m[1] || '').replaceAll('_', '.');

    return {
      platform: 'Windows',
      platformVersion: ver.startsWith('10') ? '10/11' : ver,
    };
  }

  m = /Android\s([0-9._]+)/i.exec(ua);
  if (m)
    return { platform: 'Android', platformVersion: m[1].replaceAll('_', '.') };


  if (/CrOS/i.test(ua)) {
    const v = /CrOS [^ ]+ ([\d.]+)/i.exec(ua)?.[1];
    return { platform: 'ChromeOS', platformVersion: v };
  }
  if (/Macintosh/i.test(ua) && /Mobile\/\w+/i.test(ua)) {
    const v = /Version\/([\d.]+)/i.exec(ua)?.[1];
    return { platform: 'iOS', platformVersion: v };
  }

  m = /Mac OS X\s([0-9._]+)/i.exec(ua);
  if (m)
    return { platform: 'macOS', platformVersion: m[1].replaceAll('_', '.') };


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


  if (/linux/i.test(ua))
    return { platform: 'Linux', platformVersion: undefined };

  return { platform: 'Unknown', platformVersion: undefined };
}


export function parseBrowserFromUA(uaRaw: string): {
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
  const ua = uaRaw.trim().toLowerCase();
  const tokens = tokenizeSystemBlock(ua);

  let { arch, bitness } = detectArchBitness(tokens);
  const { platform, platformVersion } = parseOSFromUA(ua);
  const { browser, browserVersion } = parseBrowserFromUA(ua);
  let wow64 = false;

  if (!arch || !bitness) {
    if (/\b(arm64|aarch64)\b/.test(ua)) {
      arch = 'arm64';
      bitness = 64;
    }
    if (/\b(x86_64|amd64|x64)\b/.test(ua)) {
      arch = 'x64';
      bitness = 64;
    }
    if (/\bwow64\b/.test(ua)) {
      wow64 = true;
      arch = 'x86';
      bitness = 32;
    }
  }
  let heuristics = applyWindowsArchHeuristics(platform, ua, {
    arch: arch as any,
    bitness: bitness as any,
    wow64: !!wow64,
  });
  arch = heuristics.arch;
  bitness = heuristics.bitness;
  wow64 = heuristics.wow64;

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

export function detectAgentType(
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
export function applyWindowsArchHeuristics(
  platform: UAParsed['platform'] | undefined,
  ua: string,
  current: { arch: UAParsed['arch']; bitness: Bitness; wow64: boolean }
): { arch: UAParsed['arch']; bitness?: Bitness; wow64: boolean } {
  if (platform !== 'Windows') return current;

  const low = ua.toLowerCase();
  const ntRaw = /Windows NT\s([0-9.]+)/i.exec(ua)?.[1];


  if (/xbox/i.test(ua)) {
    return {
      arch: current.arch ?? 'x64',
      bitness: current.bitness ?? 64,
      wow64: current.wow64 ?? false,
    };
  }



  if (
    /\bMSIE\s*10\.0\b/i.test(ua) &&
    /\bWindows NT\s*6\.2\b/i.test(ua) &&
    /touch/i.test(ua)
  ) {
    return { arch: undefined, bitness: undefined, wow64: false };
  }


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


  const isIEorTrident = /\bmsie\b|\btrident\/\d+/i.test(ua);
  if (!current.wow64 && !current.arch && ntRaw === '6.1' && isIEorTrident) {
    return { arch: undefined, bitness: undefined, wow64: false };
  }




  return current;
}

export function isEdgeHTMLDesktopUA(ua: string = ''): boolean {

  return (
    /\bedge\/(1[2-8])(\.|\/|\b)/i.test(ua) &&
    !/(windows phone|iemobile)/i.test(ua)
  );
}


export function decideVendor(
  ua: string,
  browser?: DeviceBrowser,
  agentType?: AgentType,
  vendorRaw?: string
): string {
  const low = (ua || '').toLowerCase();


  if (agentType !== 'human') return '';


  if (browser === 'Firefox' || browser === 'Unknown') return '';


  if (/msie|trident/i.test(low) || isEdgeHTMLDesktopUA(ua)) return '';


  return vendorRaw || '';
}
export function isEdgeHTMLWebView(ua: string): boolean {
  const low = (ua || '').toLowerCase();
  const isEdgeHTML = /\bedge\/\d/.test(low) && !/\bedg\//.test(low);
  return isEdgeHTML && /mobile safari\/537\.36/.test(low);
}

export function normalizeHardwareForContext(opts: {
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


  if (opts.agentType === 'bot' || opts.agentType === 'preview') {
    return { arch: undefined, bitness: undefined, wow64: undefined };
  }


  if (isEdgeHTMLWebView(opts.ua)) {
    return { arch: undefined, bitness: undefined, wow64: undefined };
  }


  if (/epicgameslauncher/i.test(opts.ua)) {
    return { arch: undefined, bitness: undefined, wow64: undefined };
  }


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
