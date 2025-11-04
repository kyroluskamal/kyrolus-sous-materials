import { afterEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';

import type { NetInfo } from '../../../models/device-info';
import { DeviceNetworkService } from './device-network.service';

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

function setNavigator(partial: any) {
  const base: any = typeof navigator === 'undefined' ? {} : navigator;
  vi.stubGlobal('navigator', { ...base, ...partial } as Navigator);
}

function setConnection(conn: FakeConnection | undefined) {
  setNavigator({
    connection: conn ?? undefined,
    mozConnection: undefined,
    webkitConnection: undefined,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('DeviceNetworkService (signals-only)', () => {
  describe('1) Init & SSR', () => {
    it('1.1 SSR ⇒ online=true by default; info undefineds', () => {
      const svc = createService('server');
      expect(svc.online()).toBe(true);
      expect(svc.info()).toEqual({
        effectiveType: undefined,
        saveData: undefined,
        downlink: undefined,
        rtt: undefined,
      });
    });

    it('1.2 Browser without navigator.connection ⇒ reads onLine; default info', () => {
      setNavigator({ onLine: false });
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

  describe('2) Online/Offline reactivity', () => {
    it('2.1 reacts to window online/offline events', async () => {
      setNavigator({ onLine: true });
      const svc = createService('browser');

      expect(svc.online()).toBe(true);
      (navigator as any).onLine = false;
      globalThis.window.dispatchEvent(new Event('offline'));
      await Promise.resolve();
      expect(svc.online()).toBe(false);

      (navigator as any).onLine = true;
      globalThis.window.dispatchEvent(new Event('online'));
      await Promise.resolve();
      expect(svc.online()).toBe(true);
    });
  });

  describe('3) Connection info (supported)', () => {
    it('3.1 reads properties and updates on "change"', async () => {
      setNavigator({ onLine: true });
      const conn = new FakeConnection('4g', false, 10, 50);
      setConnection(conn);
      const svc = createService('browser');

      expect(svc.info()).toEqual({
        effectiveType: '4g',
        saveData: false,
        downlink: 10,
        rtt: 50,
      });

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

    it('3.2 unknown effectiveType ⇒ normalized to "unknown"', async () => {
      setNavigator({ onLine: true });
      const conn = new FakeConnection('wifi-6e', false, 100, 20);
      setConnection(conn);
      const svc = createService('browser');

      expect(svc.info().effectiveType).toBe<'unknown'>('unknown');

      conn.set({ effectiveType: '2g' });
      await Promise.resolve();
      expect(svc.info().effectiveType).toBe<'2g'>('2g');

      conn.set({ effectiveType: 'super-5g' as any });
      await Promise.resolve();
      expect(svc.info().effectiveType).toBe<'unknown'>('unknown');
    });

    it('3.3 supports mozConnection when connection is absent', () => {
      const conn = new FakeConnection('4g', false, 10, 50);
      setNavigator({ onLine: true, mozConnection: conn });
      const svc = createService('browser');

      expect(svc.info()).toEqual({
        effectiveType: '4g',
        saveData: false,
        downlink: 10,
        rtt: 50,
      });
    });

    it('3.4 type-mismatch ⇒ invalid fields normalized to undefined (but effectiveType kept)', () => {
      setNavigator({ onLine: true });
      const bad = new FakeConnection(
        '4g',
        'yes' as any,
        '10' as any,
        null as any
      );
      setConnection(bad);
      const svc = createService('browser');

      expect(svc.info()).toEqual({
        effectiveType: '4g',
        saveData: undefined,
        downlink: undefined,
        rtt: undefined,
      });
    });
    it('3.5 accepts "slow-2g" as a valid effectiveType', async () => {
      setNavigator({ onLine: true });
      const conn = new FakeConnection('slow-2g', false, 0.1, 1200);
      setConnection(conn);
      const svc = createService('browser');

      expect(svc.info().effectiveType).toBe<'slow-2g'>('slow-2g');

      conn.set({ effectiveType: '4g' });
      await Promise.resolve();
      expect(svc.info().effectiveType).toBe<'4g'>('4g');
    });
  });

  describe('4) Safety & fallbacks', () => {
    it('4.1 missing navigator.onLine ⇒ falls back to true', () => {
      setNavigator({});
      const svc = createService('browser');
      expect(svc.online()).toBe(true);
    });

    it('4.2 no connection object at all ⇒ info stays default', () => {
      setNavigator({ onLine: true });
      setConnection(undefined);
      const svc = createService('browser');

      expect(svc.info()).toEqual({
        effectiveType: undefined,
        saveData: undefined,
        downlink: undefined,
        rtt: undefined,
      });
    });

    it('4.3 getter throws while reading navigator.connection ⇒ safe fallback', () => {
      const nav: any = {};
      Object.defineProperty(nav, 'connection', {
        get() {
          throw new Error('boom');
        },
      });
      vi.stubGlobal('navigator', nav);

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
