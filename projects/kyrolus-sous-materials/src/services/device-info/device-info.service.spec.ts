import { TestBed } from '@angular/core/testing';
import { DeviceInfoService } from './device-info.service';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import {
  platformMapsWithLowUaCh,
  platformMapsWithoutUaCH,
} from './mockups/platform-ua-tests';
import { deviceInfoTests } from './mockups/mockup-types';

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

describe('DeviceInfoService', () => {
  let service: DeviceInfoService;
  afterEach(() => cleanupNavMock());
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
      let section = platformMapsWithLowUaCh[key];
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
});
function writeTestsForOneSection(section: deviceInfoTests) {
  describe(`${section.sectionNo}. ${section.sectonName}`, () => {
    for (const [index, test] of section.test.entries()) {
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
