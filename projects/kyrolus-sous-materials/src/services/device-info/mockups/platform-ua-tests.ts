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
  deviceInfoTests,
  ExpectedArgs,
  expectedUA,
  isChromiumUA,
  mkNavMockWithUAChHigh,
  mkNavMockWithUAChLow,
  mkUAMockFull,
} from './device-info-mockup-kits';

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
            brands,
            uaChPlatform: 'Windows',
            mobile: false,
            navPlatform: 'Win32',
            brave: c.browser.toLowerCase() === 'brave',
            innerWidth: c.width,
            innerHeight: c.height,
            dpr: c.pixelRatio,
            maxTouchPoints: c.maxTouchPoints,
            hardwareConcurrency: c.hardwareConcurrency,
            deviceMemory: c.deviceMemory,
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

export const windowsWithHighUACh: deviceInfoTests = {
  sectionNo: '4.1',
  sectonName: 'Windows + UA-CH (HIGH, overrides UA)',
  test: windowsTestCases
    .filter((c) => isChromiumUA(c.ua))
    .map((c) => {
      const brands = brandsFor(c.browser);
      const high = {
        wow64: /WOW64/i.test(c.ua) || c.wow64 === true || false,
        bitness: (/WOW64/i.test(c.ua) || c.bitness === 32 ? 32 : 64) as Bitness,
        architecture:
          /WOW64/i.test(c.ua) || c.architecture === 'x86'
            ? ('x86' as any)
            : ('x64' as any),
        platformVersion: '10.0.0',
        fullVersion: c.browserVersion ?? '125.0.0.0',
        formFactors: ['Desktop'],
      };
      return {
        testName: `${c.testName} — UA + HIGH UA-CH (override)`,
        navMock: mkNavMockWithUAChHigh(
          {
            ua: c.ua,
            brands,
            uaChPlatform: 'Windows',
            mobile: false,
            navPlatform: 'Win32',
            brave: c.browser.toLowerCase() === 'brave',
            innerWidth: c.width,
            innerHeight: c.height,
            dpr: c.pixelRatio,
            maxTouchPoints: c.maxTouchPoints,
            hardwareConcurrency: c.hardwareConcurrency,
            deviceMemory: c.deviceMemory,
            vendor: c.vendor,
            high,
          },
          'windows'
        ),
        expect: expectedUAWindows({
          ua: c.ua,
          browser: c.browser,
          browserVersion: high.fullVersion,
          deviceType: c.deviceType,
          vendor: c.vendor,
          width: c.width,
          height: c.height,
          pixelRatio: c.pixelRatio,
          platformVersion: '10/11',
          architecture: high.architecture,
          bitness: high.bitness,
          wow64: high.wow64,
          brands,
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
};

export const platformMapsWithLowUaCh: { [key: string]: deviceInfoTests } = {
  windowsLowUACH: windowsWithLowUACh,
};
export const platformMapsWithHighUaCh: { [key: string]: deviceInfoTests } = {
  windowsHighUACH: windowsWithHighUACh,
};
