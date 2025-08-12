import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { PopoverPlacement } from '../popover.types';
// | 'top'
//   | 'top-start'
//   | 'top-end'
//   | 'bottom'
//   | 'bottom-start'
//   | 'bottom-end'
//   | 'left'
//   | 'left-start'
//   | 'left-end'
//   | 'right'
//   | 'right-start'
//   | 'right-end';
@Directive({
  selector: '[ksFloatingMenuUI]',
})
export class FloatingMenuUIDirective {
  // --- Injections and Private Properties ---
  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private floatingElement = this.elementRef.nativeElement;

  // --- Inputs ---
  @Input({ required: true }) referenceElement!: HTMLElement;
  @Input({ required: true }) isVisible: boolean = false;
  @Input() placement: PopoverPlacement = 'bottom';
  @Input() offsetValue: number = 8;
  @Input() arrowElement?: HTMLElement;
  @Input() arrowPadding: number = 10;

  private readonly viewportPadding = 8;

  constructor() {
    this.renderer.setStyle(this.floatingElement, 'position', 'fixed');
    this.renderer.setStyle(this.floatingElement, 'display', 'none');
  }

  // --- Event Listeners ---
  @HostListener('window:resize')
  @HostListener('window:scroll')
  onUpdate() {
    this.updatePosition();
  }

  // --- Lifecycle Hooks ---
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isVisible'] ||
      changes['referenceElement'] ||
      changes['placement']
    ) {
      this.updatePosition();
    }
  }

  // --- Core Logic ---
  private updatePosition(): void {
    if (!this.isVisible || !this.referenceElement) {
      this.renderer.setStyle(this.floatingElement, 'display', 'none');
      return;
    }

    // الخطوة 1: إظهار العنصر أولاً
    this.renderer.setStyle(this.floatingElement, 'display', 'block');

    // الخطوة 2: الانتظار للحظة حتى يقوم المتصفح بالرسم (هذا هو التصحيح)
    setTimeout(() => {
      // الآن يمكننا القياس بأمان
      const refRect = this.referenceElement.getBoundingClientRect();
      const floatingRect = this.floatingElement.getBoundingClientRect();

      // إذا كانت الأبعاد لا تزال صفراً (قد يحدث إذا كان العنصر الأب مخفيًا)، نتوقف.
      if (floatingRect.width === 0 && floatingRect.height === 0) {
        return;
      }

      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;

      // 3. منطق القلب (Flip Logic)
      let finalPlacement = this.getOptimalPlacement(
        refRect,
        floatingRect,
        vpHeight
      );

      // 4. حساب الموضع المبدئي
      let { top, left } = this.calculateInitialPosition(
        finalPlacement,
        refRect,
        floatingRect
      );

      // 5. منطق الإزاحة (Shift Logic)
      const shiftedPosition = this.shiftPosition(
        top,
        left,
        floatingRect,
        vpWidth,
        vpHeight
      );
      top = shiftedPosition.top;
      left = shiftedPosition.left;

      // 6. تطبيق موضع الـ Popover
      this.renderer.setStyle(this.floatingElement, 'top', `${top}px`);
      this.renderer.setStyle(this.floatingElement, 'left', `${left}px`);

      // 7. منطق السهم (Arrow Logic)
      if (this.arrowElement) {
        this.positionArrow(
          finalPlacement,
          top,
          left,
          refRect,
          this.arrowElement
        );
      }
    }, 0); // تأخير صفر يضع هذا الكود في نهاية طابور التنفيذ
  }

  // --- باقي الدوال المساعدة تبقى كما هي ---
  private getOptimalPlacement(
    refRect: DOMRect,
    floatingRect: DOMRect,
    vpHeight: number
  ): PopoverPlacement {
    let currentPlacement = this.placement;
    const [primaryPos] = currentPlacement.split('-');
    const spaceTop = refRect.top;
    const spaceBottom = vpHeight - refRect.bottom;

    if (
      primaryPos === 'bottom' &&
      spaceBottom < floatingRect.height + this.offsetValue &&
      spaceTop > spaceBottom
    ) {
      currentPlacement = currentPlacement.replace(
        'bottom',
        'top'
      ) as PopoverPlacement;
    } else if (
      primaryPos === 'top' &&
      spaceTop < floatingRect.height + this.offsetValue &&
      spaceBottom > spaceTop
    ) {
      currentPlacement = currentPlacement.replace(
        'top',
        'bottom'
      ) as PopoverPlacement;
    }
    return currentPlacement;
  }

  private calculateInitialPosition(
    placement: PopoverPlacement,
    refRect: DOMRect,
    floatingRect: DOMRect
  ): { top: number; left: number } {
    let top = 0,
      left = 0;
    const { width: refW, height: refH } = refRect;
    const { width: floatingW, height: floatingH } = floatingRect;

    switch (placement) {
      case 'bottom':
        left = refRect.left + refW / 2 - floatingW / 2;
        top = refRect.bottom + this.offsetValue;
        break;
      case 'bottom-start':
        left = refRect.left;
        top = refRect.bottom + this.offsetValue;
        break;
      case 'bottom-end':
        left = refRect.right - floatingW;
        top = refRect.bottom + this.offsetValue;
        break;
      case 'top':
        left = refRect.left + refW / 2 - floatingW / 2;
        top = refRect.top - floatingH - this.offsetValue;
        break;
      case 'top-start':
        left = refRect.left;
        top = refRect.top - floatingH - this.offsetValue;
        break;
      case 'top-end':
        left = refRect.right - floatingW;
        top = refRect.top - floatingH - this.offsetValue;
        break;
      case 'right':
        left = refRect.right + this.offsetValue;
        top = refRect.top + refH / 2 - floatingH / 2;
        break;
      case 'right-start':
        left = refRect.right + this.offsetValue;
        top = refRect.top;
        break;
      case 'right-end':
        left = refRect.right + this.offsetValue;
        top = refRect.bottom - floatingH;
        break;
      case 'left':
        left = refRect.left - floatingW - this.offsetValue;
        top = refRect.top + refH / 2 - floatingH / 2;
        break;
      case 'left-start':
        left = refRect.left - floatingW - this.offsetValue;
        top = refRect.top;
        break;
      case 'left-end':
        left = refRect.left - floatingW - this.offsetValue;
        top = refRect.bottom - floatingH;
        break;
    }
    return { top, left };
  }

  private shiftPosition(
    top: number,
    left: number,
    floatingRect: DOMRect,
    vpWidth: number,
    vpHeight: number
  ): { top: number; left: number } {
    if (left < this.viewportPadding) {
      left = this.viewportPadding;
    } else if (left + floatingRect.width > vpWidth - this.viewportPadding) {
      left = vpWidth - floatingRect.width - this.viewportPadding;
    }
    if (top < this.viewportPadding) {
      top = this.viewportPadding;
    } else if (top + floatingRect.height > vpHeight - this.viewportPadding) {
      top = vpHeight - floatingRect.height - this.viewportPadding;
    }
    return { top, left };
  }

  private positionArrow(
    placement: PopoverPlacement,
    floatingTop: number,
    floatingLeft: number,
    refRect: DOMRect,
    arrowEl: HTMLElement
  ) {
    const arrowRect = arrowEl.getBoundingClientRect();
    const [primaryPos] = placement.split('-');
    const refCenterY = refRect.top + refRect.height / 2;
    const refCenterX = refRect.left + refRect.width / 2;
    let arrowTop = 0,
      arrowLeft = 0;
    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[primaryPos] as string;

    if (primaryPos === 'top' || primaryPos === 'bottom') {
      arrowLeft = refCenterX - floatingLeft - arrowRect.width / 2;
      arrowLeft = Math.max(
        this.arrowPadding,
        Math.min(
          arrowLeft,
          this.floatingElement.clientWidth - arrowRect.width - this.arrowPadding
        )
      );
    } else if (primaryPos === 'left' || primaryPos === 'right') {
      arrowTop = refCenterY - floatingTop - arrowRect.height / 2;
      arrowTop = Math.max(
        this.arrowPadding,
        Math.min(
          arrowTop,
          this.floatingElement.clientHeight -
            arrowRect.height -
            this.arrowPadding
        )
      );
    }

    this.renderer.setStyle(arrowEl, 'left', arrowLeft ? `${arrowLeft}px` : '');
    this.renderer.setStyle(arrowEl, 'top', arrowTop ? `${arrowTop}px` : '');
    this.renderer.setStyle(arrowEl, 'right', '');
    this.renderer.setStyle(arrowEl, 'bottom', '');
    this.renderer.setStyle(arrowEl, staticSide, `-${arrowRect.width / 2}px`);
  }
}
