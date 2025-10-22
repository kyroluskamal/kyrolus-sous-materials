import { TestBed } from '@angular/core/testing';
import { DeviceInfoService } from './device-info.service';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import {
  platformMapsWithHighUaCh,
  platformMapsWithLowUaCh,
  platformMapsWithoutUaCH,
} from './mockups/platform-ua-tests';
import { deviceInfoTests } from './mockups/mockup-types';

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

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
      // مثال FreeBSD:
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

          expect(srv.device()).toMatchObject(test.expect);
        });
      } else
        it(`${section.sectionNo}.${index + 1}. ${test.testName}`, () => {
          runNavMock(test.navMock);
          const srv = createServiceFromBasedonPltrom('browser');
          expect(srv.device()).toMatchObject(test.expect);
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
