import {
  Bitness,
  DeviceInfo,
  DeviceOperatingSystem,
} from 'projects/kyrolus-sous-materials/src/models/device-info';
import { windowsTestCases } from './windows/windows-tests';
import { androidCases } from './android/android-test';
import {
  ChromeOSDesktopCases,
  ChromeOSTableCases,
} from './chromeos/chromeos-tests';
import {
  DEFAULT_LANG,
  DEFAULT_LANGS,
  DEFAULT_TZ,
  PLATFORM_DEFAULTS,
  PRESET_Android,
  PRESET_ChromeOS_DESKTOP,
  PRESET_ChromeOS_TABLET,
  PRESET_iOS,
  PRESET_Linux,
  PRESET_macOS,
  PRESET_WINDOWS,
  resolveVendor,
} from './mockup-constants';
import { iosCases } from './ios/ios-tests';
import {
  Preset,
  ExpectedArgs,
  deviceInfoTests,
  UAMockInput,
} from './mockup-types';
import { LinuxCases } from './linux/linux-tests';

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
    Number.isFinite(val ?? NaN) ? (val as number) : fallback;

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

export const expectedUAWindows = (args: Omit<ExpectedArgs, 'platform'>) =>
  expectedUA(
    { ...args, platform: 'Windows' as DeviceOperatingSystem },
    'windows'
  );
export const expectedUAAndroid = (args: Omit<ExpectedArgs, 'platform'>) =>
  expectedUA(
    { ...args, platform: 'Android' as DeviceOperatingSystem },
    'android'
  );
export const expectedUAChromeOSDesktop = (
  args: Omit<ExpectedArgs, 'platform'>
) =>
  expectedUA(
    { ...args, platform: 'ChromeOS' as DeviceOperatingSystem },
    'chromeOSDesktop'
  );
export const expectedUAChromeOSTablet = (
  args: Omit<ExpectedArgs, 'platform'>
) =>
  expectedUA(
    { ...args, platform: 'ChromeOS' as DeviceOperatingSystem },
    'chromeOSTablet'
  );
export const expectedUAIOS = (args: Omit<ExpectedArgs, 'platform'>) =>
  expectedUA({ ...args, platform: 'iOS' as DeviceOperatingSystem }, 'ios');
export const expectedLinuxOS = (args: Omit<ExpectedArgs, 'platform'>) =>
  expectedUA({ ...args, platform: 'Linux' as DeviceOperatingSystem }, 'linux');
export const windowsTestsWithoutUACH: deviceInfoTests = {
  sectionNo: '2.1',
  sectonName: 'Windows',
  test: windowsTestCases.map((c) => ({
    testName: c.testName,
    navMock: mkUAMockFull({
      ua: c.ua,
      vendor: c.vendor,
      maxTouchPoints: c.maxTouchPoints,
      hardwareConcurrency: c.hardwareConcurrency,
      deviceMemory: c.deviceMemory,
      innerWidth: c.width,
      innerHeight: c.height,
      dpr: c.pixelRatio,
    }),
    expect: expectedUAWindows({
      ua: c.ua,
      platformVersion: c.platformVersion,
      browser: c.browser,
      browserVersion: c.browserVersion,
      deviceType: c.deviceType,
      agentType: c.agentType,
      vendor: c.vendor,
      maxTouchPoints: c.maxTouchPoints,
      hardwareConcurrency: c.hardwareConcurrency,
      deviceMemory: c.deviceMemory,
      width: c.width,
      height: c.height,
      pixelRatio: c.pixelRatio,
      architecture: c.architecture,
      bitness: c.bitness,
      wow64: c.wow64,
    }),
  })),
};
export const androidTestsWithoutUACH: deviceInfoTests = {
  sectionNo: '2.2',
  sectonName: 'Android',
  test: androidCases.map((c) => ({
    testName: c.testName,
    navMock: mkUAMockFull(
      {
        ua: c.ua,
        vendor: c.vendor,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
        innerWidth: c.width,
        innerHeight: c.height,
        orientation: 'portrait',
        dpr: c.pixelRatio,
      },
      'android'
    ),
    expect: expectedUAAndroid({
      ua: c.ua,
      platformVersion: c.platformVersion,
      browser: c.browser,
      browserVersion: c.browserVersion,
      deviceType: c.deviceType,
      agentType: c.agentType,
      vendor: c.vendor,
      maxTouchPoints: c.maxTouchPoints,
      hardwareConcurrency: c.hardwareConcurrency,
      deviceMemory: c.deviceMemory,
      width: c.width,
      height: c.height,
      pixelRatio: c.pixelRatio,
      architecture: c.architecture,
      bitness: c.bitness,
      wow64: c.wow64,
    }),
  })),
};
export const ChromeOSDesktopWithoutUACH: deviceInfoTests = {
  sectionNo: '2.3',
  sectonName: 'ChromeOS Desktop',
  test: ChromeOSDesktopCases.map((c) => ({
    testName: c.testName,
    navMock: mkUAMockFull(
      {
        ua: c.ua,
        vendor: c.vendor,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
        innerWidth: c.width,
        innerHeight: c.height,
        dpr: c.pixelRatio,
      },
      'chromeOSDesktop'
    ),
    expect: expectedUAChromeOSDesktop({
      ua: c.ua,
      platformVersion: c.platformVersion,
      browser: c.browser,
      browserVersion: c.browserVersion,
      deviceType: c.deviceType,
      architecture: c.architecture,
      bitness: c.bitness,
      vendor: c.vendor,
      maxTouchPoints: c.maxTouchPoints,
      hardwareConcurrency: c.hardwareConcurrency,
      deviceMemory: c.deviceMemory,
      width: c.width,
      height: c.height,
      pixelRatio: c.pixelRatio,
    }),
  })),
};
export const ChromeOSTabletWithoutUACH: deviceInfoTests = {
  sectionNo: '2.4',
  sectonName: 'ChromeOS tablet',
  test: ChromeOSTableCases.map((c) => ({
    testName: c.testName,
    navMock: mkUAMockFull(
      {
        ua: c.ua,
        vendor: c.vendor,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
        innerWidth: c.width,
        innerHeight: c.height,
        dpr: c.pixelRatio,
      },
      'chromeOSTablet'
    ),
    expect: expectedUAChromeOSTablet({
      ua: c.ua,
      platformVersion: c.platformVersion,
      browser: c.browser,
      browserVersion: c.browserVersion,
      deviceType: c.deviceType,
      architecture: c.architecture,
      bitness: c.bitness,
      vendor: c.vendor,
      maxTouchPoints: c.maxTouchPoints,
      hardwareConcurrency: c.hardwareConcurrency,
      deviceMemory: c.deviceMemory,
      width: c.width,
      height: c.height,
      pixelRatio: c.pixelRatio,
    }),
  })),
};
export const iosWithoutUACH: deviceInfoTests = {
  sectionNo: '2.5',
  sectonName: 'iOS',
  test: iosCases.map((c) => ({
    testName: c.testName,
    navMock: mkUAMockFull(
      {
        ua: c.ua,
        vendor: c.vendor,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
        innerWidth: c.width,
        innerHeight: c.height,
        dpr: c.pixelRatio,
      },
      'ios'
    ),
    expect: expectedUAIOS({
      ua: c.ua,
      platformVersion: c.platformVersion,
      browser: c.browser,
      browserVersion: c.browserVersion,
      deviceType: c.deviceType,
      architecture: c.architecture,
      bitness: c.bitness,
      agentType: c.agentType,
      vendor: c.vendor,
      maxTouchPoints: c.maxTouchPoints,
      hardwareConcurrency: c.hardwareConcurrency,
      deviceMemory: c.deviceMemory,
      width: c.width,
      height: c.height,
      pixelRatio: c.pixelRatio,
    }),
  })),
};
export const linuxWithoutUACH: deviceInfoTests = {
  sectionNo: '2.6',
  sectonName: 'linux',
  test: LinuxCases.map((c) => ({
    testName: c.testName,
    navMock: mkUAMockFull(
      {
        ua: c.ua,
        vendor: c.vendor,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
        innerWidth: c.width,
        innerHeight: c.height,
        dpr: c.pixelRatio,
      },
      'linux'
    ),
    expect: expectedLinuxOS({
      ua: c.ua,
      platformVersion: c.platformVersion,
      browser: c.browser,
      browserVersion: c.browserVersion,
      deviceType: c.deviceType,
      architecture: c.architecture,
      bitness: c.bitness,
      agentType: c.agentType,
      vendor: c.vendor,
      maxTouchPoints: c.maxTouchPoints,
      hardwareConcurrency: c.hardwareConcurrency,
      deviceMemory: c.deviceMemory,
      width: c.width,
      height: c.height,
      pixelRatio: c.pixelRatio,
    }),
  })),
};
export const platformMapsWithoutUaCH: { [key: string]: deviceInfoTests } = {
  windowsNoUACH: windowsTestsWithoutUACH,
  androidNoUACH: androidTestsWithoutUACH,
  chromeOSDesktopNoUACH: ChromeOSDesktopWithoutUACH,
  chromeOSTabletNoUACH: ChromeOSTabletWithoutUACH,
  iosNoUACH: iosWithoutUACH,
  linuxNoUACH: linuxWithoutUACH,
};
