import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  forwardRef,
  HostBinding,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { InputColor, InputError } from '../input.types';
import { FormService } from '../form.service';
import { FormComponent } from '../form.component';
import { ErrorStateMatcher, KsErrorStateMatcher } from '../error-state-matcher';
import { FORM_COLOR } from '../../../Tokens/input.tokens';
export type CheckboxEvent = {
  checked: boolean;
  indeterminate: boolean | null;
  value: any;
};
@Component({
  selector: 'ks-checkbox',
  host: { class: 'mb-15' },
  imports: [NgTemplateOutlet],
  templateUrl: './checkbox.component.html',
  styleUrl: `checkbox.component.scss`,
  animations: [
    trigger('checkmarkState', [
      state(
        'unchecked',
        style({
          transform: 'scale(0)',
        })
      ),
      state(
        'checked',
        style({
          transform: 'scale(1)',
        })
      ),
      transition('unchecked => checked', animate('200ms ease-out')),
      transition('checked => unchecked', animate('200ms ease-in')),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  [x: string]: any;
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
      !this.disable()
  );
  readonly checked = model<boolean>(false);
  readonly indeterminate = model<boolean | null>(null);
  readonly disable = model(false);
  readonly required = model(false);
  readonly id = input(
    `checkbox-${Math.random().toString(36).substring(2, 11)}`
  );
  readonly isErrorState = computed(() => {
    return this.errorStateMatcher().isErrorState(
      this.control(),
      this.formContainer
    );
  });
  validatorRequired = Validators.requiredTrue;
  readonly value = model<boolean | null>();
  readonly binary = model(false);
  readonly triState = model(false);
  readonly labelTemplate = model<TemplateRef<any>>();
  readonly labelPosition = input<'before' | 'after'>('after');
  readonly onChangeFn = output<any>();
  readonly onChange = output<CheckboxEvent>();
  readonly change = output<boolean>();

  private onTouched: () => void = () => {};
  private onModelChange: (value: any) => void = () => {};

  ariaChecked = computed(() =>
    this.indeterminate() ? 'mixed' : this.checked().toString()
  );

  hasError = computed(() => {
    return (
      this.control()?.invalid &&
      this.errorStateMatcher().isErrorState(this.control(), this.formContainer)
    );
  }); //done
  eff = effect(() => {
    if (this.indeterminate()) {
      this.checked.set(false);
    }
  });
  ngOnInit() {
    const control =
      this.formControl() ??
      (this.formContainer?.control?.get(this.formControlName()) as FormControl);
    if (control) {
      this.control.set(control);
      this.value.set(control.value);
    }
  }
  toggle() {
    if (this.disable()) return;
    if (this.triState()) {
      if (!this.checked() && !this.indeterminate()) {
        this.checked.set(true);
        this.indeterminate.set(false);
      } else if (this.checked() && !this.indeterminate()) {
        this.checked.set(false);
        this.indeterminate.set(true);
      } else if (!this.checked() && this.indeterminate()) {
        this.checked.set(false);
        this.indeterminate.set(false);
      }
    } else {
      this.checked.set(!this.checked());
      this.indeterminate.set(false);
    }
    this.emitChange();
  }

  onSpaceKey(event: Event) {
    event.preventDefault();
    this.toggle();
  }

  onEnterKey(event: Event) {
    this.toggle();
  }

  private emitChange() {
    this.onTouched();
    this.change.emit(this.checked());
    this.onModelChange(this.getValue());
    this.onChange.emit({
      checked: this.checked(),
      indeterminate: this.indeterminate(),
      value: this.getValue(),
    });
  }

  private getValue(): any {
    if (this.binary()) return this.checked();
    if (this.triState()) return this.indeterminate() ? null : this.checked();
    return this.checked();
  }

  writeValue(value: boolean | null): void {
    if (this.binary()) {
      this.checked.set(!!value);
    } else if (this.triState()) {
      this.checked.set(value ?? false);
      this.indeterminate.set(value);
    } else {
      this.checked.set(value ?? false);
    }
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable.set(isDisabled);
  }

  @HostBinding('class.text-danger')
  get dangerClass() {
    return (
      this.control()?.invalid &&
      this.errorStateMatcher().isErrorState(this.control(), this.formContainer)
    );
  }
}
