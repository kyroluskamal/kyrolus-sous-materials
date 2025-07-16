import { Component, effect, ElementRef, inject, signal } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'ks-loader',
  imports: [],
  template: ` <div [class]="loaderName()"></div> `,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.9);
        z-index: 9999;
      }
    `,
  ],
})
export class LoaderComponent {
  loaderserv = inject(LoaderService);
  loaderName = signal<string>(this.loaderserv.loaderName());
  private readonly el = inject(ElementRef);

  load = effect(() => {
    if (this.loaderserv.showloader()) {
      this.el.nativeElement.classList.add('d-flex');
      this.el.nativeElement.classList.remove('d-none');
    } else {
      this.el.nativeElement.classList.remove('d-flex');
      this.el.nativeElement.classList.add('d-none');
    }
  });
}
