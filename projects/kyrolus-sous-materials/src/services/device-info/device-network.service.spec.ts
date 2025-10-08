// device-network.service.spec.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';

import { DeviceNetworkService } from './device-network.service';
import type { NetInfo } from '../../models/device-info';

/* ================= Helpers ================= */

function createService(platform: 'browser' | 'server' = 'browser') {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      DeviceNetworkService,
      provideZonelessChangeDetection(),
      { provide: PLATFORM_ID, useValue: platform },
    ],
  });
  return TestBed.inject(DeviceNetworkService);
}

class FakeConnection extends EventTarget {
  constructor(
    public effectiveType: string | undefined,
    public saveData: boolean | undefined,
    public downlink: number | undefined,
    public rtt: number | undefined
  ) {
    super();
  }
  set(
    values: Partial<
      Pick<NetInfo, 'effectiveType' | 'saveData' | 'downlink' | 'rtt'>
    >
  ) {
    if ('effectiveType' in values)
      this.effectiveType = values.effectiveType as any;
    if ('saveData' in values) this.saveData = values.saveData as any;
    if ('downlink' in values) this.downlink = values.downlink as any;
    if ('rtt' in values) this.rtt = values.rtt as any;
    this.dispatchEvent(new Event('change'));
  }
}

function stubNavigator(obj: any) {
  vi.stubGlobal('navigator', obj as Navigator);
}

function stubConnOnNavigator(conn: FakeConnection | undefined) {
  const base: any = typeof navigator === 'undefined' ? {} : navigator;
  stubNavigator({
    ...base,
    connection: conn ?? undefined,
    mozConnection: undefined,
    webkitConnection: undefined,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/* ================= Tests ================= */

describe('DeviceNetworkService (Signals-only)', () => {
  /* ============ 1) Init & SSR ============ */
  describe('1) Init & SSR', () => {
    it('1.1 SSR: online=true الافتراضي و info كلها undefined', () => {
      const svc = createService('server');
      expect(svc.online()).toBe(true);
      expect(svc.info()).toEqual({
        effectiveType: undefined,
        saveData: undefined,
        downlink: undefined,
        rtt: undefined,
      });
    });

    it('1.2 Browser بدون navigator.connection: يقرأ navigator.onLine ويعيد info افتراضي', () => {
      stubNavigator({ onLine: false } as any);
      const svc = createService('browser');
      expect(svc.online()).toBe(false);
      expect(svc.info()).toEqual({
        effectiveType: undefined,
        saveData: undefined,
        downlink: undefined,
        rtt: undefined,
      });
    });
  });

  /* ============ 2) online/offline reactivity ============ */
  describe('2) Online/Offline reactivity', () => {
    it('2.1 يتفاعل مع أحداث window online/offline', async () => {
      stubNavigator({ onLine: true } as any);
      const svc = createService('browser');

      // يبدأ true
      expect(svc.online()).toBe(true);

      // غيّر قيمة onLine واطلق الحدث
      (navigator as any).onLine = false;
      window.dispatchEvent(new Event('offline'));
      await Promise.resolve();
      expect(svc.online()).toBe(false);

      (navigator as any).onLine = true;
      window.dispatchEvent(new Event('online'));
      await Promise.resolve();
      expect(svc.online()).toBe(true);
    });
  });

  /* ============ 3) navigator.connection supported ============ */
  describe('3) Connection info (supported)', () => {
    it('3.1 يقرأ الخصائص ويحدّثها عند change', async () => {
      // online حالته مش مهمة هنا، بس نخليها true
      stubNavigator({ onLine: true } as any);

      // Fake connection مدعوم
      const conn = new FakeConnection('4g', false, 10, 50);
      stubConnOnNavigator(conn);

      const svc = createService('browser');

      // initial read
      expect(svc.info()).toEqual({
        effectiveType: '4g',
        saveData: false,
        downlink: 10,
        rtt: 50,
      });

      // update -> dispatch 'change'
      conn.set({
        effectiveType: '3g',
        saveData: true,
        downlink: 1.5,
        rtt: 300,
      });
      await Promise.resolve();

      expect(svc.info()).toEqual({
        effectiveType: '3g',
        saveData: true,
        downlink: 1.5,
        rtt: 300,
      });
    });

    it('3.2 effectiveType غير معروف ⇒ يتحوّل إلى "unknown"', async () => {
      stubNavigator({ onLine: true } as any);
      const conn = new FakeConnection('wifi-6e', false, 100, 20); // قيمة غريبة
      stubConnOnNavigator(conn);

      const svc = createService('browser');

      // القراءة الأولية تُحوِّل القيمة الغريبة لـ 'unknown'
      expect(svc.info().effectiveType).toBe<'unknown'>('unknown');

      // رجّعها لقيمة موثقة ثم غيّرها لغريبة
      conn.set({ effectiveType: '2g' });
      await Promise.resolve();
      expect(svc.info().effectiveType).toBe<'2g'>('2g');

      conn.set({ effectiveType: 'super-5g' as any });
      await Promise.resolve();
      expect(svc.info().effectiveType).toBe<'unknown'>('unknown');
    });
  });

  /* ============ 4) Safety & fallbacks ============ */
  describe('4) Safety & fallbacks', () => {
    it('4.1 لو navigator.onLine غير متاح، ي fallback إلى true بدون كراش', () => {
      // onLine غير معرف
      stubNavigator({} as any);
      const svc = createService('browser');
      expect(svc.online()).toBe(true);
    });

    it('4.2 عند غياب connection تمامًا يظل info ثابتًا على undefineds', () => {
      stubNavigator({ onLine: true } as any);
      stubConnOnNavigator(undefined);
      const svc = createService('browser');
      expect(svc.info()).toEqual({
        effectiveType: undefined,
        saveData: undefined,
        downlink: undefined,
        rtt: undefined,
      });
    });
  });
});
