import { Component } from '@angular/core';
import {
  NavbarModule,
  ToggleClassOnScrollDirective,
} from 'kyrolus-sous-materials';
@Component({
  selector: 'app-toggle-class-on-scroll-directive-test',
  imports: [ToggleClassOnScrollDirective, NavbarModule],
  host: {
    class: 'd-block h-100 w-100',
  },
  template: `
    <ks-navbar-container
      style="height: 50px; position: sticky; top: 0; z-index: 1000;"
      class="bg-white d-block"
      ksToggleClassOnScroll="make-nav-bar-tranparent"
    >
      <ks-navbar-row> This is my nav bar </ks-navbar-row>
    </ks-navbar-container>
    <button style="position: absolute; top: 0">fsfsdfsfsd</button>
  `,
  styles: `
  :host{
    background-color: #f0f2f5;
    position: relative;
    height: 200vh;
    button:{
      position: absolute;
      top: 200px;
      left: 200px;
      z-index: 1000;
      padding: 10px;
      background-color: black;
      color: white;
    }
  }
    .make-nav-bar-tranparent{
      background-color: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(5px);

    }

  `,
})
export class ToggleClassOnScrollDirectiveTest {}
