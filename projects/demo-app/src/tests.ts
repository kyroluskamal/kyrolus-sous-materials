import { JsonPipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonDirective,
  DeviceInfoService,
  DeviceTypeService,
} from 'KyrolusSousMaterials';

@Component({
  selector: 'app-tests',
  imports: [RouterLink, ButtonDirective, JsonPipe],
  template: `
    <button ksButton routerLink="toggle-on-scroll-directive-test">
      Toggle class on scroll test
    </button>
    <p>formFactors {{ dev().formFactors | json }}</p>
    <button ksButton routerLink="menu-test">Menu test</button>
    <button ksButton routerLink="popover-menu-tests">Popeover menu</button>
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
export class Tests {
  deviceInfo = inject(DeviceTypeService);
  deviceInfo2 = inject(DeviceInfoService);
  dev = computed(() => {
    let dev = this.deviceInfo2.device();
    return dev;
  });
  eff = effect(()=>{
    console.log(this.dev())
  })
}
