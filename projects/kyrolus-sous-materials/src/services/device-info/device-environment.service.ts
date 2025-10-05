import { inject, Injectable } from '@angular/core';
import { DeviceInfoService } from './device-info.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceEnvironmentService {
  private readonly dev = inject(DeviceInfoService);

  // OS & Browser
  readonly platformVersion = this.dev.pick('platformVersion');
  readonly browser = this.dev.pick('browser');
  readonly browserVer = this.dev.pick('browserVersion');

  // Platform/Vendor/UA
  readonly platform = this.dev.pick('platform');
  readonly vendor = this.dev.pick('vendor');
  readonly userAgent = this.dev.pick('userAgent');

  // Screen & Hardware
  readonly screen = this.dev.pick('screen');
  readonly hardwareConcurrency = this.dev.pick('hardwareConcurrency');
  readonly deviceMemory = this.dev.pick('deviceMemory');

  // High-entropy (لو محتاجها هنا)
  readonly bitness = this.dev.pick('bitness');
  readonly architecture = this.dev.pick('architecture');
  readonly model = this.dev.pick('model');
  readonly formFactors = this.dev.pick('formFactors');
  readonly wow64 = this.dev.pick('wow64');
}
