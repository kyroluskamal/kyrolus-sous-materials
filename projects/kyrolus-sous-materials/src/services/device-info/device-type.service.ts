import { computed, inject, Injectable } from '@angular/core';
import { DeviceInfoService } from './device-info.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeService {
  private readonly dev = inject(DeviceInfoService);
  readonly deviceType = this.dev.pick('deviceType');
  readonly isDesktop = computed(() => this.deviceType() === 'desktop');
  readonly isMobile = computed(() => this.deviceType() === 'mobile');
  readonly isTablet = computed(() => this.deviceType() === 'tablet');
  readonly isHandheld = computed(() => {
    return this.isMobile() || this.isTablet();
  });
  readonly isBot = computed(() => this.deviceType() === 'bot');
  readonly isTouchCapable = computed(() => {
    const touch = this.dev.pick('maxTouchPoints')();
    return touch ? touch > 0 : this.isMobile() || this.isTablet();
  });
}
