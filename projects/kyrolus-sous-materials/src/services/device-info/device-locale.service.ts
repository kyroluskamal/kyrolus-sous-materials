import {
  Injectable,
  Signal,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DeviceInfoService } from './device-info.service';
import type { EnvLocaleOptions } from '../../models/device-info';

@Injectable({ providedIn: 'root' })
export class DeviceLocaleService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly dev = inject(DeviceInfoService);

  // raw signals from DeviceInfoService
  readonly language = this.dev.pick('language'); // string | undefined
  readonly languages = this.dev.pick('languages'); // readonly string[] | undefined
  readonly timeZone = this.dev.pick('timeZone'); // string | undefined  (use 'timezone' if that's your key)

  /**
   * Resolved locale options from the runtime (browser only).
   * - Returns `undefined` on SSR to satisfy EnvLocaleOptions (all-string) contract.
   */
  readonly localeOptions: Signal<EnvLocaleOptions | undefined> = computed(
    () => {
      if (!this.isBrowser) return undefined;

      // read Intl options defensively
      let ro: Intl.ResolvedDateTimeFormatOptions | undefined;
      try {
        ro = new Intl.DateTimeFormat(undefined).resolvedOptions();
      } catch {
        ro = undefined;
      }

      // locale (always string)
      const fallbackLocale =
        this.language() || this.languages()?.[0] || 'en-US';
      const locale = ro?.locale || fallbackLocale;

      // calendar / numberingSystem (force to string)
      const calendar = String((ro as any)?.calendar ?? 'gregory');
      const numberingSystem = String((ro as any)?.numberingSystem ?? 'latn');

      // hourCycle ('h11'|'h12'|'h23'|'h24')
      let hourCycle: 'h11' | 'h12' | 'h23' | 'h24' = this.hourCycle(ro);

      // timeZone (string fallback)
      const timeZone = ro?.timeZone || this.timeZone() || 'UTC';

      // region must be string (no null) to satisfy EnvLocaleOptions
      let region: string | undefined = (ro as any)?.region as
        | string
        | undefined;
      if (!region && (globalThis as any).Intl?.Locale) {
        try {
          region = new (Intl as any).Locale(locale).region as
            | string
            | undefined;
        } catch {
          /* ignore */
        }
      }
      if (!region) {
        const m = /-([A-Za-z]{2}|\d{3})(?:-|$)/.exec(locale);
        if (m) region = m[1].toUpperCase();
      }
      region ??= ''; // enforce string

      const result: EnvLocaleOptions = {
        locale,
        calendar,
        hourCycle,
        numberingSystem,
        region,
        timeZone,
      };
      return result;
    }
  );

  /**
   * Text direction:
   * - document.dir / <html dir> wins if present.
   * - Otherwise infer from first language (common RTL set).
   * - Returns null on SSR.
   */
  readonly direction: Signal<'ltr' | 'rtl' | null> = computed(() => {
    if (!this.isBrowser) return null;

    const fromDoc = (
      (globalThis.document?.documentElement as any)?.dir ??
      (globalThis.document as any)?.dir ??
      ''
    )
      .toString()
      .toLowerCase();

    if (fromDoc === 'rtl' || fromDoc === 'ltr') {
      return fromDoc as 'rtl' | 'ltr';
    }

    const first = (
      this.languages()?.[0] ||
      this.language() ||
      ''
    ).toLowerCase();
    const lang = first.split('-')[0];

    const RTL = new Set([
      'ar',
      'fa',
      'ur',
      'he',
      'ps',
      'sd',
      'ug',
      'yi',
      'dv',
      'ku',
      'syr',
    ]);
    return RTL.has(lang) ? 'rtl' : 'ltr';
    /* v8 ignore next */
  });
  private hourCycle(ro: Intl.ResolvedDateTimeFormatOptions | undefined) {
    const hcFromRo = ro?.hourCycle;

    let hourCycle: 'h11' | 'h12' | 'h23' | 'h24' = 'h23';
    if (hcFromRo) {
      hourCycle = hcFromRo;
    } else {
      const h12 = (ro as any)?.hour12;
      if (typeof h12 === 'boolean') {
        hourCycle = h12 ? 'h12' : 'h23';
      }
    }
    return hourCycle;
  }
}
