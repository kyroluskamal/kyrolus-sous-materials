import { Routes } from '@angular/router';
import { App } from './app';
import { Tests } from '../tests';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tests',
  },
  {
    path: 'tests',

    title: 'DemoApp',
    children: [
      {
        path: '',
        component: Tests,
      },
      {
        path: 'toggle-on-scroll-directive-test',
        loadComponent: () =>
          import(
            '../test-components/toggle-class-on-scroll-directive-test'
          ).then((m) => m.ToggleClassOnScrollDirectiveTest),
        title: 'Toggle Class On Scroll Directive Test',
      },
    ],
  },
];
