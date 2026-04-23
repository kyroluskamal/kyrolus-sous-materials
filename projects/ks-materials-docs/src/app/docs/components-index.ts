import { Component } from '@angular/core';
import { ComponentPreview } from './component-preview';

interface CatalogEntry {
  name: string;
  summary: string;
  status: 'stable' | 'preview' | 'planned';
}

@Component({
  selector: 'docs-components-index',
  imports: [ComponentPreview],
  template: `
    <header class="page-header">
      <p class="eyebrow">Components</p>
      <h1>28+ components on semantic HTML</h1>
      <p class="lead">
        Every component is a class name on a native element — no NgModules,
        no directives to remember. Runtime-themable via
        <code>--ks-*</code> custom properties, with dark / high-contrast /
        forced-colors / RTL / reduced-motion paths built in.
      </p>
    </header>

    <section class="category" aria-labelledby="cat-layout">
      <h2 id="cat-layout">Layout</h2>
      <div class="grid">
        @for (entry of layout; track entry.name) {
          <article class="card">
            <header>
              <h3>{{ entry.name }}</h3>
              <span class="status" [class]="'status-' + entry.status">{{
                entry.status
              }}</span>
            </header>
            <p>{{ entry.summary }}</p>
            <component-preview [slug]="entry.name" />
          </article>
        }
      </div>
    </section>

    <section class="category" aria-labelledby="cat-feedback">
      <h2 id="cat-feedback">Feedback</h2>
      <div class="grid">
        @for (entry of feedback; track entry.name) {
          <article class="card">
            <header>
              <h3>{{ entry.name }}</h3>
              <span class="status" [class]="'status-' + entry.status">{{
                entry.status
              }}</span>
            </header>
            <p>{{ entry.summary }}</p>
            <component-preview [slug]="entry.name" />
          </article>
        }
      </div>
    </section>

    <section class="category" aria-labelledby="cat-form">
      <h2 id="cat-form">Form</h2>
      <div class="grid">
        @for (entry of forms; track entry.name) {
          <article class="card">
            <header>
              <h3>{{ entry.name }}</h3>
              <span class="status" [class]="'status-' + entry.status">{{
                entry.status
              }}</span>
            </header>
            <p>{{ entry.summary }}</p>
            <component-preview [slug]="entry.name" />
          </article>
        }
      </div>
    </section>

    <section class="category" aria-labelledby="cat-nav">
      <h2 id="cat-nav">Navigation</h2>
      <div class="grid">
        @for (entry of navigation; track entry.name) {
          <article class="card">
            <header>
              <h3>{{ entry.name }}</h3>
              <span class="status" [class]="'status-' + entry.status">{{
                entry.status
              }}</span>
            </header>
            <p>{{ entry.summary }}</p>
            <component-preview [slug]="entry.name" />
          </article>
        }
      </div>
    </section>

    <section class="category" aria-labelledby="cat-data">
      <h2 id="cat-data">Data</h2>
      <div class="grid">
        @for (entry of data; track entry.name) {
          <article class="card">
            <header>
              <h3>{{ entry.name }}</h3>
              <span class="status" [class]="'status-' + entry.status">{{
                entry.status
              }}</span>
            </header>
            <p>{{ entry.summary }}</p>
            <component-preview [slug]="entry.name" />
          </article>
        }
      </div>
    </section>

    <section class="category" aria-labelledby="cat-actions">
      <h2 id="cat-actions">Actions</h2>
      <div class="grid">
        @for (entry of actions; track entry.name) {
          <article class="card">
            <header>
              <h3>{{ entry.name }}</h3>
              <span class="status" [class]="'status-' + entry.status">{{
                entry.status
              }}</span>
            </header>
            <p>{{ entry.summary }}</p>
            <component-preview [slug]="entry.name" />
          </article>
        }
      </div>
    </section>

    <p class="footnote">
      Previews render with live theme tokens — try switching brand or density
      in the navbar. Full class APIs are in
      <code>projects/kyrolus-sous-materials/styles/components/*.scss</code>.
    </p>
  `,
  styles: `
    :host {
      display: block;
    }

    .page-header {
      margin-block: 2rem 2.5rem;
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

    h1 {
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

    .category {
      margin-block: 2.5rem;
    }

    h2 {
      font-size: 1.35rem;
      margin: 0 0 1rem;
    }

    h3 {
      margin: 0;
      font-size: 1rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
      gap: 0.75rem;
    }

    .card {
      padding: 1rem 1.25rem;
      border-radius: var(--ks-radius, 0.5rem);
      background: var(--ks-surface, #fff);
      border: 1px solid var(--ks-border, #e5e7eb);
    }

    .card header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-block-end: 0.35rem;
    }

    .card p {
      margin: 0;
      color: var(--ks-text-muted, #6b7280);
      line-height: 1.5;
      font-size: 0.9rem;
    }

    .status {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.15rem 0.45rem;
      border-radius: 9999px;
    }

    .status-stable {
      background: #dcfce7;
      color: #166534;
    }

    .status-preview {
      background: #fef3c7;
      color: #92400e;
    }

    .status-planned {
      background: #e5e7eb;
      color: #374151;
    }

    code {
      font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
      font-size: 0.85em;
      background: var(--ks-primary-bg, #eef2ff);
      color: var(--ks-primary, #1e40af);
      padding: 0.1rem 0.35rem;
      border-radius: var(--ks-radius-sm, 0.25rem);
    }

    .footnote {
      margin-block: 3rem 1rem;
      color: var(--ks-text-muted, #6b7280);
      line-height: 1.6;
    }
  `,
})
export class ComponentsIndex {
  protected readonly layout: CatalogEntry[] = [
    { name: 'card', summary: 'Header / body / footer, elevations, interactive states.', status: 'stable' },
    { name: 'navbar', summary: 'Responsive, sticky, with brand + nav + actions slots.', status: 'stable' },
    { name: 'drawer', summary: 'Left / right / top / bottom, backdrop, inert trap.', status: 'stable' },
    { name: 'grid', summary: 'Bootstrap-style row/col + responsive spans.', status: 'stable' },
  ];

  protected readonly feedback: CatalogEntry[] = [
    { name: 'alert', summary: '8 semantic variants, dismissible, a11y live-region.', status: 'stable' },
    { name: 'toast', summary: 'Queued transient notifications, per-corner placement.', status: 'stable' },
    { name: 'tooltip', summary: 'CSS-only, anchor-positioned, touch-aware.', status: 'stable' },
    { name: 'popover', summary: 'Native [popover], menu/content variants.', status: 'stable' },
    { name: 'progress', summary: 'Linear + circular, indeterminate, labeled.', status: 'stable' },
    { name: 'skeleton', summary: 'Text / shape / image shimmer placeholders.', status: 'stable' },
  ];

  protected readonly forms: CatalogEntry[] = [
    { name: 'checkbox', summary: 'Indeterminate, switch variant, invalid state.', status: 'stable' },
    { name: 'radio', summary: 'Card-style radio groups, keyboard-navigable.', status: 'stable' },
    { name: 'switch', summary: 'ON/OFF semantics, reduced-motion path.', status: 'stable' },
    { name: 'select', summary: 'Native select styled, plus listbox popover variant.', status: 'stable' },
    { name: 'slider', summary: 'Single + range, tick labels.', status: 'stable' },
    { name: 'autocomplete', summary: 'Listbox + keyboard nav + grouped options.', status: 'stable' },
    { name: 'datepicker', summary: 'Single / range, a11y calendar grid.', status: 'stable' },
    { name: 'input', summary: 'Prefix / suffix, error state, input group.', status: 'stable' },
  ];

  protected readonly navigation: CatalogEntry[] = [
    { name: 'tabs', summary: 'Horizontal + vertical, scrollable, lazy panel.', status: 'stable' },
    { name: 'breadcrumb', summary: 'Current-page semantics, truncation.', status: 'stable' },
    { name: 'stepper', summary: 'Linear / non-linear, editable steps.', status: 'stable' },
    { name: 'tree', summary: 'Keyboard-first, lazy children, check states.', status: 'stable' },
  ];

  protected readonly data: CatalogEntry[] = [
    { name: 'badge', summary: 'Numeric / dot, anchored to any element.', status: 'stable' },
    { name: 'chip', summary: 'Dismissible, input chips, filter chips.', status: 'stable' },
    { name: 'avatar', summary: 'Image / initials / icon, group stacking.', status: 'stable' },
    { name: 'list-group', summary: 'Action lists, selectable rows.', status: 'stable' },
    { name: 'rating', summary: 'Keyboard-accessible star rating.', status: 'stable' },
    { name: 'divider', summary: 'Horizontal / vertical, inset, labeled.', status: 'stable' },
  ];

  protected readonly actions: CatalogEntry[] = [
    { name: 'modal', summary: 'Native <dialog>, sizes, backdrop scroll-lock.', status: 'stable' },
    { name: 'speed-dial', summary: 'FAB with fan-out actions.', status: 'stable' },
    { name: 'button', summary: 'Variants, sizes, loading, icon-only.', status: 'stable' },
    { name: 'icon-button', summary: 'Square hit-area, a11y labels enforced.', status: 'stable' },
  ];
}
