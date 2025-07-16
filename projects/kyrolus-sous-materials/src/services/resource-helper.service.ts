import {
  inject,
  Injectable,
  Injector,
  ResourceRef,
  runInInjectionContext,
  Signal,
  WritableSignal,
} from '@angular/core';
import { toObservable, ToObservableOptions } from '@angular/core/rxjs-interop';
import { filter, Observer, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResourceHelperService {
  injector = inject(Injector);

  deleteFromResourceById<
    TSource extends { id: TKey },
    TTarget extends { id: TKey },
    TKey
  >(opts: {
    source:
      | WritableSignal<ResourceRef<TSource | undefined> | null>
      | Signal<ResourceRef<TSource | undefined> | null>;
    target: ResourceRef<TTarget[] | undefined>;
  }) {
    let sourceId = opts.source()?.value()?.id;
    opts.target.update((items) => {
      return items ? items.filter((item) => item.id !== sourceId) : undefined;
    });
    (opts.source as any).set(null);
  }

  addToResource<
    TSource extends { id: TKey },
    TTarget extends { id: TKey },
    TKey
  >(opts: {
    source:
      | WritableSignal<ResourceRef<TSource | undefined> | null>
      | Signal<ResourceRef<TSource | undefined> | null>;
    target: ResourceRef<TTarget[] | undefined>;
  }) {
    opts.target.update((items) => {
      return [...(items ?? []), opts.source()?.value() as any as TTarget];
    });
    (opts.source as any).set(null);
  }

  updateResource<
    TSource extends { id: TKey },
    TTarget extends { id: TKey },
    TKey
  >(opts: {
    source:
      | WritableSignal<ResourceRef<TSource | undefined> | null>
      | Signal<ResourceRef<TSource | undefined> | null>;
    target: ResourceRef<TTarget[] | undefined>;
  }) {
    opts.target.update((items) => {
      if (!items) return undefined;
      let sourceId = opts.source()?.value()?.id;
      let index = items.findIndex((x) => x.id === sourceId);
      if (index !== -1) {
        items[index] = opts.source()?.value() as unknown as TTarget;
      }
      return [...items];
    });
    (opts.source as any).set(null);
  }

  patchResourceById<
    TSource extends { id: TKey },
    TTarget extends { id: TKey },
    TKey
  >(opts: {
    source:
      | WritableSignal<ResourceRef<TSource | undefined> | null>
      | Signal<ResourceRef<TSource | null> | undefined>;
    target: ResourceRef<TTarget[] | undefined>;
    patch: Partial<TTarget>;
  }) {
    opts.target.update((items) => {
      let sourceId = opts.source()?.value()?.id;
      return items
        ? items.map((x) => (x.id === sourceId ? { ...x, ...opts.patch } : x))
        : undefined;
    });
    (opts.source as any).set(null);
  }

  ApiCallHelper<T, S extends T>(options: {
    signalToObserve: Signal<T> | WritableSignal<T>;
    filter: (value: T, index: number) => value is S;
    observerOrNext?: Partial<Observer<T>> | ((value: T) => void);
    takeCount?: number;
    options?: ToObservableOptions;
  }) {
    runInInjectionContext(this.injector, () => {
      toObservable(options.signalToObserve, options.options)
        .pipe(filter(options.filter), take(options.takeCount ?? 1))
        .subscribe(options.observerOrNext);
    });
  }
}
