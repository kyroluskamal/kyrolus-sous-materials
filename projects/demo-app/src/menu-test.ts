import { Component } from '@angular/core';
import {
  BadgeComponent,
  IconDirective,
  MenuAriaHandlingDirective,
  MenuModule,
} from 'KyrolusSousMaterials';

@Component({
  selector: 'app-menu-test',
  imports: [
    MenuModule,
    IconDirective,
    BadgeComponent,
    MenuAriaHandlingDirective,
  ],
  template: `
    <ks-menu ksMenuAriaHandling>
      <ks-menu-header useSeparator>
        <span ksIcon="home"> </span>
        <p>Coding Bible Menu</p>
      </ks-menu-header>
      <ks-menu-section title="Document section">
        <ks-menu-item type="a" disabled>
          <span ksIcon="add"></span>
          <p>New</p>
          <ks-badge></ks-badge>
        </ks-menu-item>
        <ks-menu-item (click)="clicked($event)">
          <span ksIcon="search"></span>
          <p>Search</p>
          <ks-badge></ks-badge>
        </ks-menu-item>
      </ks-menu-section>

      <ks-menu-item>
        <span ksIcon="settings"></span>
        <p>Settings</p>
        <ks-badge></ks-badge>
      </ks-menu-item>
      <ks-menu-item>
        <span ksIcon="add"></span>
        <p>Logout</p>
        <ks-badge></ks-badge>
      </ks-menu-item>
      <ks-menu-item>
        <span ksIcon="add"></span>
        <p>leeg</p>
        <ks-badge></ks-badge>
      </ks-menu-item>

      <ks-menu-footer useSeparator></ks-menu-footer>
    </ks-menu>
  `,
  host: {
    class:
      'd-block h-100vh w-100vw bg-grey-39 d-flex justify-content-center align-items-center',
  },
})
export class MenuTest {
  clicked(event: Event) {
    console.log(event);
  }
}
