import { computed, inject, Injectable } from '@angular/core';
import { DeviceInfoService } from './device-info.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceEnvironmentService {
  private readonly dev = inject(DeviceInfoService);
  readonly platformVersion = this.dev.pick('platformVersion');
  readonly browser = this.dev.pick('browser');
  readonly browserVersion = this.dev.pick('browserVersion');
  readonly platform = this.dev.pick('platform');
  readonly vendor = this.dev.pick('vendor');
  readonly userAgent = this.dev.pick('userAgent');
  /* v8 ignore start */
  readonly screen = computed(() => {
    const s = this.dev.pick('screen')();
    return s ? Object.freeze({ ...s }) : s;
  });
  /* v8 ignore end */
  readonly hardwareConcurrency = this.dev.pick('hardwareConcurrency');
  readonly deviceMemory = this.dev.pick('deviceMemory');
  readonly bitness = this.dev.pick('bitness');
  readonly architecture = this.dev.pick('architecture');
  readonly model = this.dev.pick('model');
  readonly formFactors = this.dev.pick('formFactors');
  readonly wow64 = this.dev.pick('wow64');
}
