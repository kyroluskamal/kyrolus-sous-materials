import { DOCUMENT, Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Brand = 'default' | 'sunset' | 'midnight' | 'forest' | 'monochrome';
export type Density = 'compact' | 'comfortable' | 'spacious';
export type Mode = 'light' | 'dark' | 'system';

export const BRANDS: Brand[] = ['default', 'sunset', 'midnight', 'forest', 'monochrome'];
export const DENSITIES: Density[] = ['compact', 'comfortable', 'spacious'];
export const MODES: Mode[] = ['light', 'dark', 'system'];

const STORAGE_KEY = 'ks-docs-theme';

interface StoredState {
  brand: Brand;
  density: Density;
  mode: Mode;
}

const DEFAULTS: StoredState = {
  brand: 'default',
  density: 'comfortable',
  mode: 'system',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly brand = signal<Brand>(DEFAULTS.brand);
  readonly density = signal<Density>(DEFAULTS.density);
  readonly mode = signal<Mode>(DEFAULTS.mode);

  constructor() {
    if (this.isBrowser) {
      const stored = this.loadStored();
      if (stored) {
        this.brand.set(stored.brand);
        this.density.set(stored.density);
        this.mode.set(stored.mode);
      }
      this.listenToSystemColorScheme();
    }

    effect(() => {
      const root = this.document.documentElement;
      this.applyAttr(root, 'data-brand', this.brand(), 'default');
      this.applyAttr(root, 'data-density', this.density(), 'comfortable');
      this.applyAttr(root, 'data-theme', this.resolvedMode(), null);
      if (this.isBrowser) this.persist();
    });
  }

  reset(): void {
    this.brand.set(DEFAULTS.brand);
    this.density.set(DEFAULTS.density);
    this.mode.set(DEFAULTS.mode);
  }

  private resolvedMode(): 'light' | 'dark' {
    const m = this.mode();
    if (m !== 'system') return m;
    if (!this.isBrowser) return 'light';
    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private applyAttr(
    el: HTMLElement,
    attr: string,
    value: string,
    stripIf: string | null
  ): void {
    if (stripIf !== null && value === stripIf) {
      el.removeAttribute(attr);
    } else {
      el.setAttribute(attr, value);
    }
  }

  private loadStored(): StoredState | null {
    try {
      const raw = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredState>;
      return {
        brand: BRANDS.includes(parsed.brand as Brand) ? (parsed.brand as Brand) : DEFAULTS.brand,
        density: DENSITIES.includes(parsed.density as Density)
          ? (parsed.density as Density)
          : DEFAULTS.density,
        mode: MODES.includes(parsed.mode as Mode) ? (parsed.mode as Mode) : DEFAULTS.mode,
      };
    } catch {
      return null;
    }
  }

  private persist(): void {
    try {
      const payload: StoredState = {
        brand: this.brand(),
        density: this.density(),
        mode: this.mode(),
      };
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage unavailable (private mode, quota) — silent */
    }
  }

  private listenToSystemColorScheme(): void {
    const mq = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    mq.addEventListener('change', () => {
      if (this.mode() === 'system') {
        const root = this.document.documentElement;
        this.applyAttr(root, 'data-theme', this.resolvedMode(), null);
      }
    });
  }
}
