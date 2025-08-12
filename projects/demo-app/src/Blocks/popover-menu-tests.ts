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
      <ks-menu-header>
        <span ksIcon="home"> </span>
        <p>Coding Bible Menu</p>
      </ks-menu-header>
    </ks-popover-menu>
    <ks-popover-menu
      [isOpen]="true"
      [ksMenu]="menuItems"
      placement="left-start"
    />
    <ks-popover-menu
      [isOpen]="true"
      [ksMenu]="menuItems"
      placement="left-start"
    />
  `,
  host: {
    class:
      'd-block h-100vh bg-grey-39 d-flex align-items-start justify-content-between flex-wrap-wrap',
  },
})
export class PopoverMenuTests {
  readonly isOpen = signal(true);
  menuItems = new KsMenu([
    {
      title: 'Document section',
      items: [
        { type: 'a', disabled: true, icon: 'add', label: 'New' },
        { type: 'button', icon: 'search', label: 'Search' },
      ],
    },
    { type: 'a', icon: 'settings', label: 'Settings' },
    { type: 'button', icon: 'add', label: 'Logout' },
    { separator: true, isDecorative: true },
    { type: 'button', icon: 'add', label: 'leeg' },
  ]);
}
