// device-environment.service.spec.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  PLATFORM_ID,
  provideZonelessChangeDetection,
  signal,
  type Signal,
} from '@angular/core';

import { DeviceInfoService } from '../device-info/device-info.service';
import type { DeviceInfo } from '../../../models/device-info';
import { DeviceEnvironmentService } from './device-environment.service';

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

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

function createServiceWith(info: Partial<DeviceInfo>) {
  const stub = new DeviceInfoServiceStub(info);
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      DeviceEnvironmentService,
      provideZonelessChangeDetection(),
      { provide: PLATFORM_ID, useValue: 'browser' },
      { provide: DeviceInfoService, useValue: stub },
    ],
  });
  const svc = TestBed.inject(DeviceEnvironmentService);
  return { svc, stub };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('DeviceEnvironmentService', () => {
  describe('1) OS/Browser/UA/platform/vendor', () => {
    it('1.1 should expose OS & Browser metadata as signals', async () => {
      const { svc } = createServiceWith({
        os: 'Windows',
        osVersion: '11',
        browser: 'Chrome',
        browserVersion: '121.0.0.0',
        platform: 'Windows',
        vendor: 'Google Inc.',
        agentType: 'human',
        userAgent: 'Mozilla/5.0',
        screen: { width: 1920, height: 1080, pixelRatio: 1 },
        hardwareConcurrency: 12,
        deviceMemory: 32,
        bitness: undefined,
        architecture: undefined,
        model: undefined,
        formFactors: undefined,
        wow64: undefined,
      } as Partial<DeviceInfo>);

      await tick();
      await tick();
      await tick();
      expect(svc.browser()).toBe('Chrome');
      expect(svc.browserVersion()).toBe('121.0.0.0');

      expect(svc.platform()).toBe('Windows');
      expect(svc.vendor()).toBe('Google Inc.');
      expect(svc.userAgent()).toBe('Mozilla/5.0');
    });
  });

  describe('2) Screen & Hardware', () => {
    it('2.1 should expose screen, hardwareConcurrency, and deviceMemory', () => {
      const { svc } = createServiceWith({
        screen: { width: 1366, height: 768, pixelRatio: 1 },
        hardwareConcurrency: 8,
        deviceMemory: 16,
      } as Partial<DeviceInfo>);

      expect(svc.screen()).toEqual({
        width: 1366,
        height: 768,
        pixelRatio: 1,
        orientation: undefined,
      });
      expect(svc.hardwareConcurrency()).toBe(8);
      expect(svc.deviceMemory()).toBe(16);
    });
  });

  describe('3) High-entropy fields', () => {
    it('3.1 should pass through bitness/architecture/model/formFactors/wow64', () => {
      const { svc } = createServiceWith({
        bitness: '64',
        architecture: 'arm',
        model: 'Pixel Tablet',
        formFactors: ['Tablet'],
        wow64: false,
      } as Partial<DeviceInfo>);

      expect(svc.bitness()).toBe('64');
      expect(svc.architecture()).toBe('arm');
      expect(svc.model()).toBe('Pixel Tablet');
      expect(svc.formFactors()).toEqual(['Tablet']);
      expect(svc.wow64()).toBe(false);
    });
  });

  describe('4) Reactivity', () => {
    it('4.1 updates when underlying pick() signals change', () => {
      const { svc, stub } = createServiceWith({
        os: 'Windows',
        osVersion: '10',
        browser: 'Chrome',
        browserVersion: '120.0.0.0',
        platform: 'Windows',
        vendor: 'Google Inc.',
        userAgent: 'UA',
        screen: { width: 1280, height: 720, pixelRatio: 1 },
        hardwareConcurrency: 4,
        deviceMemory: 8,
      } as Partial<DeviceInfo>);

      // تغييرات
      stub.set('platform', 'Linux' as any);
      stub.set('platformVersion', '6.9.0' as any);
      stub.set('browser', 'Firefox' as any);
      stub.set('browserVersion', '124.0' as any);
      stub.set('screen', {
        width: 1920,
        height: 1080,
        pixelRatio: 2,
        orientation: null,
      } as any);

      expect(svc.platformVersion()).toBe('6.9.0');
      expect(svc.browser()).toBe('Firefox');
      expect(svc.browserVersion()).toBe('124.0');
      expect(svc.screen()).toEqual({
        width: 1920,
        height: 1080,
        pixelRatio: 2,
        orientation: null,
      });
    });
  });
});
