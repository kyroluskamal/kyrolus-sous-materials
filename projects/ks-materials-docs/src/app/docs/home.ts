import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-home',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <p class="hero-eyebrow">An Angular + SCSS design system</p>
      <h1 class="hero-title">
        Tailwind-compatible utilities.
        <span class="hero-accent">Full component library.</span>
        Runtime theming.
      </h1>
      <p class="hero-subtitle">
        Kyrolus Sous Materials ships 28+ production components, a Tailwind-class
        JIT engine, and a multi-brand runtime — all from one package.
      </p>

      <div class="hero-actions">
        <a routerLink="/getting-started" class="btn btn-primary">Get started</a>
        <a routerLink="/components" class="btn btn-outline">Browse components</a>
      </div>
    </section>

    <section class="feature-grid">
      <article class="feature-card">
        <h3>Tailwind-compatible JIT</h3>
        <p>
          Full utility grammar — <code>hover:</code>, <code>md:</code>,
          <code>group-hover/name</code>, <code>aria-[sort]</code>,
          <code>&#64;[min-width:500px]</code>, typed arbitraries,
          <code>&#64;[style(--theme:dark)]</code> style container queries.
        </p>
      </article>

      <article class="feature-card">
        <h3>28 components, zero NgModules</h3>
        <p>
          Card, modal, drawer, tabs, tree, stepper, slider, autocomplete,
          datepicker, toast, chip, avatar… styled via class names on semantic
          HTML. Native <code>&lt;dialog&gt;</code> and
          <code>[popover]</code> where the platform supports it.
        </p>
      </article>

      <article class="feature-card">
        <h3>Runtime theming</h3>
        <p>
          Swap brand, density, and dark / high-contrast mode via attributes on
          <code>&lt;html&gt;</code> — no rebuilds. Every token is a
          <code>--ks-*</code> custom property you can override.
        </p>
      </article>

      <article class="feature-card">
        <h3>A11y by default</h3>
        <p>
          Every component ships forced-colors, reduced-motion, RTL, and
          high-contrast paths. WCAG-sized hit targets on coarse pointers.
        </p>
      </article>

      <article class="feature-card">
        <h3>Angular-native</h3>
        <p>
          Ships Angular 21 builders — <code>ng build</code> and
          <code>ng serve</code> transparently run the JIT. No extra CLI step.
        </p>
      </article>

      <article class="feature-card">
        <h3>Move in from anywhere</h3>
        <p>
          Migration guides for Tailwind, Bootstrap, Angular Material, and
          PrimeNG — each with a class-name map and a staged replacement plan.
        </p>
      </article>
    </section>

    <section class="quick-install">
      <h2>Install</h2>
      <pre><code>npm install kyrolus-sous-materials</code></pre>
      <p>
        Then import the styles in your <code>styles.scss</code>:
      </p>
      <pre><code>&#64;use "kyrolus-sous-materials/styles";</code></pre>
      <p class="text-muted">
        Angular 21.2+ required. The library registers
        <code>&#64;kyrolus-sous-materials/jit:application</code> and
        <code>:dev-server</code> builders so you can keep using
        <code>ng build</code> / <code>ng serve</code> unchanged.
      </p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .hero {
      padding-block: clamp(2rem, 6vw, 5rem);
    }

    .hero-eyebrow {
      color: var(--ks-primary, #1e40af);
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 1rem;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      line-height: 1.1;
      margin: 0 0 1.25rem;
      letter-spacing: -0.02em;
    }

    .hero-accent {
      color: var(--ks-primary, #1e40af);
      display: block;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      color: var(--ks-text-muted, #6b7280);
      max-inline-size: 42rem;
      margin: 0 0 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1.25rem;
      margin-block: 3rem;
    }

    .feature-card {
      padding: 1.5rem;
      border-radius: var(--ks-radius, 0.5rem);
      background: var(--ks-surface, #fff);
      border: 1px solid var(--ks-border, #e5e7eb);
    }

    .feature-card h3 {
      margin: 0 0 0.5rem;
      font-size: 1.125rem;
    }

    .feature-card p {
      margin: 0;
      color: var(--ks-text-muted, #6b7280);
      line-height: 1.6;
    }

    .feature-card code {
      background: var(--ks-primary-bg, #eef2ff);
      color: var(--ks-primary, #1e40af);
      padding: 0.1rem 0.35rem;
      border-radius: var(--ks-radius-sm, 0.25rem);
      font-size: 0.85em;
    }

    .quick-install {
      margin-block: 3rem;
      padding: 2rem;
      border-radius: var(--ks-radius, 0.5rem);
      background: var(--ks-surface, #f9fafb);
      border: 1px solid var(--ks-border, #e5e7eb);
    }

    .quick-install h2 {
      margin: 0 0 1rem;
    }

    .quick-install pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 1rem 1.25rem;
      border-radius: var(--ks-radius-sm, 0.25rem);
      overflow-x: auto;
      margin: 0.75rem 0;
    }

    .quick-install code {
      font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
      font-size: 0.9rem;
    }

    .text-muted {
      color: var(--ks-text-muted, #6b7280);
    }
  `,
})
export class Home {}
