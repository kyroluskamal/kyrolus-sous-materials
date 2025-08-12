import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  Renderer2,
} from '@angular/core';
import { GoogleIcon, IconOptions } from './icon.types';
import { googleIconFontClass } from '../../public-api';
import { ICON_OPTIONS } from '../../Tokens/icon.tokens';

@Directive({
  selector: '[ksIcon]',
  host: {
    '[class]': 'classes()',
    '[attr.aria-hidden]': '!isNotDecorative() ? "true" : null',
  },
})
export class IconDirective {
  private readonly elmRef = inject(ElementRef);
  private readonly renderer2 = inject(Renderer2);
  readonly isNotDecorative = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  eff = effect(() => {
    this.elmRef.nativeElement.childNodes.forEach((node: Node) => {
      this.renderer2.removeChild(this.elmRef.nativeElement, node);
    });
    if (this.iconOptions()?.provider === 'google') {
      const nodes = Array.from<Node>(this.elmRef.nativeElement.childNodes);
      let textNode =
        nodes.filter((node) => node.nodeType === Node.TEXT_NODE)[0] || null;
      let hasTextNodes =
        textNode !== null && textNode.textContent?.trim() !== '';
      if (!hasTextNodes) {
        this.renderer2.appendChild(
          this.elmRef.nativeElement,
          this.renderer2.createText(this.ksIcon())
        );
      }
    }
  });
  ksIcon = model.required<string>();
  iconOptions = input<IconOptions>(inject(ICON_OPTIONS));
  readonly classes = computed(() => {
    const name = this.ksIcon();
    const options = this.iconOptions();
    if (options?.provider === 'google') {
      return this.getGoogleIconClass(
        (options?.options as GoogleIcon)?.type ?? 'normal'
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
      default:
        return googleIconFontClass.MaterialIcons;
    }
  }
}
