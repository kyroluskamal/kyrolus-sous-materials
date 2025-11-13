import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { FullScreenDirective } from './full-screen.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeviceTypeService } from '../../services/device-info/device-type/device-type.service';

@Component({
  standalone: true,
  selector: 'fullscreen',
  imports: [FullScreenDirective],
  template: `<div ksFullScreen (fullScreenClosed)="isOpen.set(false)"></div>`,
})
export class FullScreenComponent {
  isOpen = signal(true);
}
@Component({
  standalone: true,
  selector: 'fullscreen',
  imports: [FullScreenDirective],
  template: `<div
    ksFullScreen
    childSelector="#child"
    (closed)="isOpen.set(false)"
  >
    <div ksFullScreen (fullScreenClosed)="isOpen.set(false)" id="child"></div>
  </div>`,
})
export class ChildFullScreenComponent {
  isOpen = signal(true);
}

describe('FullScreenDirective', () => {
  describe('1. FullScreen for main element', () => {
    let fixture: ComponentFixture<FullScreenComponent>;
    let testElement: DebugElement;
    let device: DeviceTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FullScreenComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();
      fixture = TestBed.createComponent(FullScreenComponent);
      testElement = fixture.debugElement;
      device = TestBed.inject(DeviceTypeService);
      fixture.detectChanges();
    });

    it('1.1 should have the correct class "fullscreen"', async () => {
      setDeviceType(device);
      fixture = TestBed.createComponent(FullScreenComponent);
      testElement = fixture.debugElement;
      fixture.detectChanges();
      await fixture.whenStable();
      let directive = testElement.query(By.directive(FullScreenDirective));
      expect(
        directive.nativeElement.classList.contains('fullscreen')
      ).toBeTruthy();
    });
  });
});

function setDeviceType(
  device: DeviceTypeService,
  isMobile: boolean = true,
  isTablet: boolean = false,
  isDesktop: boolean = false
) {
  vi.spyOn(device, 'isMobile').mockReturnValue(isMobile);
  vi.spyOn(device, 'isTablet').mockReturnValue(isTablet);
  vi.spyOn(device, 'isDesktop').mockReturnValue(isDesktop);
}
