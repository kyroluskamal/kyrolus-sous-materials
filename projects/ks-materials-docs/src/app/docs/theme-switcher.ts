import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Brand,
  BRANDS,
  Density,
  DENSITIES,
  Mode,
  MODES,
  ThemeService,
} from './theme-service';

@Component({
  selector: 'theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="theme-switcher" role="group" aria-label="Theme preferences">
      <label class="field">
        <span class="field-label">Brand</span>
        <select
          class="select-input select-sm"
          [value]="theme.brand()"
          (change)="onBrand($any($event.target).value)"
          aria-label="Brand palette"
        >
          @for (b of brands; track b) {
            <option [value]="b">{{ labelize(b) }}</option>
          }
        </select>
      </label>

      <label class="field">
        <span class="field-label">Density</span>
        <select
          class="select-input select-sm"
          [value]="theme.density()"
          (change)="onDensity($any($event.target).value)"
          aria-label="Density"
        >
          @for (d of densities; track d) {
            <option [value]="d">{{ labelize(d) }}</option>
          }
        </select>
      </label>

      <div class="mode-toggle" role="radiogroup" aria-label="Color mode">
        @for (m of modes; track m) {
          <button
            type="button"
            class="btn btn-ghost btn-sm mode-btn"
            role="radio"
            [attr.aria-checked]="theme.mode() === m"
            [class.mode-btn-active]="theme.mode() === m"
            (click)="theme.mode.set(m)"
            [title]="labelize(m) + ' mode'"
          >
            {{ icon(m) }}
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
    }

    .theme-switcher {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .field {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }

    .field-label {
      font-size: 0.75rem;
      color: var(--ks-text-muted, #6b7280);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .select-sm {
      padding: 0.25rem 1.75rem 0.25rem 0.5rem;
      font-size: 0.875rem;
      border: 1px solid var(--ks-border, #e5e7eb);
      border-radius: var(--ks-radius-sm, 0.25rem);
      background: var(--ks-surface, #fff);
      color: var(--ks-text, #111827);
    }

    .mode-toggle {
      display: inline-flex;
      gap: 0.125rem;
      padding: 0.125rem;
      border-radius: var(--ks-radius-sm, 0.25rem);
      border: 1px solid var(--ks-border, #e5e7eb);
    }

    .mode-btn {
      padding: 0.25rem 0.5rem;
      min-inline-size: 2rem;
      font-size: 1rem;
      line-height: 1;
    }

    .mode-btn-active {
      background: var(--ks-primary-bg, #eef2ff);
      color: var(--ks-primary, #1e40af);
    }

    @media (max-width: 720px) {
      .field-label {
        display: none;
      }
    }
  `,
})
export class ThemeSwitcher {
  protected readonly theme = inject(ThemeService);
  protected readonly brands = BRANDS;
  protected readonly densities = DENSITIES;
  protected readonly modes = MODES;

  protected onBrand(v: string): void {
    if (this.brands.includes(v as Brand)) this.theme.brand.set(v as Brand);
  }

  protected onDensity(v: string): void {
    if (this.densities.includes(v as Density)) this.theme.density.set(v as Density);
  }

  protected labelize(v: string): string {
    return v.charAt(0).toUpperCase() + v.slice(1);
  }

  protected icon(m: Mode): string {
    if (m === 'light') return '☀';
    if (m === 'dark') return '☾';
    return '⊙';
  }
}
