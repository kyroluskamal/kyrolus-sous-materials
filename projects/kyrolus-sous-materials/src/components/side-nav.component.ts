import {
  AfterViewInit,
  Component,
  effect,
  HostBinding,
  inject,
  input,
  model,
  output,
  ɵSafeValue,
} from '@angular/core';
import { SideBarPosition } from '../helpers/types';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { IconDirective } from '../directives/icon.directive';
import { IconType } from '../directives/icon.types';
import { DashboardLayoutComponent } from '../public-api';

@Component({
  selector: 'ks-side-nav',
  imports: [NgClass, IconDirective, NgOptimizedImage],
  template: `
    <div
      class="w-100"
      [ngClass]="position() == 'left' ? 'flex-row-reverse' : 'flex-row'"
      [class.flex-column]="useCloseBtn()"
    >
      @if(useCloseBtn() && logo()==""){
      <div class="d-flex f-justify-content-end ">
        <button>
          @if(closeIcon().type == 'google'){
          <span
            ksGoogleIcon="filled"
            (click)="open.set(false)"
            [class]="closeBtnClasses()"
            >{{ closeIcon().icon }}</span
          >
          }@else{
          <span
            [ksIcon]="closeIcon().icon"
            [iconType]="closeIcon().type"
            [class]="closeBtnClasses()"
            (click)="open.set(false)"
          ></span>
          }
        </button>
      </div>
      } @if(logo()!=""){
      <div
        class="navbar-height d-flex f-justify-content-center br-b-dark-38 br-w-b-2 br-s-solid br-b-only"
      >
        <img [ngSrc]="logo()" alt="logo" width="50" height="50" priority />
      </div>
      }
      <ng-content></ng-content>
    </div>
  `,
  host: { class: 'h-100 position-fixed sidenav-toggle top-0 left-0 z-1' },
  styles: `
      :host {
        transition: transform var(--transition-duration) var(--transition-easing);
        width: var(--sidebar-width);
      }
    `,
})
export class SideNavComponent implements AfterViewInit {
  position = input<SideBarPosition>('left');
  open = model<boolean>(true);
  closeIcon = input<{ type: IconType; icon: string }>({
    type: 'google',
    icon: 'close',
  });
  closeBtnClasses = input<string>('btn aspect-ratio-1x1 br-full text-danger');
  useCloseBtn = input<boolean>(false);
  logo = input<string | ɵSafeValue>('');
  dashboardLayout = inject(DashboardLayoutComponent);
  //-------------------------Outputs-------------------------
  openChange = output<boolean>();
  effect = effect(() => {
    this.openChange.emit(this.open());
  });
  ngAfterViewInit(): void {
    if (!this.dashboardLayout) {
      throw new Error(
        'SideNavComponent must be used inside a DashboardLayoutComponent'
      );
    }
  }

  @HostBinding('attr.opened')
  get isOpened() {
    return this.open();
  }
}
