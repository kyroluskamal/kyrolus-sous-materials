import { Routes } from '@angular/router';
import { Tests } from '../tests';

export const routes: Routes = [
  {
    path: 'tests',
    title: 'Library Tests',
    children: [
      {
        path: '',
        component: Tests,
      },
      {
        path: 'toggle-on-scroll-directive-test',
        loadComponent: () =>
          import('../toggle-class-on-scroll-directive-test').then(
            (m) => m.ToggleClassOnScrollDirectiveTest
          ),
        title: 'Toggle Class On Scroll Directive Test',
      },
      {
        path: 'menu-test',
        loadComponent: () =>
          import('../components/menu-test').then((m) => m.MenuTest),
        title: 'Menu Test',
      },
      {
        path: 'popover-menu-tests',
        loadComponent: () =>
          import('../Blocks/popover-menu-tests').then(
            (m) => m.PopoverMenuTests
          ),
        title: 'Popover Menu Tests',
      },
      {
        path: 'fullscreen-test',
        loadComponent: () =>
          import('../directive/full-screen-test').then((m) => m.FullScreenTest),
        title: 'Fullscreen Test',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./docs/docs-shell').then((m) => m.DocsShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./docs/home').then((m) => m.Home),
        title: 'Kyrolus Sous Materials',
      },
      {
        path: 'getting-started',
        loadComponent: () =>
          import('./docs/getting-started').then((m) => m.GettingStarted),
        title: 'Getting started · ks',
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./docs/components-index').then((m) => m.ComponentsIndex),
        title: 'Components · ks',
      },
      {
        path: 'migration',
        loadComponent: () =>
          import('./docs/migration-index').then((m) => m.MigrationIndex),
        title: 'Migration · ks',
      },
      {
        path: 'migration/tailwind',
        loadComponent: () =>
          import('./docs/markdown-page').then((m) => m.MarkdownPage),
        data: {
          markdown: '/migration-guides/tailwind-to-ks.md',
          pageTitle: 'Migrate from Tailwind',
        },
        title: 'Migrate from Tailwind · ks',
      },
      {
        path: 'migration/bootstrap',
        loadComponent: () =>
          import('./docs/markdown-page').then((m) => m.MarkdownPage),
        data: {
          markdown: '/migration-guides/bootstrap-to-ks.md',
          pageTitle: 'Migrate from Bootstrap',
        },
        title: 'Migrate from Bootstrap · ks',
      },
      {
        path: 'migration/angular-material',
        loadComponent: () =>
          import('./docs/markdown-page').then((m) => m.MarkdownPage),
        data: {
          markdown: '/migration-guides/angular-material-to-ks.md',
          pageTitle: 'Migrate from Angular Material',
        },
        title: 'Migrate from Angular Material · ks',
      },
      {
        path: 'migration/primeng',
        loadComponent: () =>
          import('./docs/markdown-page').then((m) => m.MarkdownPage),
        data: {
          markdown: '/migration-guides/primeng-to-ks.md',
          pageTitle: 'Migrate from PrimeNG',
        },
        title: 'Migrate from PrimeNG · ks',
      },
      {
        path: 'playground',
        loadComponent: () =>
          import('./docs/playground').then((m) => m.Playground),
        title: 'Playground · ks',
      },
    ],
  },
];
