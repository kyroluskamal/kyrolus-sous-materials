import { Directive, HostBinding, input } from '@angular/core';
import { GoogleIconType } from '../helpers/types';

@Directive({
  selector: '[ksGoogleIcon]',
})
export class GoogleIconDirective {
  ksGoogleIcon = input<GoogleIconType>('filled');

  @HostBinding('class') get class() {
    return 'material-icons ' + this.ksGoogleIcon();
  }
}
