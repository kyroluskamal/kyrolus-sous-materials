import {
  AfterViewInit,
  Component,
  computed,
  contentChild,
  ElementRef,
  forwardRef,
  HostBinding,
  inject,
  input,
  model,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ControlContainer,
  FormControl,
} from '@angular/forms';
import {
  InputAppearance,
  InputColor,
  InputSize,
  InputType,
  InputError,
} from './input.types';
import { DirectionService } from '../../services/direction.service';
import { NgTemplateOutlet } from '@angular/common';
import { FORM_APPEARANCE, FORM_COLOR } from '../../Tokens/tokens.exports';
import { ErrorStateMatcher, KsErrorStateMatcher } from './error-state-matcher';
import { FormComponent } from './form.component';
import { FormService } from './form.service';
import { PrefixDirective } from '../../directives/prefix.directive';
import { SuffixDirective } from '../../directives/suffix.directive';

@Component({
  selector: 'ks-input',
  imports: [FormsModule, ReactiveFormsModule, NgTemplateOutlet],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    @if(appearance() !== 'ghost'){
    <ng-container [ngTemplateOutlet]="labelTplt"></ng-container>

    }
    <div class="w-100 d-flex flex-column position-relative mb-15">
      <div
        (mouseenter)="isHovered.set(true)"
        (mouseleave)="isHovered.set(false)"
        [class]="inputWrraperClasses()"
        [attr.appearance]="appearance()"
      >
        <ng-container [ngTemplateOutlet]="_input"></ng-container>
      </div>
      @for(e of errorMessages(); track $index){
      @if(this.control()?.hasError(e.errorKey) &&
      errorStateMatcher().isErrorState( this.control(), this.formContainer ) ){
      <div class="px-5">
        <div class="text-danger form-control-error position-absolute">
          {{ e.errorMessage }}
        </div>
      </div>
      } }
    </div>
    @if(tooltip()){

    <div [id]="'tooltip'" class="tooltip" role="tooltip">
      {{ tooltip() }}
    </div>
    }

    <!-- ######### Templates ############ -->
    <ng-template #labelTplt>
      @if(label()){
      <label #lableTpl [class]="labelClasses()" [for]="id() ?? label()">
        {{ label() }}
        @if(isRequired()){
        <span class="text-danger fw-900">*</span>
        }
      </label>
      }
    </ng-template>
    <ng-template #_input>
      @if(leftIcon() !==undefined){

      <div
        [class]="leftIconClases() + ' br-' + color()"
        [class.bg-grey-35]="
          appearance() === 'n-horizontal' ||
          appearance() === 'n-vertical' ||
          appearance() === 'normal-float'
        "
        [class.br-s-solid]="
          appearance() === 'n-horizontal' ||
          appearance() === 'n-vertical' ||
          appearance() === 'normal-float'
        "
        class=" d-flex flex-row justify-content-center align-items-center icon-left"
      >
        <ng-content select="[ksPrefix]"></ng-content>
      </div>

      }
      <input
        (focus)="inputFocused.set(true)"
        [attr.placeholder]="placeholder()"
        [attr.disabled]="disable() ? true : null"
        [class]="inputClases()"
        [id]="id() ?? label()"
        [type]="type()"
        [required]="isRequired()"
        [readonly]="readonly()"
        [attr.autocomplete]="autocomplete()"
        [attr.min]="min()"
        [attr.max]="max()"
        [attr.minLength]="minlength()"
        [attr.maxlength]="maxlength()"
        [attr.pattern]="pattern()"
        [attr.aria-label]="label() || placeholder() || null"
        [attr.aria-required]="isRequired()"
        [attr.aria-invalid]="control()?.invalid"
        [attr.aria-describedby]="aria_describedby()"
        [attr.name]="name()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [value]="value()"
        [attr.appearance]="appearance()"
      />
      @if(rightIcon()!==undefined){
      <div
        [class]="rightIconClases() + ' br-' + color()"
        [class.bg-grey-35]="
          appearance() === 'n-horizontal' ||
          appearance() === 'n-vertical' ||
          appearance() === 'normal-float'
        "
        [class.br-s-solid]="
          appearance() === 'n-horizontal' ||
          appearance() === 'n-vertical' ||
          appearance() === 'normal-float'
        "
        class="br-s-solid bg-grey-35 d-flex flex-row justify-content-center align-items-center icon-right"
      >
        <ng-content select="[ksSuffix]"></ng-content>
      </div>
      }
    </ng-template>
  `,
  styles: ``,
})
export class InputComponent
  implements ControlValueAccessor, OnInit, AfterViewInit
{
  ngAfterViewInit(): void {
    if (this.appearance() === 'outline') {
      let label = this.labelTemplate()?.nativeElement as HTMLLabelElement;
      if (this.leftIcon() && !label.classList.contains('floating-label')) {
        (this.labelTemplate()?.nativeElement as HTMLLabelElement).style.left =
          '30px';
      }
    }
  }
  readonly formService = inject(FormService, { host: true, optional: true });
  kyrolusForm: FormComponent | null = this.formService?.Parent ?? null;
  readonly errorStateMatcher = input<ErrorStateMatcher>(
    this.kyrolusForm?.errorStateMatcher() ?? new KsErrorStateMatcher()
  );
  readonly id = input<string | null>(null);
  readonly leftIcon = contentChild(PrefixDirective); //done
  readonly rightIcon = contentChild(SuffixDirective); //done
  readonly formControlName = input<string>(''); //done
  readonly formControl = input<FormControl | null>(null); //done
  readonly type = model<InputType>('text'); //done
  readonly color = input<InputColor>(
    this.kyrolusForm?.color() ?? (inject(FORM_COLOR) || 'primary')
  ); //done
  readonly size = input<InputSize>('lg'); //done
  readonly appearance = input<InputAppearance>(
    this.kyrolusForm?.appearance() ?? (inject(FORM_APPEARANCE) || 'outline')
  );
  readonly placeholder = input<string | null>(null);
  readonly label = input<string>('');
  readonly tooltip = input<string>('');
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
  readonly labelTemplate = viewChild('lableTpl', { read: ElementRef });
  readonly disable = model<boolean | null>(null);
  readonly required = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly autocomplete = input<string | null>(null);
  readonly min = input<number | string | null>(null);
  readonly max = input<number | string | null>(null);
  readonly minlength = input<number | null>(null);
  readonly maxlength = input<number | null>(null);
  readonly pattern = input<string | null>(null);
  readonly formContainer = inject(ControlContainer, { optional: true });
  readonly control = signal<FormControl | null>(null);
  readonly name = input<string | null>(null);
  readonly isRequired = computed(
    () =>
      (this.required() || this.control()?.hasValidator(Validators.required)) &&
      !this.disable()
  );
  readonly value = signal<any>('');
  readonly dir = inject(DirectionService);
  readonly touched = signal<boolean>(false);
  readonly leftIconClases = computed(() => {
    if (this.dir.direction() == 'ltr') {
      return `left-icon br-r-tl-3 br-r-bl-3 br-w-r-1 br-r-only `;
    } else {
      return 'right-icon br-r-tr-3 br-r-br-3 br-w-l-1 br-l-only';
    }
  });
  readonly rightIconClases = computed(() => {
    if (this.dir.direction() == 'ltr') {
      return 'right-icon br-r-tr-3 br-r-br-3 br-w-l-1 br-l-only ';
    } else {
      return 'left-icon br-r-tl-3 br-r-bl-3 br-r-only br-w-r-1';
    }
  });
  readonly isHovered = signal<boolean>(false);
  readonly inputFocused = signal<boolean>(false);

  readonly errorState = computed(() => {
    return this.errorStateMatcher().isErrorState(
      this.control(),
      this.formContainer
    );
  });
  private readonly inputEventIsTriggered = signal<boolean>(false);
  ngOnInit() {
    const control =
      this.formControl() ??
      (this.formContainer?.control?.get(this.formControlName()) as FormControl);
    if (control) {
      this.control.set(control);
    }
  }
  // ControlValueAccessor implementation
  onChange = (value: any) => {};
  onTouched = () => {};
  writeValue(value: any): void {
    if (value === undefined || value === null) return;
    this.value.set(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disable.set(isDisabled);
  }
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChange(this.value());
    this.inputEventIsTriggered.set(!this.inputEventIsTriggered());
  }
  onBlur(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
    this.inputFocused.set(false);
  }
  @HostBinding('class')
  get classes() {
    return this.mainDivClasses();
  }
  @HostBinding('attr.appearance') get app() {
    return this.appearance();
  }

  readonly mainDivClasses = computed(() => {
    let classes = 'd-flex position-relative  ' + this.size();

    switch (this.appearance()) {
      case 'n-horizontal':
        classes += ' horizontal';
        break;
      case 'outline':
      case 'normal-float':
        classes += ' position-relative';
        break;
      default:
        classes += ' flex-column';
    }
    return classes;
  });

  readonly inputWrraperClasses = computed(() => {
    this.inputEventIsTriggered();
    let classes =
      'input-wrapper flex-1 d-flex flex-row fsi-2  position-relative ';

    if (!this.leftIcon() && !this.rightIcon()) {
      classes += ' px-5';
    } else if (this.leftIcon() && !this.rightIcon()) {
      classes += ' pr-5';
    } else if (!this.leftIcon() && this.rightIcon()) {
      classes += ' pl-5';
    }

    const borderRaduius = 'br-r-3';
    classes += this.getAppearanceClasses(borderRaduius);
    if (this.inputFocused()) {
      classes += this.getFocusedClasses();
    }
    return classes;
  });

  readonly labelClasses = computed(() => {
    let classes =
      'd-flex flex-row gap-2 justify-content-start align-items-center';
    if (['outline', 'fill', 'normal-float'].includes(this.appearance())) {
      classes += ` floating-label text-grey-29 ${
        this.dir.direction() === 'ltr' ? 'ml-5' : 'mr-5'
      }`;

      if (this.inputFocused() || this.value()) {
        classes += ` _float text-${this.color()}`;
      } else if (this.leftIcon() || this.rightIcon()) {
        classes += ` label-margin`;
      }
    }
    return classes;
  });

  readonly inputClases = computed(() => {
    let classes = `br-none flex-1 ${this.size()}`;
    if (this.appearance() === 'outline') {
      if (!this.leftIcon() && !this.rightIcon()) {
        classes += ' mx-5';
      } else if (this.leftIcon() && !this.rightIcon()) {
        classes += ' mr-5';
      } else if (!this.leftIcon() && this.rightIcon()) {
        classes += ' ml-5';
      }
    } else {
      classes += ' mx-5';
    }

    if (['outline'].includes(this.appearance())) {
      classes += ' outline-none';
    }

    return classes;
  });

  private getAppearanceClasses(borderRaduius: string): string {
    let classes = '';
    switch (this.appearance()) {
      case 'n-horizontal':
      case 'n-vertical':
      case 'normal-float':
        classes += ` br-w-1 br-s-solid ${borderRaduius} br-${
          this.control()?.invalid &&
          this.errorStateMatcher().isErrorState(
            this.control(),
            this.formContainer
          )
            ? 'danger'
            : this.color()
        }`;
        break;
      case 'outline':
        classes += `br-grey-20 br-w-1 br-s-solid ${borderRaduius} br-${
          this.control()?.invalid &&
          this.errorStateMatcher().isErrorState(
            this.control(),
            this.formContainer
          )
            ? 'danger'
            : this.color()
        }`;
        break;
      case 'ghost':
        classes += `${borderRaduius}`;
        break;
    }
    return classes;
  }

  private getFocusedClasses(): string {
    let classes = '';
    if (this.appearance() !== 'ghost') {
      classes += ` box-shadow-${
        this.control()?.invalid &&
        this.errorStateMatcher().isErrorState(
          this.control(),
          this.formContainer
        )
          ? 'danger'
          : this.color()
      }`;
    }
    if (this.appearance() === 'outline') {
      classes += ` br-w-1 br-${
        this.control()?.invalid &&
        this.errorStateMatcher().isErrorState(
          this.control(),
          this.formContainer
        )
          ? 'danger'
          : this.color()
      }`;
    } else if (this.appearance() === 'ghost') {
      classes += ` br-w-1 br-s-solid br-${
        this.control()?.invalid &&
        this.errorStateMatcher().isErrorState(
          this.control(),
          this.formContainer
        )
          ? 'danger'
          : this.color()
      }`;
    }
    return classes;
  }
}
