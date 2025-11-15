import { Component, signal } from '@angular/core';
import {
  FullScreenDirective,
  IconDirective,
  KsMenu,
  MenuModule,
  PopoverMenuBlock,
  PopoverPlacement,
} from 'KyrolusSousMaterials';

@Component({
  selector: 'app-full-screen-test',
  imports: [PopoverMenuBlock, MenuModule, IconDirective, FullScreenDirective],
  template: `
    <ks-popover-menu
      id="left"
      [isOpen]="true"
      [ksMenu]="menuItems"
      [placement]="'left'"
      ksFullScreen
      fullscreenChildSelector="ks-menu"
      [fullScreenConfig]="{
        mobile: 'native',
        desktop: 'css'
      }"
      [(openFullScreen)]="isOpen"
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
  styles: ``,
})
export class FullScreenTest {
  readonly isOpen = signal(false);
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
      { separator: true, isDecorative: true },
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
