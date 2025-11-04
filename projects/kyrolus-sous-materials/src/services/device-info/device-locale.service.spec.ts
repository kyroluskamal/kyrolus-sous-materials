// projects/kyrolus-sous-materials/src/services/device-info/device-locale.service.spec.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  PLATFORM_ID,
  provideZonelessChangeDetection,
  signal,
  Signal,
} from '@angular/core';

import { DeviceLocaleService } from './device-locale.service';
import type { EnvLocaleOptions } from '../../models/device-info';

/* ================= Helpers ================= */

class DevInfoStub {
  lang$ = signal<string | undefined>(undefined);
  langs$ = signal<readonly string[] | undefined>(undefined);
  tz$ = signal<string | undefined>(undefined);

  setLanguage(v?: string) {
    this.lang$.set(v);
  }
  setLanguages(v?: readonly string[]) {
    this.langs$.set(v);
  }
  setTimeZone(v?: string) {
    this.tz$.set(v);
  }

  pick<K extends 'language' | 'languages' | 'timeZone'>(k: K): Signal<any> {
    if (k === 'language') return this.lang$ as any;
    if (k === 'languages') return this.langs$ as any;
    if (k === 'timeZone') return this.tz$ as any; // service uses 'timeZone'
    throw new Error('unexpected key: ' + k);
  }
}

function create(platform: 'browser' | 'server', stub = new DevInfoStub()) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: PLATFORM_ID, useValue: platform },
      {
        provide: require('./device-info.service').DeviceInfoService,
        useValue: stub,
      },
      DeviceLocaleService,
    ],
  });
  return { svc: TestBed.inject(DeviceLocaleService), stub };
}

// Replace Intl.DateTimeFormat and Intl.Locale for a test
const origDTF = Intl.DateTimeFormat;
const origLocale = (Intl as any).Locale;

function mockIntl(
  options: {
    ro?: Partial<Intl.ResolvedDateTimeFormatOptions>;
    throws?: boolean;
    localeRegion?: string; // region returned by Intl.Locale
  } = {}
) {
  (Intl as any).DateTimeFormat = function () {
    return {
      resolvedOptions() {
        if (options.throws) throw new Error('boom');
        return (options.ro ?? {}) as Intl.ResolvedDateTimeFormatOptions;
      },
    } as any;
  } as any;

  (Intl as any).Locale = class {
    region?: string;
    constructor(tag: string) {
      this.region = options.localeRegion;
    }
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  (Intl as any).DateTimeFormat = origDTF;
  (Intl as any).Locale = origLocale;
});

function setDocDir(val?: 'ltr' | 'rtl' | '') {
  const html = document.documentElement as any;
  const doc: any = document;
  html.dir = val ?? '';
  doc.dir = val ?? '';
}

/* ================= Tests ================= */

describe('DeviceLocaleService', () => {
  /* ---------- 1) SSR ---------- */
  describe('1) SSR', () => {
    it('1.1 returns undefined for localeOptions and null for direction', () => {
      const { svc } = create('server');
      expect(svc.localeOptions()).toBeUndefined();
      expect(svc.direction()).toBeNull();
    });
  });

  /* ---------- 2) Browser + Intl OK ---------- */
  describe('2) Browser + Intl OK', () => {
    it('2.1 full options via Intl', () => {
      mockIntl({
        ro: {
          locale: 'de-DE',
          timeZone: 'Europe/Berlin',
          calendar: 'gregory',
          numberingSystem: 'latn',
          hourCycle: 'h24',
          region: 'DE',
        } as any,
      });
      const { svc, stub } = create('browser');
      stub.setLanguage('en-GB');
      stub.setLanguages(['en-GB', 'ar-EG']);
      stub.setTimeZone('Europe/Madrid');

      const v = svc.localeOptions() as EnvLocaleOptions;
      expect(v).toEqual({
        locale: 'de-DE',
        calendar: 'gregory',
        hourCycle: 'h24',
        numberingSystem: 'latn',
        region: 'DE',
        timeZone: 'Europe/Berlin',
      });
    });

    it('2.2 hourCycle derived from hour12=true', () => {
      mockIntl({ ro: { hour12: true, locale: 'en-US' } as any });
      const { svc } = create('browser');
      const v = svc.localeOptions()!;
      expect(v.hourCycle).toBe<'h12'>('h12');
    });

    it('2.3 hourCycle derived from hour12=false', () => {
      mockIntl({ ro: { hour12: false, locale: 'en-US' } as any });
      const { svc } = create('browser');
      const v = svc.localeOptions()!;
      expect(v.hourCycle).toBe<'h23'>('h23');
    });

    it('2.4 hourCycle fallback to h23 when no hourCycle/hour12', () => {
      mockIntl({ ro: { locale: 'en-US' } as any });
      const { svc } = create('browser');
      expect(svc.localeOptions()!.hourCycle).toBe<'h23'>('h23');
    });

    it('2.5 timeZone fallback to service when Intl timeZone is undefined', () => {
      mockIntl({ ro: { locale: 'en-US' } as any });
      const { svc, stub } = create('browser');
      stub.setTimeZone('Asia/Dubai');
      expect(svc.localeOptions()!.timeZone).toBe('Asia/Dubai');
    });

    it('2.6 timeZone fallback to UTC when neither Intl nor service has tz', () => {
      mockIntl({ ro: { locale: 'en-US' } as any });
      const { svc } = create('browser');
      expect(svc.localeOptions()!.timeZone).toBe('UTC');
    });

    it('2.7 region from Intl.Locale(locale).region', () => {
      mockIntl({ ro: { locale: 'fr-FR' } as any, localeRegion: 'FR' });
      const { svc } = create('browser');
      expect(svc.localeOptions()!.region).toBe('FR');
    });

    it('2.8 region from regex parsing of locale tag', () => {
      mockIntl({ ro: { locale: 'en-US' } as any, localeRegion: undefined });
      const { svc } = create('browser');
      expect(svc.localeOptions()!.region).toBe('US');
    });

    it('2.9 no region at all ⇒ empty string', () => {
      mockIntl({ ro: { locale: 'en' } as any, localeRegion: undefined });
      const { svc } = create('browser');
      expect(svc.localeOptions()!.region).toBe('');
    });

    it('2.10 calendar/numberingSystem forced to string', () => {
      mockIntl({
        ro: {
          locale: 'en-US',
          calendar: 123 as any,
          numberingSystem: 456 as any,
        } as any,
      });
      const { svc } = create('browser');
      const v = svc.localeOptions()!;
      expect(typeof v.calendar).toBe('string');
      expect(typeof v.numberingSystem).toBe('string');
    });
    it('2.11 locale falls back to first item of languages[] when language is undefined', () => {
      // Intl without locale → forces fallback chain (language -> languages[0] -> 'en-US')
      mockIntl({ ro: {} as any, localeRegion: undefined });
      const { svc, stub } = create('browser');
      stub.setLanguage();
      stub.setLanguages(['es-ES', 'en-US']); // should be chosen
      expect(svc.localeOptions()!.locale).toBe('es-ES');
    });

    it('2.12 Intl.Locale throws ⇒ region falls back to regex parsing', () => {
      // Provide locale but make Intl.Locale(...) throw to hit the catch branch
      mockIntl({ ro: { locale: 'pt-BR' } as any, localeRegion: undefined });
      (Intl as any).Locale = class {//NOSONAR
        constructor(_: string) {
          throw new Error('boom');
        }
      } as any;

      const { svc } = create('browser');
      expect(svc.localeOptions()!.region).toBe('BR'); // regex fallback path
    });
    it('2.13 hourCycle respects explicit "h11"', () => {
      mockIntl({ ro: { locale: 'en-US', hourCycle: 'h11' } as any });
      const { svc } = create('browser');
      expect(svc.localeOptions()!.hourCycle).toBe<'h11'>('h11');
    });
    it('2.14 falls back to regex when Intl.Locale is unavailable', () => {
      // Intl provides locale but no Locale constructor → skip the try-branch entirely
      mockIntl({ ro: { locale: 'it-IT' } as any, localeRegion: undefined });

      // Remove Intl.Locale to hit the (!region && Intl?.Locale) === false path
      (Intl as any).Locale = undefined;

      const { svc } = create('browser');
      expect(svc.localeOptions()!.region).toBe('IT'); // regex fallback
    });
  });

  /* ---------- 3) Browser + Intl throws ---------- */
  describe('3) Browser + Intl throws', () => {
    it('3.1 safe fallback when DateTimeFormat.resolvedOptions throws', () => {
      mockIntl({ throws: true, localeRegion: undefined });
      const { svc, stub } = create('browser');
      stub.setLanguage('en-US');
      stub.setLanguages(['en-US']);
      stub.setTimeZone('America/New_York');

      const v = svc.localeOptions()!;
      expect(v.locale).toBe('en-US'); // from language fallback
      expect(v.timeZone).toBe('America/New_York'); // service tz fallback
      expect(v.hourCycle).toBe<'h23'>('h23'); // default path
      expect(v.region).toBe('US'); // regex path
      expect(v.calendar).toBe('gregory');
      expect(v.numberingSystem).toBe('latn');
    });
  });

  /* ---------- 4) Direction ---------- */
  describe('4) Direction', () => {
    it('4.1 respects document dir = rtl', () => {
      setDocDir('rtl');
      mockIntl({ ro: { locale: 'en-US' } as any });
      const { svc } = create('browser');
      expect(svc.direction()).toBe<'rtl'>('rtl');
    });

    it('4.2 respects document dir = ltr', () => {
      setDocDir('ltr');
      mockIntl({ ro: { locale: 'ar-EG' } as any });
      const { svc } = create('browser');
      expect(svc.direction()).toBe<'ltr'>('ltr');
    });

    it('4.3 infers from languages (RTL)', () => {
      setDocDir('');
      mockIntl({ ro: { locale: 'en-US' } as any });
      const { svc, stub } = create('browser');
      stub.setLanguages(['ar-EG', 'en-US']);
      expect(svc.direction()).toBe<'rtl'>('rtl');
    });

    it('4.4 infers from language (LTR) when languages missing', () => {
      setDocDir('');
      mockIntl({ ro: { locale: 'he-IL' } as any });
      const { svc, stub } = create('browser');
      stub.setLanguages();
      stub.setLanguage('en-US');
      expect(svc.direction()).toBe<'ltr'>('ltr');
    });

    it('4.5 default to ltr when nothing available', () => {
      setDocDir('');
      mockIntl({ ro: {} as any });
      const { svc } = create('browser');
      expect(svc.direction()).toBe<'ltr'>('ltr');
    });
    it('4.6 falls back to document.dir when <html dir> is absent', () => {
      mockIntl({ ro: { locale: 'en-US' } as any });

      // Make <html dir> resolve to undefined so the chain uses document.dir
      const html: any = document.documentElement;
      Object.defineProperty(html, 'dir', {
        configurable: true,
        get: () => undefined,
      });

      // Only document.dir is set
      (document as any).dir = 'rtl';

      const { svc } = create('browser');
      expect(svc.direction()).toBe<'rtl'>('rtl');
    });

    it('4.7 uses default empty-string branch when both html.dir and document.dir are undefined', () => {
      mockIntl({ ro: { locale: 'en-US' } as any });

      // Force both to be undefined so the chain hits the final '' literal
      const html: any = document.documentElement;
      Object.defineProperty(html, 'dir', {
        configurable: true,
        get: () => undefined,
      });
      Object.defineProperty(document as any, 'dir', {
        configurable: true,
        get: () => undefined,
      });

      const { svc, stub } = create('browser');
      // With no dirs, it will infer from languages; make it LTR by default
      stub.setLanguages();
      stub.setLanguage();
      expect(svc.direction()).toBe<'ltr'>('ltr');
    });it('4.8 languages drive direction when html.dir & document.dir are both undefined (rtl -> ltr on SAME instance)', () => {
      mockIntl({ ro: { locale: 'en-US' } as any });

      const html: any = document.documentElement;
      Object.defineProperty(html, 'dir', {
        configurable: true,
        get: () => undefined,
      });
      Object.defineProperty(document as any, 'dir', {
        configurable: true,
        get: () => undefined,
      });

      const { svc, stub } = create('browser');

      stub.setLanguages(['ar-EG']);
      expect(svc.direction()).toBe<'rtl'>('rtl');

      stub.setLanguages(['en-US']);
      expect(svc.direction()).toBe<'ltr'>('ltr');
    });

  });
});
