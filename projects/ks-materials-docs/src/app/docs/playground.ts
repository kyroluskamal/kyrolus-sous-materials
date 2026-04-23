import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { compile, defaultTheme } from '@ks-jit/browser';

const INITIAL_HTML = `<div class="p-6 rounded-lg bg-blue-500 text-white shadow-lg">
  <h2 class="text-2xl font-bold mb-2">Hello, JIT!</h2>
  <p class="text-sm opacity-90">
    Edit the HTML on the left. Classes compile live.
  </p>
  <button class="mt-4 px-4 py-2 rounded bg-white text-blue-600 font-semibold hover:bg-blue-50">
    Hover me
  </button>
</div>`;

const CLASS_ATTR_REGEX = /class\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const WHITESPACE_REGEX = /\s+/;

@Component({
  selector: 'docs-playground',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <p class="eyebrow">Playground</p>
      <h1>Live JIT compiler</h1>
      <p class="lead">
        Type HTML with Tailwind-style utility classes. The JIT compiles on
        every keystroke; the preview re-renders with the generated CSS.
      </p>
    </header>

    <div class="playground-toolbar">
      <label class="field">
        <span class="field-label">Utilities matched</span>
        <span class="field-value">{{ result().matched }} / {{ candidateCount() }}</span>
      </label>
      <label class="field">
        <span class="field-label">CSS size</span>
        <span class="field-value">{{ cssSizeLabel() }}</span>
      </label>
      @if (result().unmatched.length) {
        <label class="field field-warn">
          <span class="field-label">Unmatched</span>
          <span class="field-value" [title]="result().unmatched.join(', ')">
            {{ result().unmatched.length }}
          </span>
        </label>
      }
      <button type="button" class="btn btn-ghost btn-sm" (click)="reset()">
        Reset
      </button>
    </div>

    <div class="playground-grid">
      <section class="panel">
        <header class="panel-header">HTML</header>
        <textarea
          class="panel-body code-input"
          spellcheck="false"
          autocapitalize="off"
          autocorrect="off"
          aria-label="HTML input"
          [value]="html()"
          (input)="onInput($any($event.target).value)"
        ></textarea>
      </section>

      <section class="panel">
        <header class="panel-header">Generated CSS</header>
        <pre class="panel-body code-output" aria-label="Generated CSS"><code>{{ result().css || '/* type classes on the left to see output */' }}</code></pre>
      </section>

      <section class="panel panel-preview">
        <header class="panel-header">Preview</header>
        @if (previewUrl(); as url) {
          <iframe
            class="panel-body preview-frame"
            [src]="url"
            sandbox="allow-same-origin"
            title="Live JIT preview"
          ></iframe>
        } @else {
          <p class="panel-body preview-fallback">
            Preview loads in the browser.
          </p>
        }
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .page-header {
      margin-block: 2rem 1.5rem;
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
      font-size: 1.05rem;
      color: var(--ks-text-muted, #6b7280);
      line-height: 1.6;
      margin: 0;
    }

    .playground-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem;
      padding: 0.75rem 1rem;
      margin-block-end: 1rem;
      border-radius: var(--ks-radius, 0.5rem);
      border: 1px solid var(--ks-border, #e5e7eb);
      background: var(--ks-primary-bg, rgba(99, 102, 241, 0.04));
    }

    .field {
      display: inline-flex;
      flex-direction: column;
      gap: 0.125rem;
      font-size: 0.85rem;
    }

    .field-label {
      color: var(--ks-text-muted, #6b7280);
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 600;
    }

    .field-value {
      font-weight: 600;
      color: var(--ks-text, #111827);
      font-variant-numeric: tabular-nums;
    }

    .field-warn .field-value {
      color: var(--ks-warning, #d97706);
      cursor: help;
    }

    .playground-toolbar .btn {
      margin-inline-start: auto;
    }

    .playground-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: minmax(18rem, 1fr) minmax(18rem, 1fr);
      gap: 0.75rem;
      min-block-size: 36rem;
    }

    .panel-preview {
      grid-column: 1 / -1;
    }

    @media (min-width: 1100px) {
      .playground-grid {
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: minmax(22rem, 1fr);
      }

      .panel-preview {
        grid-column: auto;
      }
    }

    .panel {
      display: flex;
      flex-direction: column;
      border-radius: var(--ks-radius, 0.5rem);
      border: 1px solid var(--ks-border, #e5e7eb);
      background: var(--ks-surface, #fff);
      overflow: hidden;
      min-block-size: 0;
    }

    .panel-header {
      padding: 0.5rem 0.875rem;
      background: var(--ks-primary-bg, rgba(99, 102, 241, 0.04));
      border-block-end: 1px solid var(--ks-border, #e5e7eb);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ks-text-muted, #6b7280);
    }

    .panel-body {
      flex: 1;
      min-block-size: 0;
      margin: 0;
      padding: 0.875rem;
      font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace;
      font-size: 0.85rem;
      line-height: 1.55;
      background: transparent;
      color: var(--ks-text, #111827);
    }

    .code-input,
    .code-output {
      inline-size: 100%;
      block-size: 100%;
      overflow: auto;
      white-space: pre;
      resize: none;
      border: 0;
      outline: none;
      tab-size: 2;
    }

    .code-input {
      background: var(--ks-surface, #fff);
    }

    .code-output {
      background: #0f172a;
      color: #e2e8f0;
    }

    .code-output code {
      font-family: inherit;
      background: transparent;
      color: inherit;
      padding: 0;
    }

    .preview-frame {
      inline-size: 100%;
      block-size: 100%;
      border: 0;
      background: #fff;
    }

    .preview-fallback {
      padding: 2rem;
      color: var(--ks-text-muted, #6b7280);
    }
  `,
})
export class Playground {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly html = signal(INITIAL_HTML);

  protected readonly candidates = computed(() => extractCandidates(this.html()));
  protected readonly candidateCount = computed(() => this.candidates().length);

  protected readonly result = computed(() => {
    try {
      return compile({
        candidates: this.candidates(),
        theme: defaultTheme,
        darkMode: 'dataAttribute',
        layer: 'utilities',
      });
    } catch (err) {
      return {
        css: `/* compile error: ${err instanceof Error ? err.message : 'unknown'} */`,
        matched: 0,
        matchedClasses: [],
        unmatched: [],
      };
    }
  });

  protected readonly cssSizeLabel = computed(() => {
    const css = this.result().css;
    if (!css) return '0 B';
    const bytes = new Blob([css]).size;
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} kB`;
  });

  private previousBlobUrl: string | null = null;

  protected readonly previewUrl = computed<SafeResourceUrl | null>(() => {
    if (!this.isBrowser) return null;
    const doc = buildPreviewDocument(this.html(), this.result().css);
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    if (this.previousBlobUrl) URL.revokeObjectURL(this.previousBlobUrl);
    this.previousBlobUrl = url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  protected onInput(value: string): void {
    this.html.set(value);
  }

  protected reset(): void {
    this.html.set(INITIAL_HTML);
  }
}

function extractCandidates(html: string): string[] {
  const seen = new Set<string>();
  for (const m of html.matchAll(CLASS_ATTR_REGEX)) {
    const raw = m[1] ?? m[2] ?? '';
    for (const cls of raw.split(WHITESPACE_REGEX)) {
      if (cls) seen.add(cls);
    }
  }
  return [...seen];
}

function buildPreviewDocument(html: string, css: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin: 0; padding: 1.5rem; font-family: system-ui, sans-serif; background: #fff; }
      ${css}
    </style>
  </head>
  <body>${html}</body>
</html>`;
}
