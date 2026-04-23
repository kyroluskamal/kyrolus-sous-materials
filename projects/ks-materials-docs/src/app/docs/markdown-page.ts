import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { marked } from 'marked';
import { map, switchMap } from 'rxjs/operators';

export const MARKDOWN_HTTP_PROVIDERS = [provideHttpClient(withFetch())];

interface LoadResult {
  html: SafeHtml | null;
  error: string | null;
}

@Component({
  selector: 'markdown-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (pageTitle(); as t) {
      <header class="markdown-header">
        <a class="markdown-crumb" routerLink="/migration">← Migration</a>
        <h1 class="markdown-title">{{ t }}</h1>
      </header>
    }

    @if (state().error) {
      <div class="alert alert-danger" role="alert">
        <strong>Failed to load guide.</strong>
        <p class="alert-text">{{ state().error }}</p>
      </div>
    } @else if (state().html) {
      <article class="markdown-body" [innerHTML]="state().html"></article>
    } @else {
      <p class="text-muted">Loading…</p>
    }
  `,
  styles: `
    :host {
      display: block;
      max-inline-size: 48rem;
      margin-inline: auto;
    }

    .markdown-header {
      margin-block-end: 2rem;
    }

    .markdown-crumb {
      display: inline-block;
      margin-block-end: 0.75rem;
      color: var(--ks-text-muted, #6b7280);
      text-decoration: none;
      font-size: 0.9rem;
    }

    .markdown-crumb:hover {
      color: var(--ks-primary, #1e40af);
    }

    .markdown-title {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      margin: 0;
    }

    .markdown-body {
      line-height: 1.7;
      color: var(--ks-text, #111827);
    }

    .markdown-body :is(h2, h3, h4) {
      margin-block: 2rem 1rem;
      color: var(--ks-text, #111827);
    }

    .markdown-body h2 {
      font-size: 1.5rem;
      padding-block-end: 0.5rem;
      border-block-end: 1px solid var(--ks-border, #e5e7eb);
    }

    .markdown-body h3 {
      font-size: 1.25rem;
    }

    .markdown-body p,
    .markdown-body ul,
    .markdown-body ol {
      margin-block: 1rem;
    }

    .markdown-body ul,
    .markdown-body ol {
      padding-inline-start: 1.5rem;
    }

    .markdown-body li + li {
      margin-block-start: 0.375rem;
    }

    .markdown-body code {
      padding: 0.15em 0.35em;
      border-radius: 0.25rem;
      background: var(--ks-primary-bg, rgba(99, 102, 241, 0.08));
      color: var(--ks-primary, #1e40af);
      font-size: 0.9em;
    }

    .markdown-body pre {
      padding: 1rem 1.25rem;
      border-radius: var(--ks-radius, 0.5rem);
      background: #0f172a;
      color: #e2e8f0;
      overflow-x: auto;
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .markdown-body pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }

    .markdown-body table {
      width: 100%;
      border-collapse: collapse;
      margin-block: 1.5rem;
      font-size: 0.9rem;
    }

    .markdown-body :is(th, td) {
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--ks-border, #e5e7eb);
      text-align: start;
      vertical-align: top;
    }

    .markdown-body th {
      background: var(--ks-primary-bg, rgba(99, 102, 241, 0.06));
      font-weight: 600;
    }

    .markdown-body blockquote {
      margin: 1.5rem 0;
      padding: 0.5rem 1rem;
      border-inline-start: 4px solid var(--ks-primary, #1e40af);
      background: var(--ks-primary-bg, rgba(99, 102, 241, 0.06));
      color: var(--ks-text-muted, #475569);
    }

    .markdown-body a {
      color: var(--ks-primary, #1e40af);
    }

    .markdown-body hr {
      margin-block: 2rem;
      border: 0;
      border-block-start: 1px solid var(--ks-border, #e5e7eb);
    }
  `,
})
export class MarkdownPage {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _state = signal<LoadResult>({ html: null, error: null });
  private readonly _pageTitle = signal<string | null>(null);
  protected readonly state = this._state.asReadonly();
  protected readonly pageTitle = this._pageTitle.asReadonly();

  constructor() {
    this.route.data
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((data) => {
          const path = data['markdown'] as string | undefined;
          this._pageTitle.set((data['pageTitle'] as string | undefined) ?? null);
          if (!path) {
            return Promise.reject(new Error('Missing route data "markdown"'));
          }
          return this.load(path);
        })
      )
      .subscribe({
        next: (html) => this._state.set({ html, error: null }),
        error: (err: unknown) =>
          this._state.set({
            html: null,
            error: err instanceof Error ? err.message : 'Unknown error',
          }),
      });
  }

  private load(path: string) {
    const url = this.resolveUrl(path);
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((raw) => {
        const html = marked.parse(raw, { async: false }) as string;
        return this.sanitizer.bypassSecurityTrustHtml(html);
      })
    );
  }

  private resolveUrl(path: string): string {
    if (!this.isBrowser) {
      const origin = this.document.defaultView?.location.origin ?? '';
      return origin ? origin + path : path;
    }
    return path;
  }
}
