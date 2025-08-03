import {
  Component,
  forwardRef,
  input,
  signal,
  output,
  computed,
  contentChildren,
  effect,
  model,
  inject,
  HostBinding,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { CheckboxComponent, CheckboxEvent } from './checkbox.component';
import { FormComponent, InputColor, InputError } from '../form.exports';
import { FormService } from '../form.service';
import { ErrorStateMatcher, KsErrorStateMatcher } from '../error-state-matcher';
import { FORM_COLOR } from '../../../Tokens/input.tokens';

@Component({
  selector: 'ks-checkbox-group',
  imports: [CheckboxComponent],
  template: `
    <div class="checkbox-group" role="group" [attr.aria-label]="label()">
      <!-- Parent checkbox for select all functionality -->
      <ks-checkbox
        [id]="id()"
        [color]="color()"
        [disable]="disable()"
        [required]="isRequired()!"
        [label]="label()"
        [(checked)]="checked"
        [labelPosition]="labelPosition()"
        [triState]="true"
        [(indeterminate)]="intermediate"
        (onChange)="onParentCheckboxChange($event)"
      >
      </ks-checkbox>

      <!-- Child checkboxes -->
      <div class="checkbox-group-items">
        <ng-content>
          <div
            class="d-flex flex-row justify-content-center align-items-center br-s-dashed br-c-gray"
          >
            Add child checkboxes
          </div>
        </ng-content>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
  styles: `.checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .checkbox-group-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-left: 24px;
    }`,
})
export class CheckboxGroupComponent implements ControlValueAccessor {
  readonly formService = inject(FormService, { host: true, optional: true });
  kyrolusForm: FormComponent | null = this.formService?.Parent ?? null;
  readonly formControlName = input<string>('');
  readonly formControl = input<FormControl | null>(null); //done
  readonly errorStateMatcher = input<ErrorStateMatcher>(
    this.kyrolusForm?.errorStateMatcher() ?? new KsErrorStateMatcher()
  );
  readonly color = input<InputColor>(
    this.kyrolusForm?.color() ?? (inject(FORM_COLOR) || 'primary')
  );
  readonly label = model<string>('');

  readonly errorMessages = input<InputError[]>([
    {
      errorKey: 'required',
      errorMessage: this.label()
        ? `${this.label()} is required`
        : 'This field is required',
    },
  ]);
  readonly aria_describedby = computed(() =>
    `${this.label()} ${this.errorMessages()
      .map((e) => e.errorKey)
      .join(' ')}`.trim()
  );
  readonly formContainer = inject(ControlContainer, { optional: true });
  readonly control = signal<FormControl | null>(null);

  readonly isRequired = computed(
    () =>
      (this.required() ||
        this.control()?.invalid ||
        this.control()?.hasValidator(Validators.requiredTrue) ||
        this.control()?.hasValidator(Validators.required)) &&
      !this.disable() &&
      this.isErrorState()
  );
  readonly isErrorState = computed(() => {
    return this.errorStateMatcher().isErrorState(
      this.control(),
      this.formContainer
    );
  });
  readonly disable = model<boolean>(false);
  readonly required = input(false);
  readonly change = output<any[]>();
  readonly checkboxes = contentChildren(CheckboxComponent);
  readonly checked = signal<boolean>(false);
  readonly labelPosition = input<'before' | 'after'>('after');
  readonly allSelected = computed(
    () => this.totalItems() > 0 && this.selectedCount() === this.totalItems()
  );
  readonly someSelected = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.totalItems()
  );
  readonly id = input(
    `checkbox-group-${Math.random().toString(36).substring(2, 11)}`
  );
  readonly intermediate = signal<boolean | null>(false);
  effect = effect(() => {
    this.value.set([]);
    this.checkboxes().forEach((checkbox: CheckboxComponent) => {
      if (checkbox) {
        if (checkbox.checked()) {
          this.value.update((res) => {
            return [...res, checkbox.value()];
          });
        }
      }
    });
    this.selectedCount.set(this.value().length);
    if (this.allSelected()) {
      this.checked.set(true);
      this.intermediate.set(null);
    } else if (this.someSelected()) {
      this.checked.set(false);
      this.intermediate.set(true);
    } else {
      this.intermediate.set(false);
      this.checked.set(false);
    }

    if (this.disable()) this.disableAllCheckboxes();
  });
  private onTouched: () => void = () => {};
  private onModelChange: (value: any[]) => void = () => {};

  value = signal<any[]>([]);

  private readonly totalItems = computed(() => this.checkboxes().length);
  private readonly selectedCount = signal(0);

  onParentCheckboxChange(checked: CheckboxEvent) {
    this.checkboxes()
      .filter((c) => !c.disable())
      .forEach((checkbox: CheckboxComponent) => {
        if (
          (checked.checked && !checked.indeterminate) ||
          (!checked.checked && this.someSelected())
        ) {
          checkbox.checked.set(true);
        } else {
          checkbox.checked.set(false);
        }
      });
    this.intermediate.set(null);
    this.emitChange();
  }

  updateValue(value: any): void {
    const index = this.value().indexOf(value);
    if (index === -1) {
      this.value.update((res) => {
        return [...res, value];
      });
      this.selectedCount.update((res) => {
        return res + 1;
      });
    } else {
      this.value.update((res) => {
        return res.filter((item) => item !== value);
      });
      this.selectedCount.update((res) => {
        return res - 1;
      });
    }
    this.onModelChange(this.value());
    this.change.emit(this.value());
  }
  writeValue(value: any[]): void {
    this.value.set(value || []);
    this.selectedCount.set(this.value.length);
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable.set(isDisabled);
    this.disableAllCheckboxes();
  }
  private disableAllCheckboxes(): void {
    this.checkboxes().forEach((checkbox: CheckboxComponent) => {
      checkbox.disable.set(true);
    });
  }
  private emitChange(): void {
    this.onTouched();
    this.onModelChange(this.value());
    this.change.emit(this.value());
  }

  @HostBinding('class.text-danger')
  get dangerClass() {
    return (
      this.control()?.invalid &&
      this.errorStateMatcher().isErrorState(this.control(), this.formContainer)
    );
  }
}
