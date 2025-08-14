import { Component, signal } from '@angular/core';
import {
  IconDirective,
  KsMenu,
  MenuModule,
  PopoverMenuBlock,
} from 'KyrolusSousMaterials';

@Component({
  selector: 'app-popover-menu-tests',
  imports: [PopoverMenuBlock, MenuModule, IconDirective],
  template: `
    <ks-popover-menu
      [isOpen]="true"
      [ksMenu]="menuItems"
      placement="left-start"
      [(isOpen)]="isOpen"
      [toggleButtonTemplate]="toggleButton"
    >
      <ng-template #toggleButton>
        <button (click)="isOpen.set(!isOpen())">Toggle</button></ng-template
      >
      <ks-menu-header useSeparator decorativeSeparator>
        <span ksIcon="home"> </span>
        <p>Coding Bible Menu</p>
      </ks-menu-header>
    </ks-popover-menu>
    <ks-menu>
      <ks-menu-item type="button" href="https://example.com">
        <p>test</p></ks-menu-item
      >
    </ks-menu>
  `,
  host: {
    class:
      'd-block h-100vh bg-grey-39 d-flex align-items-center justify-content-center flex-wrap-wrap',
  },
})
export class PopoverMenuTests {
  readonly isOpen = signal(true);
  menuItems = new KsMenu([
    {
      title: 'Document section',
      items: [
        { disabled: true, icon: 'add', label: 'New' },
        {
          icon: 'search',
          label: 'Search',
          href: 'https://google.com',
          routerLink: '/tests',
        },
      ],
    },
    { icon: 'settings', label: 'Settings' },
    { icon: 'add', label: 'Logout' },
    { separator: true, isDecorative: true },
    { icon: 'add', label: 'leeg' },
  ]);
}
