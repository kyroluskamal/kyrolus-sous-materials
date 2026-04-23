import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Guide {
  slug: string;
  title: string;
  blurb: string;
  status: 'ready' | 'coming';
}

@Component({
  selector: 'docs-migration-index',
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <p class="eyebrow">Migration</p>
      <h1>Move in from anywhere</h1>
      <p class="lead">
        Staged plans for teams coming from other libraries. Each guide pairs a
        class-name map with a sequenced replacement path so you can migrate
        incrementally, one screen at a time.
      </p>
    </header>

    <section class="guide-grid">
      @for (guide of guides; track guide.slug) {
        <a
          class="guide-card"
          [routerLink]="
            guide.status === 'ready' ? ['/migration', guide.slug] : null
          "
          [attr.aria-disabled]="guide.status === 'coming' ? 'true' : null"
          [class.guide-card-coming]="guide.status === 'coming'"
        >
          <h3>{{ guide.title }}</h3>
          <p>{{ guide.blurb }}</p>
          <span class="guide-card-cta">
            @if (guide.status === 'ready') {
              Read the guide →
            } @else {
              Coming soon
            }
          </span>
        </a>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .page-header {
      margin-block: 2rem 3rem;
      max-inline-size: 48rem;
    }

    .eyebrow {
      color: var(--ks-primary, #1e40af);
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 0.75rem;
    }

    .page-header h1 {
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      margin: 0 0 1rem;
      letter-spacing: -0.02em;
    }

    .lead {
      font-size: 1.1rem;
      color: var(--ks-text-muted, #6b7280);
      line-height: 1.6;
      margin: 0;
    }

    .guide-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1.25rem;
    }

    .guide-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.5rem;
      border-radius: var(--ks-radius, 0.5rem);
      background: var(--ks-surface, #fff);
      border: 1px solid var(--ks-border, #e5e7eb);
      text-decoration: none;
      color: inherit;
      transition: border-color 150ms, transform 150ms;
    }

    .guide-card:hover:not(.guide-card-coming) {
      border-color: var(--ks-primary, #1e40af);
      transform: translateY(-2px);
    }

    .guide-card:focus-visible {
      outline: 2px solid var(--ks-primary, #1e40af);
      outline-offset: 2px;
    }

    .guide-card h3 {
      margin: 0;
      font-size: 1.125rem;
    }

    .guide-card p {
      margin: 0;
      color: var(--ks-text-muted, #6b7280);
      line-height: 1.6;
      flex: 1;
    }

    .guide-card-cta {
      font-weight: 500;
      color: var(--ks-primary, #1e40af);
      font-size: 0.9rem;
    }

    .guide-card-coming {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .guide-card-coming .guide-card-cta {
      color: var(--ks-text-muted, #6b7280);
    }
  `,
})
export class MigrationIndex {
  protected readonly guides: Guide[] = [
    {
      slug: 'tailwind',
      title: 'From Tailwind CSS',
      blurb:
        'Keep your Tailwind class names — the JIT grammar is compatible. Add components + runtime theming on top.',
      status: 'ready',
    },
    {
      slug: 'bootstrap',
      title: 'From Bootstrap 5',
      blurb:
        'Bootstrap-compatible grid, component naming, and utilities. Retire bootstrap.bundle.js for native <dialog> / [popover].',
      status: 'ready',
    },
    {
      slug: 'angular-material',
      title: 'From Angular Material',
      blurb:
        'Trade MatModules for class names. Runtime density / multi-brand replaces the Sass-only theme API.',
      status: 'ready',
    },
    {
      slug: 'primeng',
      title: 'From PrimeNG',
      blurb:
        '<p-*> components → class names on native HTML. Angular bindings stay on native inputs.',
      status: 'ready',
    },
  ];
}
