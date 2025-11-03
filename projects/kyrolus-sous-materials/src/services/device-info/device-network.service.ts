// device-network.service.ts
import { Injectable, Signal, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, merge, startWith, map, distinctUntilChanged } from 'rxjs';
import { EffectiveConnectionType, NetInfo } from '../../models/device-info';

@Injectable({ providedIn: 'root' })
export class DeviceNetworkService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly online = this.isBrowser
    ? toSignal(
        merge(
          fromEvent(globalThis.window, 'online', { passive: true }),
          fromEvent(globalThis.window, 'offline', { passive: true })
        ).pipe(
          startWith(null),
          map(() =>
            typeof navigator !== 'undefined' && 'onLine' in navigator
              ? (navigator as any).onLine
              : true
          ),
          distinctUntilChanged()
        ),
        {
          initialValue:
            typeof navigator !== 'undefined' && 'onLine' in navigator
              ? navigator.onLine
              : true,
        }
      )
    : signal(true);

  private readonly _info: Signal<NetInfo> = (() => {
    if (!this.isBrowser) return signal(defaultNetInfo());

    let conn: any = null;
    try {
      conn =
        (navigator as any)?.connection ??
        (navigator as any)?.mozConnection ??
        (navigator as any)?.webkitConnection ??
        null;
    } catch {
      conn = null;
    }

    if (!conn) {
      return signal(defaultNetInfo());
    }

    return toSignal(
      fromEvent(conn, 'change').pipe(
        startWith(undefined),
        map(() => readConnection(conn))
      ),
      { initialValue: readConnection(conn) }
    );
  })();

  readonly info: Signal<NetInfo> = this._info;
}

// ===== Helpers =====
function defaultNetInfo(): NetInfo {
  return {
    effectiveType: undefined,
    saveData: undefined,
    downlink: undefined,
    rtt: undefined,
  };
}

function readConnection(conn: any): NetInfo {
  let effective: EffectiveConnectionType | undefined = undefined;
  const et = conn?.effectiveType;

  if (typeof et === 'string') {
    switch (et) {
      case 'slow-2g':
      case '2g':
      case '3g':
      case '4g':
        effective = et;
        break;
      default:
        effective = 'unknown';
        break;
    }
  }

  return {
    effectiveType: effective,
    saveData: typeof conn?.saveData === 'boolean' ? conn.saveData : undefined,
    downlink: typeof conn?.downlink === 'number' ? conn.downlink : undefined,
    rtt: typeof conn?.rtt === 'number' ? conn.rtt : undefined,
  };
}
