import { computed, inject, Injectable } from '@angular/core';
import { DeviceInfoService } from './device-info.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeService {
  private readonly dev = inject(DeviceInfoService);
  readonly deviceType = this.dev.pick('deviceType');
  /* v8 ignore start */
  readonly isDesktop = computed(() => this.deviceType() === 'desktop');
  readonly isMobile = computed(() => this.deviceType() === 'mobile');
  readonly isTablet = computed(() => this.deviceType() === 'tablet');
  /* v8 ignore end */
  readonly isHandheld = computed(() => {
    return this.isMobile() || this.isTablet();
  });
  readonly isBot = computed(() => this.deviceType() === 'bot');
  private readonly touchPoints = this.dev.pick('maxTouchPoints');
  readonly isTouchCapable = computed(() => {
    const touch = this.touchPoints();
    return typeof touch === 'number' ? touch > 0 : this.isHandheld();
  });
}
