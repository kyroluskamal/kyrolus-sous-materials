
import {
  ElementRef,
  Inject,
  Injectable,
  Renderer2,
  RendererStyleFlags2,
  DOCUMENT
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RendererService {
  constructor(
    private readonly renderer2: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  /**
   * @param parent the parent element to search in
   * @param child the child element to search for
   * @returns the child element if found or null if not found
   */

  hasChildrenOfType(parent: ElementRef<HTMLElement>, child: string) {
    return parent.nativeElement.querySelectorAll(child);
  }
  /**
   *
   * @param selector the selector to search for
   * @returns  The root element
   */
  selectRoot(selector: string) {
    return this.document.querySelector(selector) as HTMLElement;
  }
  /**
   * @param element the element to remove the class from
   * @param className  the class name to remove
   */
  removeClass(element: HTMLElement, className: string) {
    if (className != '' && className != ' ')
      this.renderer2.removeClass(element, className);
  }
  /**
   *
   * @param element the element to remove the classes from
   * @param classNames  the class names to remove
   */
  removeClasses(element: HTMLElement, classNames: string[]) {
    classNames.forEach((className) => {
      this.removeClass(element, className);
    });
  }
  /**
   *
   * @param element the element to add the class to
   * @param className  the class name to add
   */
  addClass(element: HTMLElement, className: string) {
    if (className != '' && className != ' ')
      this.renderer2.addClass(element, className);
  }
  /**
   *
   * @param element the element to add the classes to
   * @param classNames the class names to add
   */
  addClasses(element: HTMLElement, classNames: string[]) {
    classNames.forEach((className) => {
      this.addClass(element, className);
    });
  }
  /**
   *
   * @param element  the element to set the property to
   * @param propertyName  the property name to set
   * @param value  the value to set
   */
  setProperty(element: HTMLElement, propertyName: string, value: any) {
    this.renderer2.setProperty(element, propertyName, value);
  }

  /**
   *
   * @param element  the element to set the properties to
   * @param properties  an object constaing key value pairs that represente the key and value for each property
   */
  setProperties(element: HTMLElement, properties: { [key: string]: any }) {
    Object.keys(properties).forEach((key) => {
      this.setProperty(element, key, properties[key]);
    });
  }
  /**
   *
   * @param element the element to set the attribute to
   * @param attributeName the attribute name to set
   * @param value the value to set
   */
  setAttribute(element: HTMLElement, attributeName: string, value: any) {
    this.renderer2.setAttribute(element, attributeName, value);
  }

  /**
   *
   * @param element the element to set the attributes to
   * @param attributes an object constaing key value pairs that represente the key and value for each attribute
   */
  setAttributes(element: HTMLElement, attributes: { [key: string]: any }) {
    Object.keys(attributes).forEach((key) => {
      this.setAttribute(element, key, attributes[key]);
    });
  }
  removeAttribute(element: HTMLElement, attributeName: string) {
    this.renderer2.removeAttribute(element, attributeName);
  }

  removeAttributes(element: HTMLElement, attributes: string[]) {
    attributes.forEach((attribute) => {
      this.removeAttribute(element, attribute);
    });
  }
  /**
   *
   * @param element the element to set the style to
   * @param styleName the style name to set
   * @param value the value to set
   * @param flags the flags that use important and dashcase
   */
  setStyle(
    element: HTMLElement,
    styleName: string,
    value: any,
    flags?: RendererStyleFlags2
  ) {
    this.renderer2.setStyle(element, styleName, value, flags);
  }

  setStyles(
    element: HTMLElement,
    styles: { [key: string]: any },
    flags?: RendererStyleFlags2
  ) {
    Object.keys(styles).forEach((key) => {
      this.setStyle(element, key, styles[key], flags);
    });
  }

  removeStyle(
    element: HTMLElement,
    styleName: string,
    flags?: RendererStyleFlags2
  ) {
    this.renderer2.removeStyle(element, styleName, flags);
  }

  removeStyles(
    element: HTMLElement,
    styles: string[],
    flags?: RendererStyleFlags2
  ) {
    styles.forEach((style) => {
      this.removeStyle(element, style, flags);
    });
  }
  createElement(name: string, namespace?: string | null) {
    return this.renderer2.createElement(name, namespace);
  }

  createText(value: string) {
    return this.renderer2.createText(value);
  }

  appendChild(parent: HTMLElement, child: any) {
    this.renderer2.appendChild(parent, child);
  }

  appencChildren(parent: HTMLElement, children: any[]) {
    children.forEach((child) => {
      this.appendChild(parent, child);
    });
  }

  insertBefore(parent: any, child: any, refChild: any) {
    this.renderer2.insertBefore(parent as Node, child, refChild);
  }

  insertChildrenBefore(
    parent: HTMLElement,
    children: HTMLElement[],
    refChild: HTMLElement | null
  ) {
    children.forEach((child) => {
      this.insertBefore(parent, child, refChild);
    });
  }

  ListenTo(
    element: HTMLElement,
    eventName: string,
    callback: (event: any) => boolean | void
  ) {
    return this.renderer2.listen(element, eventName, callback);
  }

  selectSbling(element: Element): HTMLElement {
    return (
      (element.nextElementSibling as HTMLElement) ||
      (element.previousElementSibling as HTMLElement)
    );
  }

  toggleBackDrop(toggler: boolean) {
    let backDrop = this.selectRoot('*.backdrop');
    if (backDrop) {
      toggler
        ? backDrop.classList.add('backdrop-show')
        : backDrop.classList.remove('backdrop-show');
    }
  }
  selectChild(element: Element, selector: string): HTMLElement {
    return element.querySelector(selector) as HTMLElement;
  }

  selectChildren(element: Element, selector: string): NodeListOf<HTMLElement> {
    return element.querySelectorAll(selector);
  }

  toggleClass(element: HTMLElement, className: string) {
    element.classList.toggle(className);
  }
  removeChild(parent: any, child: any) {
    this.renderer2.removeChild(parent, child);
  }

  removeChildren(parent: any, children: any[]) {
    children.forEach((child) => {
      this.removeChild(parent, child);
    });
  }
}
