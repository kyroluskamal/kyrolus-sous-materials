import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeSwitcher } from './theme-switcher';

@Component({
  selector: 'docs-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeSwitcher],
  template: `
    <header class="navbar navbar-sticky">
      <a class="navbar-brand" routerLink="/">
        <strong>ks</strong>
        <span>Kyrolus Sous Materials</span>
      </a>
      <nav class="navbar-nav" role="navigation" aria-label="Primary">
        <a
          class="navbar-link"
          routerLink="/getting-started"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          >Get started</a
        >
        <a
          class="navbar-link"
          routerLink="/components"
          routerLinkActive="active"
          >Components</a
        >
        <a
          class="navbar-link"
          routerLink="/migration"
          routerLinkActive="active"
          >Migration</a
        >
        <a
          class="navbar-link"
          routerLink="/playground"
          routerLinkActive="active"
          >Playground</a
        >
      </nav>
      <div class="navbar-actions">
        <theme-switcher />
        <a
          class="btn btn-ghost btn-sm"
          href="https://github.com/kyroluskamal/kyrolus-sous-materials"
          rel="noopener"
          aria-label="GitHub repository"
          >GitHub</a
        >
      </div>
    </header>

    <main class="docs-main">
      <router-outlet />
    </main>

    <footer class="docs-footer">
      <div class="docs-footer-inner">
        <p class="text-muted">
          &copy; {{ year }} Kyrolus Sous Materials. MIT License.
        </p>
        <nav class="docs-footer-nav" aria-label="Footer">
          <a routerLink="/migration/tailwind">From Tailwind</a>
          <a routerLink="/migration/bootstrap">From Bootstrap</a>
          <a routerLink="/migration/angular-material">From Angular Material</a>
          <a routerLink="/migration/primeng">From PrimeNG</a>
        </nav>
      </div>
    </footer>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-block-size: 100vh;
    }

    .navbar {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-inline: clamp(1rem, 3vw, 2rem);
      padding-block: 0.75rem;
      border-block-end: 1px solid var(--ks-border, #e5e7eb);
      background: var(--ks-surface, #fff);
    }

    .navbar-sticky {
      position: sticky;
      inset-block-start: 0;
      z-index: 10;
    }

    .navbar-brand {
      display: inline-flex;
      align-items: baseline;
      gap: 0.5rem;
      color: inherit;
      text-decoration: none;
      font-size: 1.05rem;
    }

    .navbar-brand strong {
      color: var(--ks-primary, #1e40af);
      font-weight: 800;
    }

    .navbar-nav {
      display: flex;
      gap: 0.25rem;
      flex: 1;
    }

    .navbar-link {
      padding: 0.5rem 0.75rem;
      border-radius: var(--ks-radius-sm, 0.25rem);
      color: var(--ks-text-muted, #6b7280);
      text-decoration: none;
      font-weight: 500;
    }

    .navbar-link:hover {
      color: var(--ks-text, #111827);
      background: var(--ks-primary-bg, #eef2ff);
    }

    .navbar-link.active {
      color: var(--ks-primary, #1e40af);
    }

    .navbar-actions {
      margin-inline-start: auto;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
    }

    .docs-main {
      padding: clamp(1.5rem, 4vw, 3rem);
      max-inline-size: 72rem;
      inline-size: 100%;
      margin-inline: auto;
    }

    .docs-footer {
      padding: 2rem clamp(1rem, 3vw, 2rem);
      border-block-start: 1px solid var(--ks-border, #e5e7eb);
      background: var(--ks-surface, #fff);
    }

    .docs-footer-inner {
      max-inline-size: 72rem;
      margin-inline: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: center;
      justify-content: space-between;
    }

    .docs-footer-nav {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .docs-footer-nav a {
      color: var(--ks-text-muted, #6b7280);
      text-decoration: none;
      font-size: 0.9rem;
    }

    .docs-footer-nav a:hover {
      color: var(--ks-primary, #1e40af);
    }
  `,
})
export class DocsShell {
  protected readonly year = new Date().getFullYear();
}
