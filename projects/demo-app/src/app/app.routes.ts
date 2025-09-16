import { Routes } from '@angular/router';
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
      }
    ],
  },
];
