import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonDirective,
  IconDirective,
  ToggleButtonDirective,
} from 'KyrolusSousMaterials';

@Component({
  selector: 'app-tests',
  imports: [RouterLink, ButtonDirective, IconDirective, ToggleButtonDirective],
  template: `
    <button ksButton routerLink="toggle-on-scroll-directive-test">
      Toggle class on scroll test
    </button>

    <button
      ksToggleButton
      size="sm"
      [iconOptions]="{
        provider: 'bi',
      }"
      iconToggled="x"
      iconName="list"
    ></button>
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
