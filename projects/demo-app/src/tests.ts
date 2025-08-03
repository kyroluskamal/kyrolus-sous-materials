import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'KyrolusSousMaterials';

@Component({
  selector: 'app-tests',
  imports: [RouterLink, ButtonDirective],
  template: `
    <button ksButton routerLink="toggle-on-scroll-directive-test">
      Toggle class on scroll test
    </button>

    <button ksButton routerLink="menu-test">Menu test</button>
  `,
  styles: `
  :host {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  width: 100%;
  height: 100vh;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
`,
})
export class Tests {}
function platformBrowserDynamicTesting(): import('@angular/core').PlatformRef {
  throw new Error('Function not implemented.');
}
