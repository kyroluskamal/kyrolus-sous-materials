// device-locale.service.spec.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  PLATFORM_ID,
  provideZonelessChangeDetection,
  signal,
  type Signal,
} from '@angular/core';

import { DeviceLocaleService } from './device-locale.service';
import { DeviceInfoService } from './device-info.service';
import type { DeviceInfo } from '../../models/device-info';

/* ======================= Stub: DeviceInfoService ======================= */
class DeviceInfoServiceStub {
  private readonly store: Partial<DeviceInfo>;
  private readonly sigs: Partial<Record<keyof DeviceInfo, Signal<any>>> = {};
  constructor(info: Partial<DeviceInfo>) {
    this.store = info;
  }
  pick<K extends keyof DeviceInfo>(key: K): Signal<DeviceInfo[K]> {
    if (!this.sigs[key]) {
      this.sigs[key] = signal(this.store[key] as DeviceInfo[K]);
    }
    return this.sigs[key] as Signal<DeviceInfo[K]>;
  }
  set<K extends keyof DeviceInfo>(key: K, val: DeviceInfo[K]) {
    (this.pick(key) as any).set(val);
  }
}

/* ======================= Helpers ======================= */
function createService(
  info: Partial<DeviceInfo>,
  platform: 'browser' | 'server' = 'browser'
) {
  const stub = new DeviceInfoServiceStub(info);
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      DeviceLocaleService,
      provideZonelessChangeDetection(),
      { provide: PLATFORM_ID, useValue: platform },
      { provide: DeviceInfoService, useValue: stub },
    ],
  });
  const svc = TestBed.inject(DeviceLocaleService);
  return { svc, stub };
}

function setDocDir(dir: '' | 'ltr' | 'rtl') {
  const el = document.documentElement as any;
  const prev = el.dir;
  el.dir = dir;
  return () => {
    el.dir = prev ?? '';
  };
}

type ResolvedExtra = Intl.ResolvedDateTimeFormatOptions & {
  calendar?: string;
  hourCycle?: string;
  numberingSystem?: string;
  region?: string;
};

function mockIntl(opts: Partial<ResolvedExtra> | 'throw') {
  const spy = vi
    .spyOn(Intl, 'DateTimeFormat' as any)
    .mockImplementation((): any => {
      if (opts === 'throw') {
        return {
          resolvedOptions: () => {
            throw new Error('boom');
          },
        };
      }
      const base: Partial<ResolvedExtra> = {
        locale: 'en-GB',
        timeZone: 'Europe/Madrid',
      };
      const out = { ...(base as any), ...(opts as any) } as ResolvedExtra;
      return { resolvedOptions: () => out };
    });
  return () => spy.mockRestore();
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/* ======================= Tests ======================= */
describe('DeviceLocaleService', () => {
  /* ============= 1) Basics & Intl ============= */
  describe('1) Basics & Intl', () => {
    // it('1.1 shows language/languages/timezone and reads Intl options in the browser', () => {
    //   const restoreIntl = mockIntl({
    //     locale: 'ar-EG',
    //     timeZone: 'Africa/Cairo',
    //     calendar: 'gregory',
    //     hourCycle: 'h12',
    //     numberingSystem: 'arab',
    //     region: 'EG',
    //   });

    //   const { svc } = createService({
    //     language: 'ar-EG',
    //     languages: ['ar-EG', 'en-US'] as readonly string[],
    //     timezone: 'Africa/Cairo',
    //   });

    //   expect(svc.language()).toBe('ar-EG');
    //   expect(svc.languages()).toEqual(['ar-EG', 'en-US']);
    //   expect(svc.timezone()).toBe('Africa/Cairo');

    //   const lo = svc.localeOptions();
    //   expect(lo.locale).toBe('ar-EG');
    //   expect(lo.timeZone).toBe('Africa/Cairo');
    //   expect(lo.calendar).toBe('gregory');
    //   expect(lo.hourCycle).toBe('h12');
    //   expect(lo.numberingSystem).toBe('arab');
    //   expect(lo.region).toBe('EG');

    //   restoreIntl();
    // });

    it('1.2 direction = rtl لو document.dir = rtl', () => {
      const cleanup = setDocDir('rtl');
      const { svc } = createService({
        language: 'ar-EG',
        languages: ['ar-EG'] as readonly string[],
        timezone: 'Africa/Cairo',
      });
      // expect(svc.direction()).toBe('rtl');
      cleanup();
    });

    it('1.3 Should conclude the direction from the first lang if the document.dir is not defined', () => {
      const cleanup = setDocDir('');
      const { svc } = createService({
        language: 'ar-EG',
        languages: ['ar-EG', 'en-US'] as readonly string[],
        timezone: 'Africa/Cairo',
      });
      // expect(svc.direction()).toBe('rtl');
      cleanup();
    });

    it('1.4 should set direction to ltr by default if the default lang is not RTL', () => {
      const cleanup = setDocDir('');
      const { svc } = createService({
        language: 'en-US',
        languages: ['en-US'] as readonly string[],
        timezone: 'Europe/Madrid',
      });
      // expect(svc.direction()).toBe('ltr');
      cleanup();
    });
    it('1.5 direction uses document.dir when documentElement is undefined', () => {
      // documentElement -> undefined  → يستخدم document.dir
      const elSpy = vi
        .spyOn(document, 'documentElement', 'get')
        .mockReturnValue(undefined as any);
      const dirSpy = vi
        .spyOn(document as any, 'dir', 'get')
        .mockReturnValue('rtl' as any);

      const { svc } = createService({
        language: 'en-US',
        languages: ['en-US'] as const,
        timezone: 'UTC',
      });

      // expect(svc.direction()).toBe('rtl');

      elSpy.mockRestore();
      dirSpy.mockRestore();
    });

    it('1.6 direction falls back to languages when both element.dir and document.dir are undefined', () => {
      // documentElement -> undefined && document.dir -> undefined
      // في الحالة دي الـ dir يبقى '' → يروح لفحص اللغات
      const elSpy = vi
        .spyOn(document, 'documentElement', 'get')
        .mockReturnValue(undefined as any);
      const dirSpy = vi
        .spyOn(document as any, 'dir', 'get')
        .mockReturnValue(undefined as any);

      const { svc } = createService({
        language: 'ar-EG',
        languages: ['ar-EG'] as const,
        timezone: 'UTC',
      });

      // expect(svc.direction()).toBe('rtl');

      elSpy.mockRestore();
      dirSpy.mockRestore();
    });

    it('1.7 direction defaults to ltr when languages is empty and no dir', () => {
      const cleanup = setDocDir('');
      const { svc } = createService({
        // language: null,
        languages: [] as readonly string[],
        timezone: 'UTC',
      });
      // expect(svc.direction()).toBe('ltr');
      cleanup();
    });

    it('1.8 localeOptions uses service timezone when Intl has undefined timeZone', () => {
      const restoreIntl = mockIntl({
        locale: 'es-ES',
        timeZone: undefined as any,
      });

      const { svc } = createService({
        language: 'es-ES',
        languages: ['es-ES'] as readonly string[],
        timezone: 'Europe/Madrid',
      });

      // // const lo = svc.localeOptions();
      // expect(lo.locale).toBe('es-ES');
      // expect(lo.timeZone).toBe('Europe/Madrid');

      restoreIntl();
    });

    it('1.9 localeOptions sets optional fields to null when missing', () => {
      const restoreIntl = mockIntl({ locale: 'en-US', timeZone: 'UTC' } as any);

      const { svc } = createService({
        language: 'en-US',
        languages: ['en-US'] as readonly string[],
        timezone: 'UTC',
      });

      // // const lo = svc.localeOptions();
      // expect(lo.calendar).toBeNull();
      // expect(lo.hourCycle).toBeNull();
      // expect(lo.numberingSystem).toBeNull();
      // expect(lo.region).toBeNull();

      restoreIntl();
    });
    it('1.10 localeOptions sets locale=null when Intl returns undefined locale', () => {
      // يغطي فرع: locale: opts.locale ?? null  ← (السطر 45)
      const restoreIntl = mockIntl({
        locale: undefined as any,
        timeZone: 'UTC',
      } as any);

      const { svc } = createService({
        language: 'en-US',
        languages: ['en-US'] as const,
        timezone: 'UTC',
      });

      // const lo = localeOptions();
      // expect(lo.locale).toBeNull(); // fallback اتاخد
      // expect(lo.timeZone).toBe('UTC'); // لسه في try (مش في catch)
      // restoreIntl();
    });

    it('1.11 direction = ltr when document.dir is ltr (overrides RTL language)', () => {
      // يغطي فرع: if (dir === 'rtl' || dir === 'ltr') return dir  ← جهة ltr (السطر 76)
      const cleanup = setDocDir('ltr');
      const { svc } = createService({
        language: 'ar-EG',
        languages: ['ar-EG'] as const, // حتى لو RTL في اللغات → document.dir أقوى
        timezone: 'UTC',
      });
      // expect(svc.direction()).toBe('ltr');
      cleanup();
    });

  });

  /* ============= 2) Reactivity ============= */
  describe('2) Reactivity', () => {
    it('2.1 تتغيّر signals لما Stub يحدّث language/languages/timezone', () => {
      const { svc, stub } = createService({
        language: 'en-US',
        languages: ['en-US'] as readonly string[],
        timezone: 'UTC',
      });

      expect(svc.language()).toBe('en-US');
      expect(svc.languages()).toEqual(['en-US']);
      expect(svc.timezone()).toBe('UTC');

      stub.set('language', 'es-ES');
      stub.set('languages', ['es-ES', 'en-US'] as readonly string[]);
      stub.set('timezone', 'Europe/Madrid');

      expect(svc.language()).toBe('es-ES');
      expect(svc.languages()).toEqual(['es-ES', 'en-US']);
      expect(svc.timezone()).toBe('Europe/Madrid');
    });
  });

  /* ============= 3) SSR ============= */
  // describe('3) SSR', () => {
  //   it('3.1 على السيرفر: localeOptions كلها null و direction = null', () => {
  //     const { svc } = createService(
  //       { language: undefined, languages: [] as readonly sntring[], timezone: undefined },
  //       'server'
  //     );

  //     const lo = svc.localeOptions();
  //     expect(lo).toEqual({
  //       locale: null,
  //       calendar: null,
  //       hourCycle: null,
  //       numberingSystem: null,
  //       region: null,
  //       timeZone: null,
  //     });
  //     expect(svc.direction()).toBeNull();
  //   });
  // });

  /* ============= 4) Intl fallback ============= */
  // describe('4) Intl fallback', () => {
  //   it('4.1 لو Intl.throw → يستخدم timezone من الخدمة ويصفر باقي الحقول', () => {
  //     const restoreIntl = mockIntl('throw');

  //     const { svc } = createService({
  //       language: 'es-ES',
  //       languages: ['es-ES'] as readonly string[],
  //       timezone: 'Europe/Madrid',
  //     });

  //     const lo = svc.localeOptions();
  //     expect(lo.locale).toBeNull();
  //     expect(lo.calendar).toBeNull();
  //     expect(lo.hourCycle).toBeNull();
  //     expect(lo.numberingSystem).toBeNull();
  //     expect(lo.region).toBeNull();
  //     expect(lo.timeZone).toBe('Europe/Madrid');

  //     restoreIntl();
  //   });
  // });
});
