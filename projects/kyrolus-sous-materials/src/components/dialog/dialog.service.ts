import {
  ApplicationRef,
  ComponentRef,
  computed,
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
  Type,
  ViewContainerRef,
  WritableSignal,
  DOCUMENT
} from '@angular/core';

import { DialogComponent } from './dialog.component';
import { DialogConfig, DialogRef } from './dialog.types';


@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly activeDialogs = signal<DialogRef[]>([]);
  private viewContainerRef!: ViewContainerRef;
  private readonly dialogCounter = signal(0);
  private readonly document = inject(DOCUMENT);
  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }
  readonly dialogCount = computed(() => this.activeDialogs().length);
  open<TComponent = any, TData = any, TResponse = any>(
    component: Type<TComponent> | null,
    config: DialogConfig<TData> = new DialogConfig()
  ): DialogRef<TComponent, TData> {
    if (!this.viewContainerRef) {
      throw new Error('ViewContainerRef not set');
    }
    const dialogId = this.dialogCounter() + 1;
    this.dialogCounter.set(dialogId);
    const dialogComponentRef =
      this.viewContainerRef.createComponent(DialogComponent);
    dialogComponentRef.instance.contentComponent.set(component);
    dialogComponentRef.instance.config.set(config);
    dialogComponentRef.instance.id.set(`dialog-${dialogId}`);
    dialogComponentRef.instance.opendProgrammatically.set(true);
    dialogComponentRef.instance.open.set(true);
    this.document.body.appendChild(dialogComponentRef.location.nativeElement);
    const dialogRef: DialogRef<TComponent, TData> = {
      componentInstance: dialogComponentRef.instance as TComponent,
      afterClosed: signal<TResponse | null>(null),
      getData: () => config?.data as TData,
    };
    let isClosed = signal(false);
    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (!dialogComponentRef.instance.open()) {
          (dialogRef.afterClosed as WritableSignal<TResponse | null>).set(
            dialogComponentRef.instance.result()
          );
          this.closeDialog(dialogComponentRef);
          isClosed.set(true);
        }
      });
    });

    let _ = computed(() => {
      if (isClosed()) {
        return this.activeDialogs().filter((dialog) => dialog !== dialogRef);
      }
      return this.activeDialogs();
    });
    this.activeDialogs.update((dialogs) => [...dialogs, dialogRef]);

    return dialogRef;
  }

  private closeDialog<T>(componentRef: ComponentRef<T>) {
    componentRef.destroy();
    this.document.body.removeChild(componentRef.location.nativeElement);
    this.viewContainerRef.clear();
  }
}
