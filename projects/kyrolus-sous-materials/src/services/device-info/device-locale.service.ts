import {
  Injectable,
  Signal,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DeviceInfoService } from './device-info.service';
import { EnvLocaleOptions } from '../../models/device-info';

// ===== Type محلي لخيارات الـ locale =====

@Injectable({ providedIn: 'root' })
export class DeviceLocaleService {
  private readonly dev = inject(DeviceInfoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly language: Signal<string | undefined> = this.dev.pick('language');
  readonly languages: Signal<readonly string[] | undefined> = this.dev.pick('languages');
  readonly timezone: Signal<string | undefined> = this.dev.pick('timezone');

  // readonly localeOptions: Signal<EnvLocaleOptions | undefined> = computed(() => {
  //   if (!this.isBrowser) {
  //     return {
  //       locale: null,
  //       calendar: null,
  //       hourCycle: null,
  //       numberingSystem: null,
  //       region: null,
  //       timeZone: null,
  //     };
  //   }
  //   try {
  //     const opts =
  //       Intl.DateTimeFormat().resolvedOptions() as Intl.ResolvedDateTimeFormatOptions & {
  //         calendar?: string;
  //         hourCycle?: string;
  //         numberingSystem?: string;
  //         region?: string;
  //       };

  //     return {
  //       locale: opts.locale ?? null,
  //       calendar: opts.calendar ?? null,
  //       hourCycle: opts.hourCycle ?? null,
  //       numberingSystem: opts.numberingSystem ?? null,
  //       region: opts.region ?? null,
  //       timeZone: opts.timeZone ?? this.timezone(),
  //     };
  //   } catch {
  //     return {
  //       locale: null,
  //       calendar: null,
  //       hourCycle: null,
  //       numberingSystem: null,
  //       region: null,
  //       timeZone: this.timezone(),
  //     };
  //   }
  // });

  // readonly direction: Signal<'ltr' | 'rtl' | null> = computed(() => {
  //   if (!this.isBrowser) return null;

  //   const dir = (
  //     document.documentElement?.dir ??
  //     document.dir ??
  //     ''
  //   ).toLowerCase();
  //   if (dir === 'rtl' || dir === 'ltr') return dir;

  //   const first = String(this.languages()[0] ?? '').toLowerCase();
  //   return /^(ar|fa|ur|he)\b/.test(first) ? 'rtl' : 'ltr';
  // });
}
