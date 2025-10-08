import { TestBed } from '@angular/core/testing';
import { DeviceInfoService } from './device-info.service';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { platformMapsWithoutUaCH } from './mockups/platform-ua-tests';

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

describe('DeviceInfoService', () => {
  let service: DeviceInfoService;
  function browsersOnPlatformTests(
    testNumber: string,
    testName: string,
    ua: string,
    browser: string,
    version = '124.0.0.0',
    platform = 'Windows',
    deviceType = 'desktop'
  ) {
    it(`${testNumber} ${testName}`, () => {
      vi.stubGlobal('navigator', fillNavigator(ua));
      service = createServiceFromBasedonPltrom('browser');
      expect(service.device()).toMatchObject(
        objectToMatch(ua, version, browser, platform, deviceType)
      );
    });
  }

  describe('1. Test on SSR', () => {
    it('1.1. should return default invide value if the platform is server', () => {
      const service = createServiceFromBasedonPltrom('server');
      //@ts-expect-error : private member
      expect(service.device()).toMatchObject(service.base());
    });
  });

  describe('2. UA only without UA-CH', () => {
    let keys = Object.keys(platformMapsWithoutUaCH);
    keys.forEach((key) => {
      let section = platformMapsWithoutUaCH[key];
      describe(`${section.sectionNo}. ${section.sectonName}`, () => {
        section.test.forEach((test, index) => {
          it(`${section.sectionNo}.${index + 1}. ${test.testName}`, () => {
            runNavMock(test.navMock);
            const srv = createServiceFromBasedonPltrom('browser');
            expect(srv.device()).toMatchObject(test.expect);
          });
        });
      });
    });
  });
});

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
function fillNavigator(userAgent: string, userAgentData?: any) {
  return {
    userAgent,
    userAgentData,
    language: 'en-US',
    languages: ['en-US', 'es-ES'],
  };
}
function objectToMatch(
  UA: string,
  browserVersion: string,
  browser: string = 'Chrome',
  platform: string = 'Windows',
  deviceType: string = 'desktop',
  language: string = 'en-US',
  languages: string[] = ['en-US', 'es-ES']
) {
  return {
    userAgent: UA,
    agentType: 'human',
    platform: platform,
    browser: browser,
    browserVersion: browserVersion,
    deviceType: deviceType,
    language: language,
    languages: languages,
  };
}
export const runNavMock = (code: string) => {
  // ينفّذ سترنج الكود اللى جوّه navMock (فيه spyOn/defineProperty)
  // vitest بيعرّف vi/window/navigator/Intl جلوبال في jsdom
  // فمجرد التنفيذ كفاية
  // eslint-disable-next-line no-new-func
  new Function(code)();
};

// تنظيف قياسي بعد كل تيست
export const cleanupNavMock = () => {
  vi.restoreAllMocks();
  // لو النسخة عندك فيها:
  vi.unstubAllGlobals?.();
};
