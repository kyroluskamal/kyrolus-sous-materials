import {
  Bitness,
  DeviceOperatingSystem,
} from 'projects/kyrolus-sous-materials/src/models/device-info';
import { windowsTestCases } from './windows/windows-tests';
import { androidCases } from './android/android-test';
import {
  ChromeOSDesktopCases,
  ChromeOSTableCases,
} from './chromeos/chromeos-tests';
import { iosCases } from './ios/ios-tests';
import { LinuxCases } from './linux/linux-tests';
import {
  brandsFor,
  bumpVersion,
  DEFAULT_BROWSER_VERSION,
  deviceInfoTests,
  ExpectedArgs,
  expectedUA,
  formFactorsFor,
  isChromiumUA,
  isMobileLike,
  makeHighPlatformVersion,
  mkNavMockWithUAChHigh,
  mkNavMockWithUAChLow,
  mkUAMockFull,
  modelFor,
} from './device-info-mockup-kits';
import { macOSCases } from './macos/macos-tests';
/* v8 ignore start */

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
export const expectedUAMacOS = (args: Omit<ExpectedArgs, 'platform'>) =>
  expectedUA({ ...args, platform: 'macOS' as DeviceOperatingSystem }, 'macos');
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
export const macosWithoutUACH: deviceInfoTests = {
  sectionNo: '2.7',
  sectonName: 'macOS',
  test: macOSCases.map((c) => ({
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
        platform: 'mac',
      },
      'macos'
    ),
    expect: expectedUAMacOS({
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
export const windowsWithLowUACh: deviceInfoTests = {
  sectionNo: '3.1',
  sectonName: 'Windows + UA-CH (LOW only)',
  test: windowsTestCases
    .filter((c) => isChromiumUA(c.ua))
    .map((c) => {
      const brands = brandsFor(c.browser);
      return {
        testName: `${c.testName}`,
        navMock: mkNavMockWithUAChLow(
          {
            ua: c.ua,
            uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
            brands,
            uaChPlatform: 'Windows',
            mobile: false,
            uaChUndefinedPlatformVersion:
              c.uaChUndefinedPlatformVersion ?? false,
            uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
            uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
            navPlatform: 'Win32',
            brave: c.browser.toLowerCase() === 'brave',
            innerWidth: c.width,
            innerHeight: c.height,
            dpr: c.pixelRatio,
            maxTouchPoints: c.maxTouchPoints,
            hardwareConcurrency: c.hardwareConcurrency,
            deviceMemory: c.deviceMemory,
            platform: c.platform,
            vendor: c.vendor,
          },
          'windows'
        ),
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
          brands,
        }),
      };
    }),
};
export const androidWithLowUACh: deviceInfoTests = {
  sectionNo: '3.2',
  sectonName: 'Android + UA-CH (LOW only)',
  test: androidCases
    .filter((c) => isChromiumUA(c.ua))
    .map((c) => {
      const brands = brandsFor(c.browser);
      return {
        testName: `${c.testName}`,
        navMock: mkNavMockWithUAChLow(
          {
            ua: c.ua,
            brands,
            uaChPlatform: 'Android',
            navPlatform: 'Linux',
            uaChUndefinedPlatformVersion:
              c.uaChUndefinedPlatformVersion ?? false,
            uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
            uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
            mobile: false,
            brave: c.browser.toLowerCase() === 'brave',
            innerWidth: c.width,
            innerHeight: c.height,
            dpr: c.pixelRatio,
            uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
            maxTouchPoints: c.maxTouchPoints,
            hardwareConcurrency: c.hardwareConcurrency,
            deviceMemory: c.deviceMemory,
            vendor: c.vendor,
            platform: c.platform,
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
          brands,
        }),
      };
    }),
};
export const iosWithLowUACh: deviceInfoTests = {
  sectionNo: '3.3',
  sectonName: 'IOS + UA-CH (LOW only)',
  test: iosCases
    .filter((c) => isChromiumUA(c.ua))
    .map((c) => {
      const brands = brandsFor(c.browser);
      return {
        testName: `${c.testName}`,
        navMock: mkNavMockWithUAChLow(
          {
            ua: c.ua,
            brands,
            uaChPlatform: 'IOS',
            mobile: false,
            navPlatform: 'iPhone',
            uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
            uaChUndefinedPlatformVersion:
              c.uaChUndefinedPlatformVersion ?? false,
            uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
            uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
            brave: c.browser.toLowerCase() === 'brave',
            innerWidth: c.width,
            innerHeight: c.height,
            dpr: c.pixelRatio,
            maxTouchPoints: c.maxTouchPoints,
            hardwareConcurrency: c.hardwareConcurrency,
            deviceMemory: c.deviceMemory,
            vendor: c.vendor,
            platform: c.platform,
          },
          'ios'
        ),
        expect: expectedUAIOS({
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
          brands,
        }),
      };
    }),
};
export const linuxWithLowUACh: deviceInfoTests = {
  sectionNo: '3.4',
  sectonName: 'Linux + UA-CH (LOW only)',
  test: LinuxCases.filter((c) => isChromiumUA(c.ua)).map((c) => {
    const brands = brandsFor(c.browser);
    return {
      testName: `${c.testName}`,
      navMock: mkNavMockWithUAChLow(
        {
          ua: c.ua,
          brands,
          uaChPlatform: 'Linux',
          mobile: false,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          navPlatform: 'Linux',
          brave: c.browser.toLowerCase() === 'brave',
          innerWidth: c.width,
          innerHeight: c.height,
          dpr: c.pixelRatio,
          maxTouchPoints: c.maxTouchPoints,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          hardwareConcurrency: c.hardwareConcurrency,
          deviceMemory: c.deviceMemory,
          vendor: c.vendor,
          platform: c.platform,
        },
        'linux'
      ),
      expect: expectedLinuxOS({
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
        brands,
      }),
    };
  }),
};
export const ChromeOSDeskTopWithLowUACh: deviceInfoTests = {
  sectionNo: '3.5',
  sectonName: 'ChromeOSDeskTop + UA-CH (LOW only)',
  test: ChromeOSDesktopCases.filter((c) => isChromiumUA(c.ua)).map((c) => {
    const brands = brandsFor(c.browser);
    return {
      testName: `${c.testName}`,
      navMock: mkNavMockWithUAChLow(
        {
          ua: c.ua,
          brands,
          uaChPlatform: 'ChromeOS',
          navPlatform: 'Linux',
          mobile: false,
          brave: c.browser.toLowerCase() === 'brave',
          innerWidth: c.width,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          innerHeight: c.height,
          dpr: c.pixelRatio,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          maxTouchPoints: c.maxTouchPoints,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          hardwareConcurrency: c.hardwareConcurrency,
          deviceMemory: c.deviceMemory,
          vendor: c.vendor,
          platform: c.platform,
        },
        'chromeOSDesktop'
      ),
      expect: expectedUAChromeOSDesktop({
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
        brands,
      }),
    };
  }),
};
export const ChromeOSTabletWithLowUACh: deviceInfoTests = {
  sectionNo: '3.5',
  sectonName: 'ChromeOSTablet + UA-CH (LOW only)',
  test: ChromeOSTableCases.filter((c) => isChromiumUA(c.ua)).map((c) => {
    const brands = brandsFor(c.browser);
    return {
      testName: `${c.testName}`,
      navMock: mkNavMockWithUAChLow(
        {
          ua: c.ua,
          brands,
          uaChPlatform: 'ChromeOS',
          navPlatform: 'Linux',
          mobile: false,
          brave: c.browser.toLowerCase() === 'brave',
          innerWidth: c.width,
          innerHeight: c.height,
          dpr: c.pixelRatio,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          maxTouchPoints: c.maxTouchPoints,
          hardwareConcurrency: c.hardwareConcurrency,
          deviceMemory: c.deviceMemory,
          vendor: c.vendor,
          platform: c.platform,
        },
        'chromeOSTablet'
      ),
      expect: expectedUAChromeOSDesktop({
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
        brands,
      }),
    };
  }),
};
export const macosWithLowUACh: deviceInfoTests = {
  sectionNo: '3.6',
  sectonName: 'macOS + UA-CH (LOW only)',
  test: macOSCases
    .filter((c) => isChromiumUA(c.ua))
    .map((c) => {
      const brands = brandsFor(c.browser);
      const navPlatform = c.architecture?.toLowerCase().includes('arm')
        ? 'MacARM64'
        : 'MacIntel';
      return {
        testName: `${c.testName}`,
        navMock: mkNavMockWithUAChLow(
          {
            ua: c.ua,
            brands,
            uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
            uaChUndefinedPlatformVersion:
              c.uaChUndefinedPlatformVersion ?? false,
            uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
            uaChPlatform: 'macOS',
            mobile: false,
            navPlatform,
            uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
            brave: c.browser.toLowerCase() === 'brave',
            innerWidth: c.width,
            innerHeight: c.height,
            dpr: c.pixelRatio,
            maxTouchPoints: c.maxTouchPoints,
            hardwareConcurrency: c.hardwareConcurrency,
            deviceMemory: c.deviceMemory,
            vendor: c.vendor,
            platform: 'mac',
          },
          'macos'
        ),
        expect: expectedUAMacOS({
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
          brands,
        }),
      };
    }),
};
export const windowsWithHighUACh: deviceInfoTests = {
  sectionNo: '4.1',
  sectonName: 'Windows + UA-CH (HIGH, overrides UA)',
  test: windowsTestCases.map((c) => {
    const brands = brandsFor(c.browser);
    const baseline = c.platformVersion ?? '10.0.0';
    const platformVersion = makeHighPlatformVersion(baseline, '10.0.0');
    const bitness = (c.bitness ?? (/WOW64/i.test(c.ua) ? 32 : 64)) as Bitness;
    const architecture: string | undefined =
      c.architecture ??
      (/WOW64/i.test(c.ua) || bitness === 32
        ? ('x86' as const)
        : ('x64' as const));
    const wow64 = c.wow64 ?? /WOW64/i.test(c.ua);
    const fullVersion = bumpVersion(
      c.usChBrowserversion ?? c.browserVersion,
      DEFAULT_BROWSER_VERSION
    );
    const formFactors = formFactorsFor(c.deviceType) ?? [];
    return {
      testName: `${c.testName} — UA + HIGH UA-CH (override)`,
      navMock: mkNavMockWithUAChHigh(
        {
          ua: c.ua,
          brands,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          uaChPlatform: 'Windows',
          mobile: isMobileLike(c.deviceType),
          navPlatform: 'Win32',
          brave: c.browser.toLowerCase() === 'brave',
          innerWidth: c.width,
          innerHeight: c.height,
          dpr: c.pixelRatio,
          maxTouchPoints: c.maxTouchPoints,
          hardwareConcurrency: c.hardwareConcurrency,
          deviceMemory: c.deviceMemory,
          vendor: c.vendor,
          high: {
            wow64: c.uaChUndefinedWow64 ? undefined : wow64,
            bitness: c.uaChUndefinedBitness ? undefined : bitness,
            architecture: c.uaChUndefinedArchitecture
              ? undefined
              : architecture,
            platformVersion,
            fullVersion,
            formFactors,
          },
        },
        'windows'
      ),
      expect: expectedUAWindows({
        ua: c.ua,
        browser: c.browser,
        browserVersion: fullVersion,
        deviceType: c.deviceType,
        vendor: c.vendor,
        width: c.width,
        height: c.height,
        pixelRatio: c.pixelRatio,
        platformVersion: platformVersion.startsWith('10')
          ? '10/11'
          : platformVersion,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
        architecture,
        bitness,
        wow64,
        brands: c.uaChUndefinedBrands && c.uaLowCHUndefinedBrands ? [] : brands,
        agentType: c.agentType,
        formFactors: formFactors.length ? formFactors : [],
      }),
    };
  }),
};

export const androidWithHighUACh: deviceInfoTests = {
  sectionNo: '4.2',
  sectonName: 'Android + UA-CH (HIGH, overrides UA)',
  test: androidCases.map((c, index) => {
    const brands = brandsFor(c.browser);
    const platformVersion = makeHighPlatformVersion(
      c.platformVersion,
      c.platformVersion ?? '14.0.0'
    );
    const fullVersion = bumpVersion(c.browserVersion, DEFAULT_BROWSER_VERSION);
    const architecture =
      c.architecture ??
      (c.deviceType === 'mobile' || c.deviceType === 'tablet'
        ? ('arm64' as const)
        : ('x86' as const));
    const bitness = (c.bitness ?? 64) as Bitness;
    const baseFormFactors = formFactorsFor(c.deviceType);
    const formFactors =
      baseFormFactors ??
      (c.deviceType === 'bot' || c.deviceType === 'unknown' ? [] : ['Mobile']);
    const navPlatform = architecture.toString().includes('arm')
      ? 'Linux armv8l'
      : 'Linux x86_64';
    const model = modelFor(c.deviceType, index, 'Android');
    return {
      testName: `${c.testName} — UA + HIGH UA-CH (override)`,
      navMock: mkNavMockWithUAChHigh(
        {
          ua: c.ua,
          brands,
          uaChPlatform: 'Android',
          mobile: c.deviceType === 'mobile',
          navPlatform,
          innerWidth: c.width,
          innerHeight: c.height,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          dpr: c.pixelRatio,
          maxTouchPoints: c.maxTouchPoints,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          hardwareConcurrency: c.hardwareConcurrency,
          deviceMemory: c.deviceMemory,
          vendor: c.vendor,
          high: {
            architecture,
            bitness,
            platformVersion,
            fullVersion,
            formFactors,
            model,
          },
        },
        'android'
      ),
      expect: expectedUAAndroid({
        ua: c.ua,
        browser: c.browser,
        browserVersion: fullVersion,
        deviceType: c.deviceType,
        vendor: c.vendor,
        width: c.width,
        height: c.height,
        pixelRatio: c.pixelRatio,
        platformVersion,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
        architecture,
        bitness,
        agentType: c.agentType,
        brands: c.uaChUndefinedBrands && c.uaLowCHUndefinedBrands ? [] : brands,
        formFactors: formFactors.length ? formFactors : [],
        model,
      }),
    };
  }),
};

export const chromeOSDesktopWithHighUACh: deviceInfoTests = {
  sectionNo: '4.3',
  sectonName: 'ChromeOS desktop + UA-CH (HIGH, overrides UA)',
  test: ChromeOSDesktopCases.map((c, index) => {
    const brands = brandsFor(c.browser);
    const fullVersion = bumpVersion(c.browserVersion, DEFAULT_BROWSER_VERSION);
    const platformVersion = makeHighPlatformVersion(
      c.platformVersion,
      c.platformVersion ?? '15329.58.0'
    );
    const architecture = c.architecture ?? 'x64';
    const bitness = (c.bitness ?? 64) as Bitness;
    const formFactors = formFactorsFor(c.deviceType) ?? ['Desktop'];
    const navPlatform = architecture.includes('arm')
      ? 'Linux armv8l'
      : 'Linux x86_64';
    const model = modelFor(c.deviceType, index, 'ChromeOS');
    return {
      testName: `${c.testName} — UA + HIGH UA-CH (override)`,
      navMock: mkNavMockWithUAChHigh(
        {
          ua: c.ua,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          brands,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          uaChPlatform: 'ChromeOS',
          mobile: false,
          navPlatform,
          innerWidth: c.width,
          innerHeight: c.height,
          dpr: c.pixelRatio,
          maxTouchPoints: c.maxTouchPoints,
          hardwareConcurrency: c.hardwareConcurrency,
          deviceMemory: c.deviceMemory,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          vendor: c.vendor,
          high: {
            architecture,
            bitness,
            platformVersion,
            fullVersion,
            formFactors,
            model,
          },
        },
        'chromeOSDesktop'
      ),
      expect: expectedUAChromeOSDesktop({
        ua: c.ua,
        browser: c.browser,
        browserVersion: fullVersion,
        deviceType: c.deviceType,
        vendor: c.vendor,
        width: c.width,
        height: c.height,
        pixelRatio: c.pixelRatio,
        platformVersion,
        architecture,
        bitness,
        agentType: c.agentType,
        brands: c.uaChUndefinedBrands && c.uaLowCHUndefinedBrands ? [] : brands,
        formFactors: formFactors.length ? formFactors : [],
        model,
      }),
    };
  }),
};

export const chromeOSTabletWithHighUACh: deviceInfoTests = {
  sectionNo: '4.4',
  sectonName: 'ChromeOS tablet + UA-CH (HIGH, overrides UA)',
  test: ChromeOSTableCases.map((c, index) => {
    const brands = brandsFor(c.browser);
    const fullVersion = bumpVersion(c.browserVersion, DEFAULT_BROWSER_VERSION);
    const platformVersion = makeHighPlatformVersion(
      c.platformVersion,
      c.platformVersion ?? '15329.58.0'
    );
    const architecture = c.architecture ?? 'arm64';
    const bitness = (c.bitness ?? 64) as Bitness;
    const formFactors = ['Tablet'];
    const navPlatform = architecture.includes('arm')
      ? 'Linux armv8l'
      : 'Linux x86_64';
    const model = modelFor('tablet', index, 'ChromeOS');
    return {
      testName: `${c.testName} — UA + HIGH UA-CH (override)`,
      navMock: mkNavMockWithUAChHigh(
        {
          ua: c.ua,
          brands,
          uaChPlatform: 'ChromeOS',
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          mobile: false,
          navPlatform,
          innerWidth: c.width,
          innerHeight: c.height,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          dpr: c.pixelRatio,
          maxTouchPoints: c.maxTouchPoints,
          hardwareConcurrency: c.hardwareConcurrency,
          deviceMemory: c.deviceMemory,
          vendor: c.vendor,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          high: {
            architecture,
            bitness,
            platformVersion,
            fullVersion,
            formFactors,
            model,
          },
        },
        'chromeOSTablet'
      ),
      expect: expectedUAChromeOSTablet({
        ua: c.ua,
        browser: c.browser,
        browserVersion: fullVersion,
        deviceType: 'tablet',
        vendor: c.vendor,
        width: c.width,
        height: c.height,
        pixelRatio: c.pixelRatio,
        platformVersion,
        architecture,
        bitness,
        agentType: c.agentType,
        brands: c.uaChUndefinedBrands && c.uaLowCHUndefinedBrands ? [] : brands,
        formFactors,
        model,
      }),
    };
  }),
};

export const iosWithHighUACh: deviceInfoTests = {
  sectionNo: '4.5',
  sectonName: 'iOS + UA-CH (HIGH, overrides UA)',
  test: iosCases.map((c, index) => {
    const brands = brandsFor(c.browser);
    const fullVersion = bumpVersion(c.browserVersion, DEFAULT_BROWSER_VERSION);
    const platformVersion = makeHighPlatformVersion(
      c.platformVersion,
      c.platformVersion ?? '17.0.0'
    );
    const architecture = c.architecture ?? 'arm64';
    const bitness = (c.bitness ?? 64) as Bitness;
    const formFactors =
      formFactorsFor(c.deviceType) ??
      (c.deviceType === 'tablet' ? ['Tablet'] : ['Mobile']);
    const navPlatform = c.deviceType === 'tablet' ? 'iPad' : 'iPhone';
    const model = modelFor(c.deviceType, index, 'iOS');
    return {
      testName: `${c.testName} — UA + HIGH UA-CH (override)`,
      navMock: mkNavMockWithUAChHigh(
        {
          ua: c.ua,
          brands,
          uaChPlatform: 'iOS',
          mobile: c.deviceType === 'mobile',
          navPlatform,
          innerWidth: c.width,
          innerHeight: c.height,
          dpr: c.pixelRatio,
          maxTouchPoints: c.maxTouchPoints,
          hardwareConcurrency: c.hardwareConcurrency,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          deviceMemory: c.deviceMemory,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          vendor: c.vendor,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          high: {
            architecture,
            bitness,
            platformVersion,
            fullVersion,
            formFactors,
            model,
          },
        },
        'ios'
      ),
      expect: expectedUAIOS({
        ua: c.ua,
        browser: c.browser,
        browserVersion: fullVersion,
        deviceType: c.deviceType,
        vendor: c.vendor,
        width: c.width,
        height: c.height,
        pixelRatio: c.pixelRatio,
        platformVersion,
        architecture,
        bitness,
        agentType: c.agentType,
        brands: c.uaChUndefinedBrands && c.uaLowCHUndefinedBrands ? [] : brands,
        formFactors: formFactors.length ? formFactors : undefined,
        model,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
      }),
    };
  }),
};

export const linuxWithHighUACh: deviceInfoTests = {
  sectionNo: '4.6',
  sectonName: 'Linux + UA-CH (HIGH, overrides UA)',
  test: LinuxCases.map((c, index) => {
    const brands = brandsFor(c.browser);
    const fullVersion = bumpVersion(c.browserVersion, DEFAULT_BROWSER_VERSION);
    const bitness = (c.bitness ??
      (c.architecture === 'x86' ? 32 : 64)) as Bitness;
    const architecture = c.architecture ?? (bitness === 32 ? 'x86' : 'x64');
    const platformVersion = makeHighPlatformVersion(
      c.platformVersion,
      bitness === 32 ? '5.4.0' : '6.8.0'
    );
    const baseFormFactors = formFactorsFor(c.deviceType);
    const formFactors =
      baseFormFactors ?? (c.deviceType === 'bot' ? [] : ['Desktop']);
    const navPlatform = bitness === 32 ? 'Linux i686' : 'Linux x86_64';
    const model = modelFor(c.deviceType, index, 'Linux');
    return {
      testName: `${c.testName} — UA + HIGH UA-CH (override)`,
      navMock: mkNavMockWithUAChHigh(
        {
          ua: c.ua,
          brands,
          uaChPlatform: 'Linux',
          mobile: false,
          navPlatform,
          innerWidth: c.width,
          innerHeight: c.height,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          dpr: c.pixelRatio,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          maxTouchPoints: c.maxTouchPoints,
          hardwareConcurrency: c.hardwareConcurrency,
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          deviceMemory: c.deviceMemory,
          vendor: c.vendor,
          high: {
            architecture,
            bitness,
            platformVersion,
            fullVersion,
            formFactors,
            model,
          },
        },
        'linux'
      ),
      expect: expectedLinuxOS({
        ua: c.ua,
        browser: c.browser,
        browserVersion: fullVersion,
        deviceType: c.deviceType,
        vendor: c.vendor,
        width: c.width,
        height: c.height,
        pixelRatio: c.pixelRatio,
        platformVersion,
        architecture,
        bitness,
        agentType: c.agentType,
        brands: c.uaChUndefinedBrands && c.uaLowCHUndefinedBrands ? [] : brands,
        formFactors: formFactors.length ? formFactors : [],
        model,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
      }),
    };
  }),
};
export const macosWithHighUACh: deviceInfoTests = {
  sectionNo: '4.7',
  sectonName: 'macOS + UA-CH (HIGH, overrides UA)',
  test: macOSCases.map((c, index) => {
    const brands = brandsFor(c.browser);
    const fullVersion = bumpVersion(c.browserVersion, DEFAULT_BROWSER_VERSION);
    const architecture = c.architecture ?? 'x64';
    const bitness = (c.bitness ?? 64) as Bitness;
    const platformVersion = makeHighPlatformVersion(
      c.platformVersion,
      c.platformVersion ?? '14.4.1'
    );
    const formFactors = formFactorsFor(c.deviceType) ?? ['Desktop'];
    const navPlatform = architecture.toLowerCase().includes('arm')
      ? 'MacARM64'
      : 'MacIntel';
    const model = modelFor(c.deviceType, index, 'macOS');
    return {
      testName: `${c.testName} — UA + HIGH UA-CH (override)`,
      navMock: mkNavMockWithUAChHigh(
        {
          ua: c.ua,
          brands,
          uaChPlatform: 'macOS',
          uaChUndefinedPlatform: c.uaChUndefinedPlatform ?? false,
          mobile: false,
          uaChUndefinedPlatformVersion: c.uaChUndefinedPlatformVersion ?? false,
          uaLowCHUndefinedBrands: c.uaLowCHUndefinedBrands ?? false,
          navPlatform,
          innerWidth: c.width,
          innerHeight: c.height,
          dpr: c.pixelRatio,
          maxTouchPoints: c.maxTouchPoints,
          hardwareConcurrency: c.hardwareConcurrency,
          deviceMemory: c.deviceMemory,
          vendor: c.vendor,
          platform: 'mac',
          uaChUndefinedBrands: c.uaChUndefinedBrands ?? false,
          high: {
            architecture,
            bitness,
            platformVersion,
            fullVersion,
            formFactors,
            model,
          },
        },
        'macos'
      ),
      expect: expectedUAMacOS({
        ua: c.ua,
        browser: c.browser,
        browserVersion: fullVersion,
        deviceType: c.deviceType,
        vendor: c.vendor,
        width: c.width,
        height: c.height,
        pixelRatio: c.pixelRatio,
        platformVersion,
        architecture,
        bitness,
        agentType: c.agentType,
        brands: c.uaChUndefinedBrands && c.uaLowCHUndefinedBrands ? [] : brands,
        formFactors: formFactors.length ? formFactors : undefined,
        model,
        maxTouchPoints: c.maxTouchPoints,
        hardwareConcurrency: c.hardwareConcurrency,
        deviceMemory: c.deviceMemory,
      }),
    };
  }),
};
export const platformMapsWithoutUaCH: { [key: string]: deviceInfoTests } = {
  windowsNoUACH: windowsTestsWithoutUACH,
  androidNoUACH: androidTestsWithoutUACH,
  chromeOSDesktopNoUACH: ChromeOSDesktopWithoutUACH,
  chromeOSTabletNoUACH: ChromeOSTabletWithoutUACH,
  iosNoUACH: iosWithoutUACH,
  linuxNoUACH: linuxWithoutUACH,
  macOSNoUACH: macosWithoutUACH,
};

export const platformMapsWithLowUaCh: { [key: string]: deviceInfoTests } = {
  windowsLowUACH: windowsWithLowUACh,
  androidLowUACH: androidWithLowUACh,
  iosLowUACH: iosWithLowUACh,
  linuxLowUACH: linuxWithLowUACh,
  chromeOSDesktopLowUACH: ChromeOSDeskTopWithLowUACh,
  chromeOSTabletLowUACH: ChromeOSTabletWithLowUACh,
  macOSLowUACH: macosWithLowUACh,
};
export const platformMapsWithHighUaCh: { [key: string]: deviceInfoTests } = {
  windowsHighUACH: windowsWithHighUACh,
  androidHighUACH: androidWithHighUACh,
  chromeOSDesktopHighUACH: chromeOSDesktopWithHighUACh,
  chromeOSTabletHighUACH: chromeOSTabletWithHighUACh,
  iosHighUACH: iosWithHighUACh,
  linuxHighUACH: linuxWithHighUACh,
  macOSHighUACH: macosWithHighUACh,
};
/* v8 ignore stop */
