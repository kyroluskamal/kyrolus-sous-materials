import { Component, signal } from '@angular/core';
import {
  IconDirective,
  KsMenu,
  MenuModule,
  PopoverMenuBlock,
  PopoverPlacement,
} from 'KyrolusSousMaterials';

@Component({
  selector: 'app-floating-ui-free-style-mode',
  imports: [PopoverMenuBlock, MenuModule, IconDirective],
  template: `
    <ks-popover-menu
      id="left"
      [isOpen]="true"
      [ksMenu]="menuItems"
      [(placement)]="placement"
      [(isOpen)]="isOpen"
    >
      <ks-menu-header useSeparator decorativeSeparator>
        <span ksIcon="home"> </span>
        <p>Coding Bible Menu</p>
      </ks-menu-header>

      <ks-menu-footer useSeparator decorativeSeparator>
        <span ksIcon="home"> </span>
        <p>Coding Bible Menu</p>
      </ks-menu-footer>
    </ks-popover-menu>
  `,
  host: {
    class:
      'd-block h-100vh bg-grey-39 d-flex align-items-center justify-content-center flex-wrap-wrap gap-5 p-5',
  },
})
export class FloatingUiFreeStyleMode {
  readonly isOpen = signal(true);
  menuItems = new KsMenu(
    [
      {
        title: 'Document section',
        items: [
          {
            disabled: false,
            icon: 'plus-lg',
            label: 'New',
            action: (event, itemRef) => {
              console.log('New item clicked', event, itemRef);
            },
            iconOptions: { provider: 'bi' },
            id: 'new-item',
          },
          {
            icon: 'search',
            label: 'Search',
            routerLink: '/tests',
          },
        ],
      },
      { icon: 'settings', label: 'Settings222' },
      { icon: 'settings', label: 'Logout' },
      { icon: 'add', label: 'leeg' },
      { icon: 'settings', label: 'Settings222' },
      { icon: 'settings', label: 'Logout' },
      { icon: 'add', label: 'leeg' },
      { icon: 'settings', label: 'Settings222' },
      { icon: 'settings', label: 'Logout' },
      { icon: 'add', label: 'leeg' },
      { icon: 'settings', label: 'Settings222' },
      { icon: 'settings', label: 'Logout' },
      { icon: 'add', label: 'leeg' },
    ],
    {
      iconOptions: {
        provider: 'google',
        options: { type: 'outlined' },
      },
      menuClasses: 'bg-white',
      itemClasses: 'text-primary',
      separatorClasses: 'spearaotor-class',
    },
    {
      size: 'md',
      variant: 'text',
      appearance: 'dark',
      isRaised: true,
      borderRadius: 'rounded',
      shape: 'circle',
      disabled: false,
      iconOptions: {
        provider: 'google',
        options: { type: 'outlined' },
      },
      iconName: 'menu',
      RaisedClass: 'raised',
      id: `menu-button-${Math.random().toString(36).substring(2, 15)}`,
    }
  );
  placement = signal<PopoverPlacement>('top');
}
