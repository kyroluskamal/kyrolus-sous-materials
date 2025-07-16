import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { IconType } from '../directives/icon.types';
import { googleIconFontClass } from '../helpers/constants/font.constants';

@Directive({
  selector: '[ksIcon]',
})
export class IconDirective implements OnInit {
  readonly elmRef = inject(ElementRef);
  ngOnInit(): void {
    // Remove text nodes from the template if the icon type is not google
    if (!String(this.iconType()).includes('google') && this.ksIcon()) {
      this.template.nativeElement.childNodes.forEach((childNode: any) => {
        if (childNode.nodeType === Node.TEXT_NODE) {
          this.template.nativeElement.removeChild(childNode);
        }
      });
    }
  }
  ksIcon = input.required<string>();
  iconType = input<IconType>('bi');

  template = inject(ElementRef<any>);
  @HostBinding('class') get class() {
    if (!this.ksIcon()) return '';
    switch (this.iconType()) {
      case 'fa':
      case 'fas':
      case 'fal':
      case 'far':
      case 'fab':
      case 'fad':
        return `${this.iconType()} fa-${this.ksIcon()}`;
      case 'bi':
        return `bi bi-${this.ksIcon()}`;
      case 'google':
      case 'google-round':
      case 'google-outlined':
      case 'google-sharp':
      case 'google-two-tone':
        return `${this.getGoogleIconClass()}`;
      default:
        return `bi bi-${this.ksIcon()}`;
    }
  }

  private getGoogleIconClass() {
    switch (this.iconType()) {
      case 'google':
        return googleIconFontClass.MaterialIcons;
      case 'google-round':
        return googleIconFontClass.MaterialIconsRound;
      case 'google-outlined':
        return googleIconFontClass.MaterialIconsOutlined;
      case 'google-sharp':
        return googleIconFontClass.MaterialIconsSharp;
      case 'google-two-tone':
        return googleIconFontClass.MaterialIconsTwoTone;
      default:
        return googleIconFontClass.MaterialIcons;
    }
  }
}
