import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'component-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasPreview()) {
      <div class="preview-surface" [attr.data-slug]="slug()">
        @switch (slug()) {
          @case ('button') {
            <button type="button" class="btn btn-primary btn-sm">Primary</button>
            <button type="button" class="btn btn-secondary btn-sm">Secondary</button>
            <button type="button" class="btn btn-ghost btn-sm">Ghost</button>
          }
          @case ('badge') {
            <span class="badge badge-primary badge-pill">New</span>
            <span class="badge badge-success">✓ Ready</span>
            <span class="badge badge-warning">Beta</span>
            <span class="badge badge-danger badge-dot"></span>
          }
          @case ('alert') {
            <div class="alert alert-info alert-subtle" role="status">
              <span class="alert-content">
                <strong>Heads up.</strong>
                <span class="alert-text">Runtime themed — change brand above.</span>
              </span>
            </div>
          }
          @case ('card') {
            <article class="card card-elevated card-interactive" style="max-inline-size: 18rem">
              <div class="card-body">
                <h4 class="card-title">Live card</h4>
                <p class="card-text">
                  Responds to brand, density, and dark mode tokens.
                </p>
              </div>
            </article>
          }
          @case ('chip') {
            <span class="chip chip-primary">primary</span>
            <span class="chip chip-success chip-solid">solid</span>
            <span class="chip chip-danger chip-outline">outline</span>
          }
          @case ('progress') {
            <div class="progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar" style="inline-size: 60%"></div>
            </div>
          }
          @case ('skeleton') {
            <div class="skeleton skeleton-text skeleton-shimmer" style="inline-size: 80%"></div>
            <div class="skeleton skeleton-text skeleton-shimmer" style="inline-size: 60%"></div>
            <div class="skeleton skeleton-rect skeleton-shimmer" style="block-size: 3rem"></div>
          }
          @case ('avatar') {
            <span class="avatar avatar-md avatar-primary"><span class="avatar-initials">KS</span></span>
            <span class="avatar avatar-md avatar-success"><span class="avatar-initials">AM</span></span>
            <span class="avatar avatar-md avatar-warning"><span class="avatar-initials">QK</span></span>
          }
          @case ('checkbox') {
            <label class="check">
              <input type="checkbox" class="check-input" checked />
              <span class="check-label">Subscribe</span>
            </label>
          }
          @case ('switch') {
            <label class="switch">
              <input type="checkbox" role="switch" class="switch-input" checked />
              <span class="switch-track"><span class="switch-thumb"></span></span>
              <span class="switch-label">Enabled</span>
            </label>
          }
          @case ('tooltip') {
            <span class="tip-wrap">
              <button type="button" class="btn btn-ghost btn-sm">Hover me</button>
              <span class="tooltip tooltip-top tooltip-solid" role="tooltip">Tooltip content</span>
            </span>
          }
          @case ('divider') {
            <div class="divider"></div>
            <div class="divider divider-labelled"><span class="divider-label">OR</span></div>
          }
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .preview-surface {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-block-start: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--ks-radius-sm, 0.25rem);
      background: var(--ks-primary-bg, rgba(99, 102, 241, 0.04));
      border: 1px dashed var(--ks-border, #e5e7eb);
      min-block-size: 2.75rem;
    }

    .preview-surface[data-slug='skeleton'],
    .preview-surface[data-slug='progress'],
    .preview-surface[data-slug='divider'] {
      flex-direction: column;
      align-items: stretch;
    }

    .preview-surface[data-slug='card'] {
      background: transparent;
      border-style: solid;
      border-color: var(--ks-border, #e5e7eb);
    }
  `,
})
export class ComponentPreview {
  readonly slug = input.required<string>();

  private static readonly PREVIEWED = new Set([
    'button',
    'badge',
    'alert',
    'card',
    'chip',
    'progress',
    'skeleton',
    'avatar',
    'checkbox',
    'switch',
    'tooltip',
    'divider',
  ]);

  protected readonly hasPreview = computed(() =>
    ComponentPreview.PREVIEWED.has(this.slug())
  );
}
