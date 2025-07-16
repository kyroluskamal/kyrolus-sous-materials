import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  inject,
  Injectable,
  signal,
  DOCUMENT
} from '@angular/core';
import { LoaderComponent } from './loader.component';


@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly loaderRef = signal<ComponentRef<LoaderComponent> | null>(
    null
  );
  private readonly appRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);

  private readonly environmentInjector = inject(EnvironmentInjector);
  readonly showloader = signal<boolean>(false);
  readonly loaderName = signal<string>('loader-spinner');
  show(loaderName: string = 'loader-spinner'): void {
    this.loaderName.set(loaderName);
    this.showloader.set(true);
    // if (this.loaderRef()) {
    //   this.hide();
    // }

    // this.loaderRef.set(
    //   createComponent(LoaderComponent, {
    //     environmentInjector: this.environmentInjector,
    //   })
    // );

    // this.loaderRef()?.instance.loaderName.set(loaderName);

    // this.appRef.attachView(this.loaderRef()?.hostView!);
    // if (this.document.body.append)
    //   this.document.body.append(this.loaderRef()?.location.nativeElement);
  }

  hide(): void {
    this.showloader.set(false);
    // if (this.loaderRef()) {
    //   this.appRef.detachView(this.loaderRef()?.hostView!);
    //   this.loaderRef()?.destroy();
    //   this.loaderRef.set(null);
    // }
  }
}
