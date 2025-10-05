// ===== Windows — UA-only (NO UA-CH). Produces full DeviceInfo from UA + mocked Navigator/Window =====
// Types & service behavior referenced from your codebase.  // (DeviceInfo shape + UA parsing)
import type {
  DeviceInfo,
  DeviceBrowser,
  DeviceOperatingSystem,
  AgentType,
  DeviceType,
} from '../../../../models/device-info';
import {
  // ---- XP/Vista ----
  UA_WIN_XP_IE7_DESKTOP_X86,
  UA_WIN_VISTA_IE7_DESKTOP_X86,
  UA_WIN_VISTA_OPERA_10_PRESTO_X86,
  UA_WIN_VISTA_CHROME_49_DESKTOP_X86,
  UA_WIN_VISTA_FIREFOX_52_ESR_DESKTOP_X86,
  UA_WIN_VISTA_SAFARI_5_1_7_DESKTOP_X86,
  // ---- Windows 7 ----
  UA_WIN7_IE10_DESKTOP_X64,
  UA_WIN7_IE11_DESKTOP_X64,
  UA_WIN7_CHROME_109_DESKTOP_X64,
  UA_WIN7_CHROME_109_WOW64_DESKTOP_X86,
  UA_WIN7_FIREFOX_115_ESR_DESKTOP_X64,
  UA_WIN7_OPERA_36_CHROMIUM49_DESKTOP_WOW64,
  UA_WIN7_YANDEX_17_CHROMIUM57_DESKTOP_WOW64,
  // ---- Windows 8 / 8.1 ----
  UA_WIN8_IE10_DESKTOP_X64,
  UA_WIN8_IE10_TABLET_TOUCH_X64,
  UA_WIN81_IE11_DESKTOP_X64,
  UA_WIN81_CHROME_109_DESKTOP_X64,
  UA_WIN81_CHROME_109_WOW64_DESKTOP_X86,
  UA_WIN81_FIREFOX_115_ESR_DESKTOP_X64,
  UA_WIN81_CHROME_49_WOW64_X86,
  // ---- Windows 10 ----
  UA_WIN10_IE11_DESKTOP_X64,
  UA_WIN10_EDGEHTML_12_DESKTOP_X64,
  UA_WIN10_EDGEHTML_18_DESKTOP_X64,
  UA_WIN10_IE11_TABLET_TOUCH_X64,
  UA_WIN10_EDGEHTML_18_TABLET_TOUCH_X64,
  UA_WIN10_EDGE_125_DESKTOP_X64,
  UA_WIN10_EDGE_124_WOW64_DESKTOP_X86,
  UA_WIN10_EDGE_125_ARM64_DESKTOP,
  UA_WIN10_CHROME_125_DESKTOP_X64,
  UA_WIN10_CHROME_124_WOW64_DESKTOP_X86,
  UA_WIN10_CHROME_125_ARM64_DESKTOP,
  UA_WIN10_FIREFOX_125_DESKTOP_X64,
  UA_WIN10_OPERA_108_DESKTOP_X64,
  UA_WIN10_BRAVE_1_66_DESKTOP_X64,
  UA_WIN10_VIVALDI_6_7_DESKTOP_X64,
  UA_WIN10_YANDEX_24_4_DESKTOP_X64,
  // ---- Windows 11 (NT 10.0) ----
  UA_WIN11_EDGE_125_DESKTOP_X64,
  UA_WIN11_EDGE_125_DESKTOP_ARM64,
  UA_WIN11_CHROME_125_DESKTOP_X64,
  UA_WIN11_CHROME_125_DESKTOP_ARM64,
  UA_WIN11_FIREFOX_125_DESKTOP_X64,
  UA_WIN11_OPERA_108_DESKTOP_X64,
  UA_WIN11_BRAVE_1_66_DESKTOP_X64,
  UA_WIN11_VIVALDI_6_7_DESKTOP_X64,
  UA_WIN11_YANDEX_24_4_DESKTOP_X64,
  // ---- Windows Phone/Mobile ----
  UA_WINPHONE_8_1_IEMOBILE_11_LUMIA_ARM,
  UA_WIN10_MOBILE_EDGE_15_LUMIA_ARM,
  // ---- Consoles / WebView ----
  UA_WIN10_XBOX_EDGE_15_DESKTOP_X64,
  UA_WIN10_UWP_WEBVIEW_EDGEHTML_17_X64,
  // ---- Bots/Preview (Windows-like) ----
  UA_BOT_BINGPREVIEW_WIN10_X64,
  UA_BOT_FACEBOT_WIN10_X64,
  UA_BOT_GOOGLEBOT_WIN10_COMPAT,
  UA_WIN10_OPERA_GX_108_X64,
  UA_WIN10_EPIC_GAMES_LAUNCHER,
  UA_WIN10_STEAM_OVERLAY,
  UA_WIN10_SEAMONKEY_2_53_X64,
  UA_WIN10_PALEMOON_31_X64,
  UA_WIN10_WATERFOX_G5_X64,
  UA_WIN10_TOR_BROWSER_12_5_X64,
  UA_WIN10_360SE_13_WOW64,
  UA_WIN10_BAIDU_7_6_X64,
  UA_WIN10_CHROME_87_WOW64_X86,
  UA_WIN10_COCCOC_115_X64,
  UA_WIN10_DISCORD_ELECTRON_28,
  UA_WIN10_EDGE_90_WOW64_X86,
  UA_WIN10_EDGE_WEBVIEW2_118_X64,
  UA_WIN10_HEADLESS_CHROME_125_X64,
  UA_WIN10_HEADLESS_EDGE_125_X64,
  UA_WIN10_MAXTHON_5_X64,
  UA_WIN10_QQ_BROWSER_11_X64,
  UA_WIN10_SLACK_ELECTRON_27,
  UA_WIN10_SOGOU_2_X64,
  UA_WIN10_TEAMS_ELECTRON_26,
  UA_WIN10_UC_BROWSER_7_X64,
  UA_WIN10_VSCODE_ELECTRON_28,
  UA_WIN10_XBOX_EDGEHTML_44,
  UA_WIN11_CHROME_125_WIN64_ARM64,
  UA_WIN11_FIREFOX_125_ARM64,
  UA_WIN81_IE11_TABLET_TOUCH_X64,
  UA_WIN_VISTA_IE9_DESKTOP_X86,
  UA_WIN_XP_CHROME_49_DESKTOP_X86,
  UA_WIN_XP_FIREFOX_52_ESR_DESKTOP_X86,
  UA_WIN_XP_OPERA_12_PRESTO_DESKTOP_X86,
  UA_WIN7_TORCH_69_DESKTOP_X64,
  UA_WIN7_TORCH_69_WOW64_DESKTOP_X86,
  UA_WIN81_TORCH_75_DESKTOP_X64,
  UA_WIN10_TORCH_86_DESKTOP_X64,
  UA_WIN10_TORCH_86_WOW64_DESKTOP_X86,
  UA_WIN11_TORCH_120_DESKTOP_X64,
} from './windows-ua-mockups'; // adjust path

// ---------- helpers to build strong UA-only mocks ----------
const DEFAULT_TZ = 'Europe/Madrid';
const DEFAULT_LANG = 'en-US';
const DEFAULT_LANGS = [DEFAULT_LANG, 'ar-EG'];

const mkUAMockFull = (p: {
  ua: string; // ← مرّر *قيمة* الـUA (بدون أقواس)
  vendor?: string;
  lang?: string;
  langs?: string[];
  timeZone?: string;
  maxTouchPoints?: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  innerWidth?: number;
  innerHeight?: number;
  dpr?: number;
  pluginsCount?: number;
}) => {
  const ua = JSON.stringify(p.ua);
  const v = JSON.stringify(p.vendor ?? 'Google Inc.');
  const lang = JSON.stringify(p.lang ?? DEFAULT_LANG);
  const langs = JSON.stringify(p.langs ?? DEFAULT_LANGS);
  const tz = JSON.stringify(p.timeZone ?? DEFAULT_TZ);
  const mtp = Number.isFinite(p.maxTouchPoints ?? NaN)
    ? (p.maxTouchPoints as number)
    : 0;
  const hc = Number.isFinite(p.hardwareConcurrency ?? NaN)
    ? (p.hardwareConcurrency as number)
    : 8;
  const dm = Number.isFinite(p.deviceMemory ?? NaN)
    ? (p.deviceMemory as number)
    : 8;
  const w = Number.isFinite(p.innerWidth ?? NaN)
    ? (p.innerWidth as number)
    : 1200;
  const h = Number.isFinite(p.innerHeight ?? NaN)
    ? (p.innerHeight as number)
    : 800;
  const dpr = Number.isFinite(p.dpr ?? NaN) ? (p.dpr as number) : 1;
  const plugins = Number.isFinite(p.pluginsCount ?? NaN)
    ? (p.pluginsCount as number)
    : 3;

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

type Bitness = 32 | 64 | string | null;
type Arch = 'x86' | 'x64' | 'arm64' | null;
type Orientation = 'landscape' | 'portrait';

export const expectedUA = (args: {
  ua: string;
  platformVersion: string; // e.g. 'XP' | 'Vista' | '7' | '8' | '8.1' | '10/11'
  browser: DeviceBrowser; // 'Chrome' | 'Edge' | 'Firefox' | 'Opera' | 'Safari' | 'Vivaldi' | 'Brave' | 'Yandex' | 'Unknown' ...
  deviceType: DeviceType; // 'desktop' | 'mobile' | 'tablet' | 'bot' ...
  browserVersion?: string; // default ''
  agentType?: AgentType; // default 'human'
  vendor?: string; // default depends on browser
  language?: string; // default 'en-US'
  languages?: readonly string[]; // default [en-US,'ar-EG']
  timeZone?: string; // default 'Europe/Madrid'
  maxTouchPoints?: number; // default 0
  width?: number; // default 1200
  height?: number; // default 800
  pixelRatio?: number; // default 1
  architecture?: string; // default null
  bitness?: Bitness; // default null
  wow64?: boolean | null; // default null
  hardwareConcurrency?: number; // default 8
  deviceMemory?: number; // default 8
  formFactors?: string[] | null; // default null (UA-only)
  model?: string | null; // default null (UA-only)
  brands?: readonly any[] | null; // default [] (UA-only but بنرجّع مصفوفة فاضية علشان نكمّل الأوبجكت)
}): DeviceInfo => {
  const lang = args.language ?? DEFAULT_LANG;
  const langs = (
    args.languages?.length ? [...args.languages] : [...DEFAULT_LANGS]
  ) as readonly string[];

  // Vendor policy:
  // - Firefox/Unknown/IE-like → ''
  // - Otherwise → 'Google Inc.' (Chromium family) unless caller overrides.
  const isFirefoxOrUnknown =
    args.browser === 'Firefox' || args.browser === 'Unknown';
  let vendor: string | undefined = '';

  if (args.vendor !== undefined) vendor = args.vendor;
  else if (!isFirefoxOrUnknown) vendor = 'Google Inc.';

  const width = args.width ?? 1200;
  const height = args.height ?? 800;
  const pixelRatio = args.pixelRatio ?? 1;
  const orientation: Orientation = width >= height ? 'landscape' : 'portrait';

  return {
    // ---- identity / agent ----
    userAgent: args.ua,
    agentType: args.agentType ?? 'human',
    vendor,
    platform: 'Windows' as DeviceOperatingSystem,
    deviceType: args.deviceType,
    platformVersion: args.platformVersion,

    // ---- browser ----
    browser: args.browser,
    browserVersion: args.browserVersion ?? undefined,

    // ---- locale ----
    language: lang,
    languages: langs,
    timezone: args.timeZone ?? DEFAULT_TZ,

    // ---- input / hardware ----
    maxTouchPoints: args.maxTouchPoints ?? 0,
    hardwareConcurrency: args.hardwareConcurrency ?? 8,
    deviceMemory: args.deviceMemory ?? 8,

    // ---- screen ----
    screen: {
      width,
      height,
      pixelRatio,
      orientation,
    },

    // ---- arch / bitness ----
    architecture: (args.architecture ?? null) as Arch,
    bitness: (args.bitness ?? null) as Bitness,
    wow64: args.wow64 ?? null,

    // ---- UA-CH dependent fields (نرجّع قيم كاملة رغم إننا UA-only) ----
    formFactors: args.formFactors ?? null,
    model: args.model ?? null,
    // لو الـDeviceInfo عندك معرّف brands كنوع محدد، خليه يطابقه.
    // هنا بنرجّع مصفوفة فاضية كقيمة كاملة بدل undefined.
    brands: (args.brands ?? undefined) as any,
  } as DeviceInfo;
};
// ================= WINDOWS — UA-only (NO UA-CH) =================
// يعتمد على mkUAMockFull({ ua }) و expectedUA(...) المعرفة عندك.

// ---------- XP / Vista ----------
export const platformMapsWithoutUaCH = [
  {
    sectionNo: '2.1',
    sectonName: 'Windows',
    test: [
      {
        testName: 'XP — IE7 token → browser: Unknown, desktop, x86',
        navMock: mkUAMockFull({ ua: UA_WIN_XP_IE7_DESKTOP_X86, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN_XP_IE7_DESKTOP_X86,
          platformVersion: 'XP',
          browser: 'Unknown',
          deviceType: 'desktop',
          bitness: null,
          architecture: undefined,
        }),
      },
      {
        testName: 'XP — Chrome 49 → Chrome/49, desktop, x86',
        navMock: mkUAMockFull({ ua: UA_WIN_XP_CHROME_49_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN_XP_CHROME_49_DESKTOP_X86,
          platformVersion: 'XP',
          browser: 'Chrome',
          browserVersion: '49.0.2623.112',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'XP — Firefox 52 ESR → Firefox/52, desktop, vendor:""',
        navMock: mkUAMockFull({
          ua: UA_WIN_XP_FIREFOX_52_ESR_DESKTOP_X86,
          vendor: '',
        }),
        expect: expectedUA({
          ua: UA_WIN_XP_FIREFOX_52_ESR_DESKTOP_X86,
          platformVersion: 'XP',
          browser: 'Firefox',
          browserVersion: '52.0',
          deviceType: 'desktop',
          vendor: '',
        }),
      },
      {
        testName: 'XP — Opera 12 (Presto) → Opera/12.16, desktop',
        navMock: mkUAMockFull({ ua: UA_WIN_XP_OPERA_12_PRESTO_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN_XP_OPERA_12_PRESTO_DESKTOP_X86,
          platformVersion: 'XP',
          browser: 'Opera',
          browserVersion: '12.16',
          deviceType: 'desktop',
        }),
      },

      {
        testName: 'Vista — IE7 token → browser: Unknown, desktop, x86',
        navMock: mkUAMockFull({ ua: UA_WIN_VISTA_IE7_DESKTOP_X86, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN_VISTA_IE7_DESKTOP_X86,
          platformVersion: 'Vista',
          browser: 'Unknown',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'Vista — IE9 token → browser: Unknown (Trident/5), desktop',
        navMock: mkUAMockFull({ ua: UA_WIN_VISTA_IE9_DESKTOP_X86, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN_VISTA_IE9_DESKTOP_X86,
          platformVersion: 'Vista',
          browser: 'Unknown',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'Vista — Chrome 49 → Chrome/49, desktop',
        navMock: mkUAMockFull({ ua: UA_WIN_VISTA_CHROME_49_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN_VISTA_CHROME_49_DESKTOP_X86,
          platformVersion: 'Vista',
          browser: 'Chrome',
          browserVersion: '49.0.2623.112',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'Vista — Firefox 52 ESR → Firefox/52, desktop, vendor:""',
        navMock: mkUAMockFull({
          ua: UA_WIN_VISTA_FIREFOX_52_ESR_DESKTOP_X86,
          vendor: '',
        }),
        expect: expectedUA({
          ua: UA_WIN_VISTA_FIREFOX_52_ESR_DESKTOP_X86,
          platformVersion: 'Vista',
          browser: 'Firefox',
          browserVersion: '52.0',
          deviceType: 'desktop',
          vendor: '',
        }),
      },
      {
        testName:
          'Vista — Safari 5.1.7 (Windows) → Safari/5.1.7, vendor:"Apple Computer, Inc."',
        navMock: mkUAMockFull({
          ua: UA_WIN_VISTA_SAFARI_5_1_7_DESKTOP_X86,
          vendor: 'Apple Computer, Inc.',
        }),
        expect: expectedUA({
          ua: UA_WIN_VISTA_SAFARI_5_1_7_DESKTOP_X86,
          platformVersion: 'Vista',
          browser: 'Safari',
          browserVersion: '5.1.7',
          deviceType: 'desktop',
          vendor: 'Apple Computer, Inc.',
        }),
      },
      {
        testName: 'Vista — Opera 10 (Presto) → Opera/10.00, desktop',
        navMock: mkUAMockFull({ ua: UA_WIN_VISTA_OPERA_10_PRESTO_X86 }),
        expect: expectedUA({
          ua: UA_WIN_VISTA_OPERA_10_PRESTO_X86,
          platformVersion: 'Vista',
          browser: 'Opera',
          browserVersion: '10.00',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'Win7 — IE10 token → Unknown, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN7_IE10_DESKTOP_X64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN7_IE10_DESKTOP_X64,
          platformVersion: '7',
          browser: 'Unknown',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
          vendor: '',
        }),
      },
      {
        testName: 'Win7 — IE11 token → Unknown, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN7_IE11_DESKTOP_X64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN7_IE11_DESKTOP_X64,
          platformVersion: '7',
          browser: 'Unknown',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
          vendor: '',
        }),
      },
      {
        testName: 'Win7 — Chrome 109 → Chrome/109, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN7_CHROME_109_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN7_CHROME_109_DESKTOP_X64,
          platformVersion: '7',
          browser: 'Chrome',
          browserVersion: '109.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win7 — Chrome 109 WOW64 → Chrome/109, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN7_CHROME_109_WOW64_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN7_CHROME_109_WOW64_DESKTOP_X86,
          platformVersion: '7',
          browser: 'Chrome',
          browserVersion: '109.0.0.0',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Win7 — Firefox 115 ESR → Firefox/115, desktop, x64',
        navMock: mkUAMockFull({
          ua: UA_WIN7_FIREFOX_115_ESR_DESKTOP_X64,
          vendor: '',
        }),
        expect: expectedUA({
          ua: UA_WIN7_FIREFOX_115_ESR_DESKTOP_X64,
          platformVersion: '7',
          browser: 'Firefox',
          browserVersion: '115.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win7 — Opera 36 WOW64 → OPR/36, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({
          ua: UA_WIN7_OPERA_36_CHROMIUM49_DESKTOP_WOW64,
        }),
        expect: expectedUA({
          ua: UA_WIN7_OPERA_36_CHROMIUM49_DESKTOP_WOW64,
          platformVersion: '7',
          browser: 'Opera',
          browserVersion: '36.0.2130.65',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName:
          'Win7 — Yandex 17 WOW64 → YaBrowser/17.4, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({
          ua: UA_WIN7_YANDEX_17_CHROMIUM57_DESKTOP_WOW64,
        }),
        expect: expectedUA({
          ua: UA_WIN7_YANDEX_17_CHROMIUM57_DESKTOP_WOW64,
          platformVersion: '7',
          browser: 'Yandex',
          browserVersion: '17.4.1.1026',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Win8 — IE10 desktop token → Unknown, desktop',
        navMock: mkUAMockFull({ ua: UA_WIN8_IE10_DESKTOP_X64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN8_IE10_DESKTOP_X64,
          platformVersion: '8',
          browser: 'Unknown',
          deviceType: 'desktop',
          vendor: '',
        }),
      },
      {
        testName: 'Win8 — IE10 (Touch) → Unknown, desktop, maxTouchPoints:10',
        navMock: mkUAMockFull({
          ua: UA_WIN8_IE10_TABLET_TOUCH_X64,
          vendor: '',
          maxTouchPoints: 10,
        }),
        expect: expectedUA({
          ua: UA_WIN8_IE10_TABLET_TOUCH_X64,
          platformVersion: '8',
          browser: 'Unknown',
          deviceType: 'desktop',
          vendor: '',
          maxTouchPoints: 10,
        }),
      },
      {
        testName: 'Win8.1 — IE11 desktop token → Unknown, desktop',
        navMock: mkUAMockFull({ ua: UA_WIN81_IE11_DESKTOP_X64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN81_IE11_DESKTOP_X64,
          platformVersion: '8.1',
          browser: 'Unknown',
          deviceType: 'desktop',
          vendor: '',
        }),
      },
      {
        testName:
          'Win8.1 — IE11 (Touch, es-ES) → Unknown, desktop, touch:10, lang:es-ES',
        navMock: mkUAMockFull({
          ua: UA_WIN81_IE11_TABLET_TOUCH_X64,
          vendor: '',
          maxTouchPoints: 10,
          lang: 'es-ES',
          langs: ['es-ES', 'en-US'],
        }),
        expect: expectedUA({
          ua: UA_WIN81_IE11_TABLET_TOUCH_X64,
          platformVersion: '8.1',
          browser: 'Unknown',
          deviceType: 'desktop',
          vendor: '',
          maxTouchPoints: 10,
          language: 'es-ES',
          languages: ['es-ES', 'en-US'],
        }),
      },
      {
        testName: 'Win8.1 — Chrome 109 x64 → Chrome/109, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN81_CHROME_109_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN81_CHROME_109_DESKTOP_X64,
          platformVersion: '8.1',
          browser: 'Chrome',
          browserVersion: '109.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win8.1 — Chrome 109 WOW64 → Chrome/109, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN81_CHROME_109_WOW64_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN81_CHROME_109_WOW64_DESKTOP_X86,
          platformVersion: '8.1',
          browser: 'Chrome',
          browserVersion: '109.0.0.0',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Win8.1 — Firefox 115 ESR → Firefox/115, desktop, x64',
        navMock: mkUAMockFull({
          ua: UA_WIN81_FIREFOX_115_ESR_DESKTOP_X64,
          vendor: '',
        }),
        expect: expectedUA({
          ua: UA_WIN81_FIREFOX_115_ESR_DESKTOP_X64,
          platformVersion: '8.1',
          browser: 'Firefox',
          browserVersion: '115.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win8.1 — Chrome 49 WOW64 (legacy) → Chrome/49, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN81_CHROME_49_WOW64_X86 }),
        expect: expectedUA({
          ua: UA_WIN81_CHROME_49_WOW64_X86,
          platformVersion: '8.1',
          browser: 'Chrome',
          browserVersion: '49.0.2623.112',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      }, // IE / EdgeHTML
      {
        testName: 'Win10 — IE11 token → Unknown, desktop',
        navMock: mkUAMockFull({ ua: UA_WIN10_IE11_DESKTOP_X64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN10_IE11_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
          vendor: '',
        }),
      },
      {
        testName: 'Win10 — EdgeHTML 12 token → Unknown, desktop',
        navMock: mkUAMockFull({ ua: UA_WIN10_EDGEHTML_12_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_EDGEHTML_12_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'Win10 — EdgeHTML 18 token → Unknown, desktop',
        navMock: mkUAMockFull({ ua: UA_WIN10_EDGEHTML_18_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_EDGEHTML_18_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'Win10 — IE11 (Touch) → Unknown, desktop, touch:10',
        navMock: mkUAMockFull({
          ua: UA_WIN10_IE11_TABLET_TOUCH_X64,
          vendor: '',
          maxTouchPoints: 10,
        }),
        expect: expectedUA({
          ua: UA_WIN10_IE11_TABLET_TOUCH_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
          vendor: '',
          maxTouchPoints: 10,
        }),
      },
      {
        testName: 'Win10 — EdgeHTML 18 (Touch) → Unknown, desktop, touch:10',
        navMock: mkUAMockFull({
          ua: UA_WIN10_EDGEHTML_18_TABLET_TOUCH_X64,
          maxTouchPoints: 10,
        }),
        expect: expectedUA({
          ua: UA_WIN10_EDGEHTML_18_TABLET_TOUCH_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
          maxTouchPoints: 10,
        }),
      },

      // Chromium family
      {
        testName: 'Win10 — Edge 125 x64 → Edge/125, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_EDGE_125_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_EDGE_125_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win10 — Edge 124 WOW64 → Edge/124, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN10_EDGE_124_WOW64_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN10_EDGE_124_WOW64_DESKTOP_X86,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '124.0.0.0',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Win10 — Edge 125 ARM64 → Edge/125, desktop, arm64/64',
        navMock: mkUAMockFull({ ua: UA_WIN10_EDGE_125_ARM64_DESKTOP }),
        expect: expectedUA({
          ua: UA_WIN10_EDGE_125_ARM64_DESKTOP,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'arm64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Chrome 125 x64 → Chrome/125, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_CHROME_125_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_CHROME_125_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win10 — Chrome 124 WOW64 → Chrome/124, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN10_CHROME_124_WOW64_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN10_CHROME_124_WOW64_DESKTOP_X86,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '124.0.0.0',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Win10 — Chrome 125 ARM64 → Chrome/125, desktop, arm64/64',
        navMock: mkUAMockFull({ ua: UA_WIN10_CHROME_125_ARM64_DESKTOP }),
        expect: expectedUA({
          ua: UA_WIN10_CHROME_125_ARM64_DESKTOP,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'arm64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Firefox 125 x64 → Firefox/125, desktop, x64',
        navMock: mkUAMockFull({
          ua: UA_WIN10_FIREFOX_125_DESKTOP_X64,
          vendor: '',
        }),
        expect: expectedUA({
          ua: UA_WIN10_FIREFOX_125_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Firefox',
          browserVersion: '125.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Opera 108 x64 → OPR/108, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_OPERA_108_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_OPERA_108_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Opera',
          browserVersion: '108.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Brave 1.66 x64 → Brave/1.66, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_BRAVE_1_66_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_BRAVE_1_66_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Brave',
          browserVersion: '1.66.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Vivaldi 6.7 x64 → Vivaldi/6.7, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_VIVALDI_6_7_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_VIVALDI_6_7_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Vivaldi',
          browserVersion: '6.7.3212.65',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Yandex 24.4 x64 → YaBrowser/24.4, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_YANDEX_24_4_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_YANDEX_24_4_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Yandex',
          browserVersion: '24.4.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },

      // Headless / WebView2 / Older WOW64 combos
      {
        testName:
          'Win10 — Headless Chrome 125 → HeadlessChrome token, expect Chrome/125',
        navMock: mkUAMockFull({ ua: UA_WIN10_HEADLESS_CHROME_125_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_HEADLESS_CHROME_125_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Headless Edge 125 → HeadlessChrome + Edg/125',
        navMock: mkUAMockFull({ ua: UA_WIN10_HEADLESS_EDGE_125_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_HEADLESS_EDGE_125_X64,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Edge WebView2 118 → Edg/118, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_EDGE_WEBVIEW2_118_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_EDGE_WEBVIEW2_118_X64,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '118.0.2088.69',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win10 — Chrome 87 WOW64 (old) → Chrome/87, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN10_CHROME_87_WOW64_X86 }),
        expect: expectedUA({
          ua: UA_WIN10_CHROME_87_WOW64_X86,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '87.0.4280.88',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName:
          'Win10 — Edge 90 WOW64 (old) → Edg/90, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN10_EDGE_90_WOW64_X86 }),
        expect: expectedUA({
          ua: UA_WIN10_EDGE_90_WOW64_X86,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '90.0.818.56',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Win11 — Edge 125 x64 → Edge/125, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN11_EDGE_125_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN11_EDGE_125_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Edge 125 ARM64 → Edge/125, desktop, arm64/64',
        navMock: mkUAMockFull({ ua: UA_WIN11_EDGE_125_DESKTOP_ARM64 }),
        expect: expectedUA({
          ua: UA_WIN11_EDGE_125_DESKTOP_ARM64,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'arm64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Chrome 125 x64 → Chrome/125, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN11_CHROME_125_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN11_CHROME_125_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Chrome 125 ARM64 → Chrome/125, desktop, arm64/64',
        navMock: mkUAMockFull({ ua: UA_WIN11_CHROME_125_DESKTOP_ARM64 }),
        expect: expectedUA({
          ua: UA_WIN11_CHROME_125_DESKTOP_ARM64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'arm64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win11 — Chrome 125 (Win64; ARM64 token) → Chrome/125, desktop, arm64/64',
        navMock: mkUAMockFull({ ua: UA_WIN11_CHROME_125_WIN64_ARM64 }),
        expect: expectedUA({
          ua: UA_WIN11_CHROME_125_WIN64_ARM64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'arm64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Firefox 125 x64 → Firefox/125, desktop, x64',
        navMock: mkUAMockFull({
          ua: UA_WIN11_FIREFOX_125_DESKTOP_X64,
          vendor: '',
        }),
        expect: expectedUA({
          ua: UA_WIN11_FIREFOX_125_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Firefox',
          browserVersion: '125.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Firefox 125 ARM64 → Firefox/125, desktop, arm64/64',
        navMock: mkUAMockFull({ ua: UA_WIN11_FIREFOX_125_ARM64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN11_FIREFOX_125_ARM64,
          platformVersion: '10/11',
          browser: 'Firefox',
          browserVersion: '125.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'arm64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Opera 108 x64 → OPR/108, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN11_OPERA_108_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN11_OPERA_108_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Opera',
          browserVersion: '108.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Brave 1.66 x64 → Brave/1.66, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN11_BRAVE_1_66_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN11_BRAVE_1_66_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Brave',
          browserVersion: '1.66.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Vivaldi 6.7 x64 → Vivaldi/6.7, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN11_VIVALDI_6_7_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN11_VIVALDI_6_7_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Vivaldi',
          browserVersion: '6.7.3212.65',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win11 — Yandex 24.4 x64 → YaBrowser/24.4, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN11_YANDEX_24_4_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN11_YANDEX_24_4_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Yandex',
          browserVersion: '24.4.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },

      // Headless Edge (Win11)
      {
        testName: 'Win11 — Headless Edge 125 → Edg/125 (HeadlessChrome token)',
        navMock: mkUAMockFull({ ua: UA_WIN10_HEADLESS_EDGE_125_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_HEADLESS_EDGE_125_X64,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '125.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
    ],
  },

  // ---------- Windows Phone / Mobile ----------
  {
    sectionNo: '2.6',
    sectonName: 'Windows Phone / Windows 10 Mobile',
    test: [
      {
        testName: 'Windows Phone 8.1 — IEMobile/11 (Lumia) → mobile, touch:5',
        navMock: mkUAMockFull({
          ua: UA_WINPHONE_8_1_IEMOBILE_11_LUMIA_ARM,
          maxTouchPoints: 5,
        }),
        expect: expectedUA({
          ua: UA_WINPHONE_8_1_IEMOBILE_11_LUMIA_ARM,
          platformVersion: '8.1',
          browser: 'Unknown',
          deviceType: 'mobile',
          maxTouchPoints: 5,
          architecture: 'arm',
        }),
      },
      {
        testName: 'Windows 10 Mobile — Edge/15 (Lumia) → mobile, touch:5',
        navMock: mkUAMockFull({
          ua: UA_WIN10_MOBILE_EDGE_15_LUMIA_ARM,
          maxTouchPoints: 5,
        }),
        expect: expectedUA({
          ua: UA_WIN10_MOBILE_EDGE_15_LUMIA_ARM,
          platformVersion: '10/11',
          browser: 'Edge',
          browserVersion: '15.15254',
          deviceType: 'mobile',
          maxTouchPoints: 5,
        }),
      },
      {
        testName: 'Xbox One — Edge/15 → desktop (Xbox token), x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_XBOX_EDGE_15_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_XBOX_EDGE_15_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Xbox One — EdgeHTML/44 (newer) → desktop (Xbox token)',
        navMock: mkUAMockFull({ ua: UA_WIN10_XBOX_EDGEHTML_44 }),
        expect: expectedUA({
          ua: UA_WIN10_XBOX_EDGEHTML_44,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'UWP WebView — EdgeHTML/17 (Mobile Safari token) → desktop',
        navMock: mkUAMockFull({ ua: UA_WIN10_UWP_WEBVIEW_EDGEHTML_17_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_UWP_WEBVIEW_EDGEHTML_17_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
        }),
      },
      {
        testName:
          'BingPreview — preview agent → device: bot, agentType: preview',
        navMock: mkUAMockFull({ ua: UA_BOT_BINGPREVIEW_WIN10_X64 }),
        expect: expectedUA({
          ua: UA_BOT_BINGPREVIEW_WIN10_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'bot',
          agentType: 'preview',
        }),
      },
      {
        testName:
          'Facebot — crawler → device: bot, agentType: preview, vendor:""',
        navMock: mkUAMockFull({ ua: UA_BOT_FACEBOT_WIN10_X64 }),
        expect: expectedUA({
          ua: UA_BOT_FACEBOT_WIN10_X64,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'bot',
          agentType: 'preview',
          vendor: '',
        }),
      },
      {
        testName: 'Googlebot (compatible) → device: bot, agentType: bot',
        navMock: mkUAMockFull({ ua: UA_BOT_GOOGLEBOT_WIN10_COMPAT }),
        expect: expectedUA({
          ua: UA_BOT_GOOGLEBOT_WIN10_COMPAT,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'bot',
          agentType: 'bot',
        }),
      },
      {
        testName: 'Slack (Electron/27) → Chrome/118 token, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_SLACK_ELECTRON_27 }),
        expect: expectedUA({
          ua: UA_WIN10_SLACK_ELECTRON_27,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '118.0.5993.89',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Discord (Electron/28) → Chrome/118 token, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_DISCORD_ELECTRON_28 }),
        expect: expectedUA({
          ua: UA_WIN10_DISCORD_ELECTRON_28,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '118.0.5993.89',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'VS Code (Electron/28) → Chrome/120 token, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_VSCODE_ELECTRON_28 }),
        expect: expectedUA({
          ua: UA_WIN10_VSCODE_ELECTRON_28,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '120.0.6099.109',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Microsoft Teams (Electron/26) → Chrome/114 token, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_TEAMS_ELECTRON_26 }),
        expect: expectedUA({
          ua: UA_WIN10_TEAMS_ELECTRON_26,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '114.0.5735.289',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Maxthon 5 → treat as Chrome (Chrome/61), desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_MAXTHON_5_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_MAXTHON_5_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '61.0.3163.79',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'UC Browser 7 (UBrowser) → treat as Chrome (Chrome/70), desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_UC_BROWSER_7_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_UC_BROWSER_7_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '70.0.3538.102',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'QQ Browser 11 → treat as Chrome (Chrome/86), desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_QQ_BROWSER_11_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_QQ_BROWSER_11_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '86.0.4240.198',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          '360SE 13 WOW64 → treat as Chrome (Chrome/86), desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN10_360SE_13_WOW64 }),
        expect: expectedUA({
          ua: UA_WIN10_360SE_13_WOW64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '86.0.4240.198',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Sogou 2.X → treat as Chrome (Chrome/72), desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_SOGOU_2_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_SOGOU_2_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '72.0.3626.121',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Baidu 7.6 → treat as Chrome (Chrome/57), desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_BAIDU_7_6_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_BAIDU_7_6_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '57.0.2987.98',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'CocCoc 115 → treat as Chrome (Chrome/115), desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_COCCOC_115_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_COCCOC_115_X64,
          platformVersion: '10/11',
          browser: 'Chrome',
          browserVersion: '115.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Tor Browser 12.5 → Firefox/115 token, desktop, x64',
        navMock: mkUAMockFull({
          ua: UA_WIN10_TOR_BROWSER_12_5_X64,
          vendor: '',
        }),
        expect: expectedUA({
          ua: UA_WIN10_TOR_BROWSER_12_5_X64,
          platformVersion: '10/11',
          browser: 'Tor',
          browserVersion: '115.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Waterfox G5 → Firefox/102 token, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_WATERFOX_G5_X64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN10_WATERFOX_G5_X64,
          platformVersion: '10/11',
          browser: 'Firefox',
          browserVersion: '102.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Pale Moon 31 → Goanna (Firefox/68 token), desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_PALEMOON_31_X64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN10_PALEMOON_31_X64,
          platformVersion: '10/11',
          browser: 'Firefox',
          browserVersion: '68.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'SeaMonkey 2.53 → Firefox/60 token, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_SEAMONKEY_2_53_X64, vendor: '' }),
        expect: expectedUA({
          ua: UA_WIN10_SEAMONKEY_2_53_X64,
          platformVersion: '10/11',
          browser: 'Firefox',
          browserVersion: '60.0',
          deviceType: 'desktop',
          vendor: '',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Steam GameOverlay → desktop (Valve token), WebKit/537',
        navMock: mkUAMockFull({ ua: UA_WIN10_STEAM_OVERLAY }),
        expect: expectedUA({
          ua: UA_WIN10_STEAM_OVERLAY,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'Epic Games Launcher → desktop (launcher token)',
        navMock: mkUAMockFull({ ua: UA_WIN10_EPIC_GAMES_LAUNCHER }),
        expect: expectedUA({
          ua: UA_WIN10_EPIC_GAMES_LAUNCHER,
          platformVersion: '10/11',
          browser: 'Unknown',
          deviceType: 'desktop',
        }),
      },
      {
        testName: 'Win10 — Opera GX 108 → OPR/108, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_OPERA_GX_108_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_OPERA_GX_108_X64,
          platformVersion: '10/11',
          browser: 'Opera',
          browserVersion: '108.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win7 — Torch 69 (x64) → Torch/69, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN7_TORCH_69_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN7_TORCH_69_DESKTOP_X64,
          platformVersion: '7',
          browser: 'Torch' as any,
          browserVersion: '69.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win7 — Torch 69 WOW64 (x86 browser) → Torch/69, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN7_TORCH_69_WOW64_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN7_TORCH_69_WOW64_DESKTOP_X86,
          platformVersion: '7',
          browser: 'Torch' as any,
          browserVersion: '69.0.0.0',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Win8.1 — Torch 75 (x64) → Torch/75, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN81_TORCH_75_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN81_TORCH_75_DESKTOP_X64,
          platformVersion: '8.1',
          browser: 'Torch' as any,
          browserVersion: '75.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName: 'Win10 — Torch 86 (x64) → Torch/86, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN10_TORCH_86_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN10_TORCH_86_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Torch' as any,
          browserVersion: '86.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
      {
        testName:
          'Win10 — Torch 86 WOW64 (x86 browser) → Torch/86, desktop, x86/32, WOW64:true',
        navMock: mkUAMockFull({ ua: UA_WIN10_TORCH_86_WOW64_DESKTOP_X86 }),
        expect: expectedUA({
          ua: UA_WIN10_TORCH_86_WOW64_DESKTOP_X86,
          platformVersion: '10/11',
          browser: 'Torch' as any,
          browserVersion: '86.0.0.0',
          deviceType: 'desktop',
          architecture: 'x86',
          bitness: 32,
          wow64: true,
        }),
      },
      {
        testName: 'Win11 — Torch 120 (x64) → Torch/120, desktop, x64',
        navMock: mkUAMockFull({ ua: UA_WIN11_TORCH_120_DESKTOP_X64 }),
        expect: expectedUA({
          ua: UA_WIN11_TORCH_120_DESKTOP_X64,
          platformVersion: '10/11',
          browser: 'Torch' as any,
          browserVersion: '120.0.0.0',
          deviceType: 'desktop',
          architecture: 'x64',
          bitness: 64,
        }),
      },
    ],
  },
];
