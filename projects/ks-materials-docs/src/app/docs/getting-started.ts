import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-getting-started',
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <p class="eyebrow">Getting started</p>
      <h1>Install in an Angular project</h1>
      <p class="lead">
        Kyrolus Sous Materials targets Angular 21.2+. The install registers
        two Angular builders so <code>ng build</code> and <code>ng serve</code>
        keep working unchanged.
      </p>
    </header>

    <section>
      <h2>1. Install</h2>
      <pre><code>npm install kyrolus-sous-materials</code></pre>
    </section>

    <section>
      <h2>2. Import the styles</h2>
      <p>In your <code>src/styles.scss</code>:</p>
      <pre><code>&#64;use "kyrolus-sous-materials/styles";</code></pre>
    </section>

    <section>
      <h2>3. Switch the Angular builder</h2>
      <p>
        In <code>angular.json</code>, point <code>build</code> and
        <code>serve</code> at the ks builders:
      </p>
      <pre><code>{{ builderSnippet }}</code></pre>
      <p>
        The ks builders wrap Angular's own, run the JIT on template/SCSS
        changes, and emit a tree-shaken CSS bundle.
      </p>
    </section>

    <section>
      <h2>4. (Optional) Configure the JIT</h2>
      <p>Create <code>ks.config.js</code> at your project root:</p>
      <pre><code>{{ ksConfig }}</code></pre>
    </section>

    <section>
      <h2>5. Pick a theme</h2>
      <p>Theme at the <code>&lt;html&gt;</code> element:</p>
      <pre><code>&lt;html data-theme="auto" data-brand="default" data-density="comfortable"&gt;</code></pre>
    </section>

    <section>
      <h2>Next steps</h2>
      <ul class="next-steps">
        <li><a routerLink="/components">Browse the component library →</a></li>
        <li><a routerLink="/migration">Moving from another library? →</a></li>
        <li><a routerLink="/playground">Try the playground →</a></li>
      </ul>
    </section>
  `,
  styles: `
    :host {
      display: block;
      max-inline-size: 48rem;
    }

    .page-header {
      margin-block: 2rem 2.5rem;
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

    section {
      margin-block: 2rem;
    }

    h2 {
      font-size: 1.25rem;
      margin: 0 0 0.75rem;
    }

    p {
      line-height: 1.7;
      margin: 0 0 0.75rem;
    }

    code {
      background: var(--ks-primary-bg, #eef2ff);
      color: var(--ks-primary, #1e40af);
      padding: 0.1rem 0.35rem;
      border-radius: var(--ks-radius-sm, 0.25rem);
      font-size: 0.9em;
      font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
    }

    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 1rem 1.25rem;
      border-radius: var(--ks-radius-sm, 0.25rem);
      overflow-x: auto;
      margin: 0.75rem 0;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      font-size: 0.875rem;
    }

    .next-steps {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.5rem;
    }

    .next-steps a {
      color: var(--ks-primary, #1e40af);
      text-decoration: none;
      font-weight: 500;
    }

    .next-steps a:hover {
      text-decoration: underline;
    }
  `,
})
export class GettingStarted {
  protected readonly builderSnippet = `"projects": {
  "my-app": {
    "architect": {
      "build": { "builder": "@kyrolus-sous-materials/jit:application", ... },
      "serve": { "builder": "@kyrolus-sous-materials/jit:dev-server", ... }
    }
  }
}`;

  protected readonly ksConfig = `module.exports = {
  content: ["./src/**/*.{html,ts}"],
  output: "src/jit.css",
  darkMode: "dataAttribute",
  theme: {
    colors: {
      brand: "#1e40af",
    },
  },
};`;
}
