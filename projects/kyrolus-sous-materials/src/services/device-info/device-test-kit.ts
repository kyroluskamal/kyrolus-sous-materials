// test/utils/device-test-kit.ts
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { ClientInfo, UACHDataValues } from '../../models/device-info';
import { DeviceInfoService } from './device-info.service';

export type NavMockBits = {
  ua?: string;
  vendor?: string;
  client?: Partial<ClientInfo> ; // low-entropy
  he?: Partial<UACHDataValues>; // high-entropy (لو null يبقى مفيش HE)
  language?: string;
  languages?: readonly string[];
  webdriver?: boolean;
  pluginsCount?: number;
};

export async function createServiceWithNavigator(bits: NavMockBits) {
  const nav: any = {
    userAgent: bits.ua ?? '',
    vendor: bits.vendor ?? 'Google Inc.',
    language: bits.language ?? 'en-US',
    languages: bits.languages ?? ['en-US'],
    webdriver: bits.webdriver ?? false,
    plugins: { length: bits.pluginsCount ?? 3 },
  };

  if (bits.client) {
    nav.userAgentData = {
      brands: bits.client.brands,
      platform: bits.client.platform,
      mobile: bits.client.mobile,
      // لو عايز low-entropy بس خلّيها بترجع null
      getHighEntropyValues: async () => bits.he ?? null,
    };
  }

  // اربط navigator على window/jsdom
  Object.defineProperty(globalThis, 'navigator', {
    value: nav,
    configurable: true,
  });
  (globalThis as any).window ||= {} as any;
  Object.defineProperty(globalThis, 'window', {
    value: { ...globalThis.window, navigator: nav },
    configurable: true,
  });

  // optional: شاشة بسيطة تمنع undefined
  (globalThis as any).screen = (globalThis as any).screen ?? {
    width: 1200,
    height: 800,
    orientation: { type: 'landscape-primary', addEventListener() {} },
  };

  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [{ provide: PLATFORM_ID, useValue: 'browser' }, provideZonelessChangeDetection()],
  });

  const svc = TestBed.inject(DeviceInfoService);

  // إدّي فرصة للـ promiseToSignal إنه يحل الـ HE (لو موجود)
  await Promise.resolve();
  await new Promise((r) => setTimeout(r, 0));

  return svc;
}

// Helper صغير لتوقع اسم المتصفح من brand
export function expectedBrowserFromBrand(brand?: string): string | undefined {
  if (!brand) return undefined;
  const b = brand.toLowerCase();
  if (/edg/.test(b) || /edge/.test(b)) return 'Edge';
  if (/opr|opera/.test(b)) return 'Opera';
  if (/samsung/.test(b)) return 'Samsung Internet';
  if (/firefox|fxios/.test(b)) return 'Firefox';
  if (/yabrowser|yandex/.test(b)) return 'Yandex';
  if (/vivaldi/.test(b)) return 'Vivaldi';
  if (/brave/.test(b)) return 'Brave';
  if (/safari/.test(b)) return 'Safari';
  if (/chrome|chromium|google/.test(b)) return 'Chrome';
  return undefined;
}
