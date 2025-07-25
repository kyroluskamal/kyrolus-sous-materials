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
  FontAwesomeIcon,
  GoogleIcon,
  IconOptions,
  IconProvider,
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

    switch (options?.provider) {
      case 'fa': {
        return this.getFaClasses(options?.options as FontAwesomeIcon);
      }

      case 'google': {
        return this.getGoogleIconClass(
          (options?.options as GoogleIcon).type || 'normal'
        );
      }
      default:
        return `bi bi-${name}`;
    }
  });
  private getFaClasses(faOptions: FontAwesomeIcon) {
    const faClasses: string[] = [];

    if (faOptions) {
      faClasses.push(
        `fa-${faOptions.family || 'classic'}`,
        `fa-${faOptions.type || 'solid'}`
      );

      if (faOptions.size) faClasses.push(`fa-${faOptions.size}`);
      if (faOptions.animation) faClasses.push(`fa-${faOptions.animation}`);
      if (faOptions.rotate) faClasses.push(`fa-rotate-${faOptions.rotate}`);
      if (faOptions.flip) faClasses.push(`fa-flip-${faOptions.flip}`);
      if (faOptions.isFixedWidth) faClasses.push('fa-fw');
    }

    faClasses.push(`fa-${this.ksIcon()}`);
    return faClasses.filter(Boolean).join(' ');
  }
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
