import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  GoogleIcon,
  IconOptions,
} from './icon.types';
import { googleIconFontClass } from '../../public-api';

@Directive({
  selector: '[ksIcon]',
  host: {
    '[class]': 'classes()',
  },
})
export class IconDirective implements OnInit {
  private readonly elmRef = inject(ElementRef);
  private readonly renderer2 = inject(Renderer2);
  ngOnInit(): void {
    // Remove text nodes from the template if the icon type is not google
    if (this.iconOptions()?.provider !== 'google') {
      this.elmRef.nativeElement.childNodes.forEach((node: Node) => {
        this.elmRef.nativeElement.removeChild(node);
      });
    } else {
      const nodes = Array.from<Node>(this.elmRef.nativeElement.childNodes);
      let hasTextNodes = nodes.some(
        (node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== ''
      );
      if (!hasTextNodes) {
        this.renderer2.appendChild(
          this.elmRef.nativeElement,
          this.renderer2.createText(this.ksIcon())
        );
      }
    }
  }
  ksIcon = input.required<string>();
  iconOptions = input.required<IconOptions>();
  readonly classes = computed(() => {
    const name = this.ksIcon();
    const options = this.iconOptions();

    if (!name) return '';

    if (options?.provider === 'google') {
      return this.getGoogleIconClass(
        (options?.options as GoogleIcon).type || 'normal'
      );
    } else {
      return `bi bi-${name}`;
    }
  });
  private getGoogleIconClass(type: GoogleIcon['type']) {
    switch (type) {
      case 'round':
        return googleIconFontClass.MaterialIconsRound;
      case 'outlined':
        return googleIconFontClass.MaterialIconsOutlined;
      case 'sharp':
        return googleIconFontClass.MaterialIconsSharp;
      case 'two-tone':
        return googleIconFontClass.MaterialIconsTwoTone;
      case 'normal':
      default:
        return googleIconFontClass.MaterialIcons;
    }
  }
}
