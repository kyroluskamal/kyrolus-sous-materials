import { Component } from '@angular/core';
import {
  ButtonDirective,
  EnterKeyEventDirective,
  EscapeKeyEventDirective,
  MenuModule,
  SpaceKeyEventDirective,
} from 'KyrolusSousMaterials';

@Component({
  selector: 'app-menu-test',
  imports: [
    MenuModule,
    ButtonDirective,
    EnterKeyEventDirective,
    SpaceKeyEventDirective,
    EscapeKeyEventDirective,
  ],
  template: `<ks-menu></ks-menu>
    <div ksButton ksSpaceKeyEvent tabindex="0">Submit</div> `,
  host: {
    class:
      'd-block h-100 w-100 bg-grey-39 d-flex f-justify-content-center f-align-items-center',
  },
})
export class MenuTest {
  onFucus(e: any): void {
    console.log('Focus event triggered', e);
  }
}
