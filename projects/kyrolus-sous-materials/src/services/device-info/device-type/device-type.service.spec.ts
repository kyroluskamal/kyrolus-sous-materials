// projects/kyrolus-sous-materials/src/services/device-info/device-type.coverage.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { DeviceInfo } from 'projects/kyrolus-sous-materials/src/models/device-info';
import { DeviceInfoService } from '../device-info/device-info.service';
import { DeviceTypeService } from './device-type.service';


function stubEnv() {
  Object.defineProperty(globalThis.window, 'innerWidth', {
    configurable: true,
    get: () => 1200,
  });
  Object.defineProperty(globalThis.window, 'innerHeight', {
    configurable: true,
    get: () => 800,
  });
  Object.defineProperty(globalThis.window, 'devicePixelRatio', {
    configurable: true,
    get: () => 1,
  });
  vi.stubGlobal('screen', {
    width: 1200,
    height: 800,
    orientation: undefined,
  } as any);
  vi.stubGlobal('navigator', {
    userAgent: 'Mozilla/5.0',
    language: 'en-US',
    languages: ['en-US'],
    maxTouchPoints: 0,
  } as any);
}

function setup() {
  vi.unstubAllGlobals();
  stubEnv();
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      { provide: PLATFORM_ID, useValue: 'browser' },
      provideZonelessChangeDetection(),
      DeviceInfoService,
      DeviceTypeService,
    ],
  });
  const types = TestBed.inject(DeviceTypeService);
  const info = TestBed.inject(DeviceInfoService) ;
  return { types, info };
}

describe('DeviceTypeService branch coverage (single instance)', () => {
  it('flips deviceType/maxTouchPoints on the SAME instance (covers all branches)', () => {
    const { types, info } = setup();
    const mutate = (patch: Partial<DeviceInfo>) => {
      const curr = info['base']() ;
      info['base'].set({ ...curr, ...patch });
    };

    mutate({ deviceType: 'mobile', maxTouchPoints: 5 });
    expect(types.isMobile()).toBe(true);
    expect(types.isDesktop()).toBe(false);
    expect(types.isTablet()).toBe(false);
    expect(types.isHandheld()).toBe(true);
    expect(types.isTouchCapable()).toBe(true);

    mutate({ deviceType: 'mobile', maxTouchPoints: 0 });
    expect(types.isMobile()).toBe(true);
    expect(types.isTablet()).toBe(false);
    expect(types.isTouchCapable()).toBe(false);

    mutate({ deviceType: 'tablet', maxTouchPoints: undefined });
    expect(types.isTablet()).toBe(true);
    expect(types.isMobile()).toBe(false);
    expect(types.isDesktop()).toBe(false);
    expect(types.isHandheld()).toBe(true);
    expect(types.isTouchCapable()).toBe(true);

    mutate({ deviceType: 'desktop', maxTouchPoints: undefined });
    expect(types.isDesktop()).toBe(true);
    expect(types.isMobile()).toBe(false);
    expect(types.isTablet()).toBe(false);
    expect(types.isHandheld()).toBe(false);
    expect(types.isTouchCapable()).toBe(false);

    mutate({ deviceType: 'desktop', maxTouchPoints: 10 });
    expect(types.isDesktop()).toBe(true);
    expect(types.isMobile()).toBe(false);
    expect(types.isTouchCapable()).toBe(true);

    mutate({ deviceType: 'bot', maxTouchPoints: undefined });
    expect(types.isBot()).toBe(true);
    expect(types.isDesktop()).toBe(false);
    expect(types.isMobile()).toBe(false);
    expect(types.isTablet()).toBe(false);
    expect(types.isHandheld()).toBe(false);
    expect(types.isTouchCapable()).toBe(false);
  });
});
