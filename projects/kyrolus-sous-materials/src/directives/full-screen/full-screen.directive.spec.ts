import {
  Component,
  DebugElement,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { FullScreenDirective, FullScreenMode } from './full-screen.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeviceTypeService } from '../../services/device-info/device-type/device-type.service';

@Component({
  standalone: true,
  selector: 'fullscreen',
  imports: [FullScreenDirective],
  template: `<div
    [(openFullScreen)]="isOpen"
    ksFullScreen
    [useNativeRequestFullScreen]="useNativeFullScreen()"
    [fullScreenMode]="fullscreenMode()"
    (fullScreenClosed)="isOpen.set(false)"
  ></div>`,
})
export class FullScreenComponent {
  isOpen = signal(false);
  fullscreenMode = signal<FullScreenMode>('mobile');
  useNativeFullScreen = signal(true);
}
@Component({
  standalone: true,
  selector: 'fullscreen',
  imports: [FullScreenDirective],
  template: `<div
    ksFullScreen
    [useNativeRequestFullScreen]="useNativeFullScreen()"
    fullscreenChildSelector="#child"
    [(openFullScreen)]="isOpen"
  >
    <div id="child"></div>
  </div>`,
})
export class ChildFullScreenComponent {
  isOpen = signal(false);
  fullscreenMode = signal<FullScreenMode>('mobile');
  useNativeFullScreen = signal(true);
}

describe('FullScreenDirective', () => {
  describe('1. main component', () => {
    let fixture: ComponentFixture<FullScreenComponent>;
    let debugElement: DebugElement;
    let directiveHtml: HTMLElement;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FullScreenComponent],
        providers: [
          provideZonelessChangeDetection(),
          {
            provide: DeviceTypeService,
            useValue: {
              isMobile: () => true,
              isDesktop: () => false,
              isTablet: () => false,
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FullScreenComponent);
      debugElement = fixture.debugElement;
      directiveHtml = debugElement.query(By.directive(FullScreenDirective))
        .nativeElement as HTMLElement;
      directiveHtml.requestFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: directiveHtml,
        });
        return Promise.resolve();
      });

      (document as any).exitFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: null,
        });
        return Promise.resolve();
      });
      Object.defineProperty(document as any, 'fullscreenEnabled', {
        configurable: true,
        value: true,
      });
      fixture.detectChanges();
    });
    describe('1.1. natgive fullscreen', () => {
      it('1.1.1. should be on fullscreen using requestFullscreen using native fullscreen', () => {
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        expect(directiveHtml.requestFullscreen).toHaveBeenCalledTimes(1);

        fixture.componentInstance.isOpen.set(false);
        fixture.detectChanges();

        expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
      });
      it('1.1.2. should have close button and can be closed by it', async () => {
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        await Promise.resolve();

        let closeBtn = directiveHtml.querySelector('button');
        expect(closeBtn).toBeTruthy();
        closeBtn?.click();
        expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
      });
    });
    describe('1.2. fullscreen class', () => {
      it('1.2. should be on fullscreen using fullscreen class if not using requestFullscreen', () => {
        fixture.componentInstance.useNativeFullScreen.set(false);
        fixture.detectChanges();
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        expect(directiveHtml.classList.contains('fullscreen')).toBeTruthy();
        fixture.componentInstance.isOpen.set(false);
        fixture.detectChanges();
        expect(directiveHtml.classList.contains('fullscreen')).toBeFalsy();
      });

      it('1.2.2. should have close button and should be able to close the fullscreen', () => {
        fixture.componentInstance.useNativeFullScreen.set(false);
        fixture.detectChanges();
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        let closeButton = directiveHtml.querySelector('button');
        expect(closeButton).toBeTruthy();
        closeButton?.click();
        expect(directiveHtml.classList.contains('fullscreen')).toBeFalsy();
      });
    });

    describe('1.3. lifecycle and fallbacks', () => {
      it('1.3.1. should exit fullscreen when directive destroyed while open', async () => {
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        await Promise.resolve();

        expect(document.exitFullscreen).toHaveBeenCalledTimes(0);
        fixture.destroy();
        expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
      });

      it('1.3.2. should unset fullscreen when host target changes', () => {
        const directiveInstance = debugElement
          .query(By.directive(FullScreenDirective))
          .injector.get(FullScreenDirective);
        const unsetSpy = vi.spyOn(directiveInstance as any, 'unsetFullScreen');

        const firstHost = document.createElement('div');
        const secondHost = document.createElement('div');

        (directiveInstance as any).host = firstHost;
        (directiveInstance as any).updateHost(firstHost);

        (directiveInstance as any).updateHost(secondHost);

        expect(unsetSpy).toHaveBeenCalledTimes(1);
      });

      it('1.3.3. should fallback to css fullscreen when native api is unavailable', () => {
        const directiveInstance = debugElement
          .query(By.directive(FullScreenDirective))
          .injector.get(FullScreenDirective);
        const setSpy = vi.spyOn(directiveInstance as any, 'setFullScreen');
        (directiveInstance as any).host = directiveHtml;
        const originalEnabled = (document as any).fullscreenEnabled;
        Object.defineProperty(document as any, 'fullscreenEnabled', {
          configurable: true,
          value: false,
        });

        (directiveInstance as any).requestNativeFullScreen();

        expect(setSpy).toHaveBeenCalledTimes(1);

        Object.defineProperty(document as any, 'fullscreenEnabled', {
          configurable: true,
          value: originalEnabled,
        });
        (directiveInstance as any).unsetFullScreen();
      });

      it('1.3.4. should fallback to css fullscreen when native request rejects', async () => {
        const directiveInstance = debugElement
          .query(By.directive(FullScreenDirective))
          .injector.get(FullScreenDirective);
        const setSpy = vi.spyOn(directiveInstance as any, 'setFullScreen');
        (directiveInstance as any).host = directiveHtml;

        directiveHtml.requestFullscreen = vi
          .fn()
          .mockRejectedValue(new Error('fail'));

        (directiveInstance as any).requestNativeFullScreen();
        await Promise.resolve();
        await Promise.resolve();

        expect(setSpy).toHaveBeenCalled();
        (directiveInstance as any).unsetFullScreen();
      });

      it('1.3.5. should clean up when exitNativeFullScreen resolves', async () => {
        const directiveInstance = debugElement
          .query(By.directive(FullScreenDirective))
          .injector.get(FullScreenDirective);
        const unsetSpy = vi.spyOn(directiveInstance as any, 'unsetFullScreen');

        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        await Promise.resolve();

        (directiveInstance as any).exitNativeFullScreen();
        await Promise.resolve();

        expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
        expect(unsetSpy).toHaveBeenCalled();
        expect(fixture.componentInstance.isOpen()).toBe(false);
      });

      it('1.3.6. should handle document fullscreenchange when user exits manually', async () => {
        const directiveInstance = debugElement
          .query(By.directive(FullScreenDirective))
          .injector.get(FullScreenDirective);
        const unsetSpy = vi.spyOn(directiveInstance as any, 'unsetFullScreen');

        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        await Promise.resolve();

        const originalFullscreenElement = (document as any).fullscreenElement;
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: null,
        });
        (directiveInstance as any).lastShouldBeOpen = true;

        (directiveInstance as any).onFullscreenChange();

        expect(unsetSpy).toHaveBeenCalled();
        expect(fixture.componentInstance.isOpen()).toBe(false);

        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: originalFullscreenElement,
        });
      });
    });
  });
  describe('2. child component', () => {
    let fixture: ComponentFixture<ChildFullScreenComponent>;
    let debugElement: DebugElement;
    let directiveHtml: HTMLElement;
    let child: HTMLElement;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChildFullScreenComponent],
        providers: [
          provideZonelessChangeDetection(),
          {
            provide: DeviceTypeService,
            useValue: {
              isMobile: () => true,
              isDesktop: () => false,
              isTablet: () => false,
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ChildFullScreenComponent);
      debugElement = fixture.debugElement;
      directiveHtml = debugElement.query(By.directive(FullScreenDirective))
        .nativeElement as HTMLElement;
      child = directiveHtml.querySelector('#child') as HTMLElement;
      child.requestFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: child,
        });
        return Promise.resolve();
      });

      (document as any).exitFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: null,
        });
        return Promise.resolve();
      });
      Object.defineProperty(document as any, 'fullscreenEnabled', {
        configurable: true,
        value: true,
      });
      fixture.detectChanges();
    });
    describe('2.1. natgive fullscreen', () => {
      it('2.1.1. should be on fullscreen using requestFullscreen using native fullscreen', () => {
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        expect(child.requestFullscreen).toHaveBeenCalledTimes(1);

        fixture.componentInstance.isOpen.set(false);
        fixture.detectChanges();

        expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
      });
      it('2.1.2. should have close button and can be closed by it', async () => {
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        await Promise.resolve();

        let closeBtn = child.querySelector('button');
        expect(closeBtn).toBeTruthy();
        closeBtn?.click();
        expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
      });
    });
    describe('2.2. fullscreen class', () => {
      it('2.2. should be on fullscreen using fullscreen class if not using requestFullscreen', () => {
        fixture.componentInstance.useNativeFullScreen.set(false);
        fixture.detectChanges();
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        expect(child.classList.contains('fullscreen')).toBeTruthy();
        fixture.componentInstance.isOpen.set(false);
        fixture.detectChanges();
        expect(child.classList.contains('fullscreen')).toBeFalsy();
      });

      it('2.2.2. should have close button and should be able to close the fullscreen', () => {
        fixture.componentInstance.useNativeFullScreen.set(false);
        fixture.detectChanges();
        fixture.componentInstance.isOpen.set(true);
        fixture.detectChanges();
        let closeButton = child.querySelector('button');
        expect(closeButton).toBeTruthy();
        closeButton?.click();
        expect(child.classList.contains('fullscreen')).toBeFalsy();
      });
    });
  });

  describe('3. desktop', () => {
    let fixture: ComponentFixture<FullScreenComponent>;
    let debugElement: DebugElement;
    let directiveHtml: HTMLElement;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FullScreenComponent],
        providers: [
          provideZonelessChangeDetection(),
          {
            provide: DeviceTypeService,
            useValue: {
              isMobile: () => false,
              isDesktop: () => true,
              isTablet: () => false,
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FullScreenComponent);
      debugElement = fixture.debugElement;
      fixture.componentInstance.fullscreenMode.set('desktop');
      directiveHtml = debugElement.query(By.directive(FullScreenDirective))
        .nativeElement as HTMLElement;
      directiveHtml.requestFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: directiveHtml,
        });
        return Promise.resolve();
      });

      (document as any).exitFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: null,
        });
        return Promise.resolve();
      });
      Object.defineProperty(document as any, 'fullscreenEnabled', {
        configurable: true,
        value: true,
      });
      fixture.detectChanges();
    });

    it('3.1 should be fullscreen on desktop', async () => {
      fixture.componentInstance.isOpen.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      let closeButton = directiveHtml.querySelector('button');
      expect(closeButton).toBeTruthy();
      expect(directiveHtml.requestFullscreen).toHaveBeenCalledTimes(1);

      closeButton?.click();
      fixture.detectChanges();

      expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    });
  });
  describe('4. tablet', () => {
    let fixture: ComponentFixture<FullScreenComponent>;
    let debugElement: DebugElement;
    let directiveHtml: HTMLElement;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FullScreenComponent],
        providers: [
          provideZonelessChangeDetection(),
          {
            provide: DeviceTypeService,
            useValue: {
              isMobile: () => false,
              isDesktop: () => false,
              isTablet: () => true,
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FullScreenComponent);
      debugElement = fixture.debugElement;
      fixture.componentInstance.fullscreenMode.set('tablet');
      directiveHtml = debugElement.query(By.directive(FullScreenDirective))
        .nativeElement as HTMLElement;
      directiveHtml.requestFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: directiveHtml,
        });
        return Promise.resolve();
      });

      (document as any).exitFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: null,
        });
        return Promise.resolve();
      });
      Object.defineProperty(document as any, 'fullscreenEnabled', {
        configurable: true,
        value: true,
      });
      fixture.detectChanges();
    });

    it('4.1 should be fullscreen on desktop', async () => {
      fixture.componentInstance.isOpen.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      let closeButton = directiveHtml.querySelector('button');
      expect(closeButton).toBeTruthy();
      expect(directiveHtml.requestFullscreen).toHaveBeenCalledTimes(1);

      closeButton?.click();
      fixture.detectChanges();

      expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    });
  });
  describe('5. always', () => {
    let fixture: ComponentFixture<FullScreenComponent>;
    let debugElement: DebugElement;
    let directiveHtml: HTMLElement;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FullScreenComponent],
        providers: [
          provideZonelessChangeDetection(),
          {
            provide: DeviceTypeService,
            useValue: {
              isMobile: () => false,
              isDesktop: () => false,
              isTablet: () => false,
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FullScreenComponent);
      debugElement = fixture.debugElement;
      fixture.componentInstance.fullscreenMode.set('always');
      directiveHtml = debugElement.query(By.directive(FullScreenDirective))
        .nativeElement as HTMLElement;
      directiveHtml.requestFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: directiveHtml,
        });
        return Promise.resolve();
      });

      (document as any).exitFullscreen = vi.fn().mockImplementation(() => {
        Object.defineProperty(document as any, 'fullscreenElement', {
          configurable: true,
          value: null,
        });
        return Promise.resolve();
      });
      Object.defineProperty(document as any, 'fullscreenEnabled', {
        configurable: true,
        value: true,
      });
      fixture.detectChanges();
    });

    it('3.1 should be fullscreen on desktop', async () => {
      fixture.componentInstance.isOpen.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      let closeButton = directiveHtml.querySelector('button');
      expect(closeButton).toBeTruthy();
      expect(directiveHtml.requestFullscreen).toHaveBeenCalledTimes(1);

      closeButton?.click();
      fixture.detectChanges();

      expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    });
  });
});
