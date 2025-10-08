import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';

import { DeviceTypeService } from './device-type.service';
import { DeviceInfoService } from './device-info.service';
import type { DeviceInfo } from '../../models/device-info';

/* ===== Stub لِـ DeviceInfoService يعرض pick() كسجنال ===== */
class DeviceInfoServiceStub {
  constructor(private readonly info: DeviceInfo) {}
  pick<K extends keyof DeviceInfo>(key: K) {
    return signal(this.info[key] as any);
  }
}

/* ===== Helper لإنشاء الخدمة مع Info مخصّص ===== */
function createServiceWith(info: DeviceInfo) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      DeviceTypeService,
      provideZonelessChangeDetection(),
      { provide: DeviceInfoService, useValue: new DeviceInfoServiceStub(info) },
    ],
  });
  return TestBed.inject(DeviceTypeService);
}

/* ===== عينات بيانات ===== */
const MOBILE_INFO: DeviceInfo = {
  userAgent: 'ua',
  vendor: 'vendor',
  platform: 'Android',
  deviceType: 'mobile',
  platformVersion: '14',
  browser: 'Chrome',
  browserVersion: '124.0.0.0',
  language: 'en-US',
  languages: ['en-US'],
  timezone: 'UTC',
  screen: { width: 390, height: 844, pixelRatio: 3, orientation: undefined },
  hardwareConcurrency: 8,
  deviceMemory: 6,
  bitness: undefined,
  architecture: undefined,
  formFactors: undefined,
  model: undefined,
  wow64: undefined,
};


const BOT_INFO: DeviceInfo = {
  userAgent: 'Crawler',
  vendor: undefined,
  platform: 'Windows',
  deviceType: 'bot',
  browser: 'Unknown',
  browserVersion: undefined,
  language: undefined,
  languages: [],
  timezone: undefined,
  screen: { width: 390, height: 844, pixelRatio: 3, orientation: undefined },
  deviceMemory: undefined,
  bitness: undefined,
  architecture: undefined,
  formFactors: undefined,
  model: undefined,
  wow64: false,
};

describe('DeviceTypeService (Signals-only)', () => {
  describe('1) handheld & desktop flags', () => {
    it('1.1 mobile ⇒ handheld=true, desktop=false', () => {
      const s = createServiceWith(MOBILE_INFO);
      expect(s.deviceType()).toBe('mobile');
      expect(s.isMobile()).toBe(true);
      expect(s.isTablet()).toBe(false);
      expect(s.isHandheld()).toBe(true);
      expect(s.isDesktop()).toBe(false);
      expect(s.isBot()).toBe(false);
      expect(s.isTouchCapable()).toBe(true);
    });
  });

  describe('2) bot flags', () => {
    it('2.1 bot ⇒ isBot=true والباقي false', () => {
      const s = createServiceWith(BOT_INFO);
      expect(s.deviceType()).toBe('bot');
      expect(s.isMobile()).toBe(false);
      expect(s.isTablet()).toBe(false);
      expect(s.isHandheld()).toBe(false);
      expect(s.isDesktop()).toBe(false);
      expect(s.isBot()).toBe(true);
      expect(s.isTouchCapable()).toBe(false);
    });
  });
});
