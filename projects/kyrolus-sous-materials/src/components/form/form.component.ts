import {
  Component,
  ElementRef,
  inject,
  input,
  model,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  InputAppearance,
  InputColor,
  InputSize,
  KsForm,
} from '../form/input.types';
import {
  FORM_APPEARANCE,
  FORM_COLOR,
  FORM_SIZE,
} from '../../Tokens/tokens.exports';
import {
  ErrorStateMatcher,
  KsErrorStateMatcher,
} from '../form/error-state-matcher';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputComponent } from '../form/input.component';
import { FormService } from '../form/form.service';
import { IconDirective } from '../../directives/icon.directive';
import { PrefixDirective } from '../../directives/prefix.directive';
import { SuffixDirective } from '../../directives/suffix.directive';
import { NgTemplateOutlet } from '@angular/common';
import { CheckboxComponent } from './checkbox/checkbox.component';

@Component({
  selector: 'ks-form',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    IconDirective,
    PrefixDirective,
    SuffixDirective,
    NgTemplateOutlet,
    CheckboxComponent,
  ],
  providers: [
    {
      provide: FormService,
      useFactory: () => new FormService(),
    },
  ],
  templateUrl: './form.component.html',
  styles: ``,
})
export class FormComponent {
  readonly formService = inject(FormService);
  readonly fb = inject(FormBuilder);
  readonly errorStateMatcher = input<ErrorStateMatcher>(
    new KsErrorStateMatcher()
  );
  readonly createFromConfig = input<boolean>(false);
  readonly autoComplete = input<'on' | 'off'>('on');
  readonly submitBtn = viewChild('submitBtn', { read: NgTemplateOutlet });
  readonly ngSubmit = output<any>();
  readonly appearance = input<InputAppearance>(inject(FORM_APPEARANCE));
  readonly color = input<InputColor>(inject(FORM_COLOR));
  readonly size = input<InputSize>(inject(FORM_SIZE));

  readonly formGroup = model<FormGroup | null>(null);
  readonly formConfig = input<KsForm[]>([]);
  readonly styleClasses = input<string>('');
  readonly submitButton = input<TemplateRef<HTMLButtonElement> | null>(null);
  readonly formElementRef = viewChild('formNativeElement', {
    read: ElementRef<HTMLFormElement>,
  });
  constructor() {}
  ngOnInit() {
    this.formService.Parent = this;

    if (
      this.createFromConfig() &&
      this.formConfig().length > 0 &&
      this.formGroup()
    ) {
      this.formGroup.update((record) => {
        if (record) {
          return this.createForm(this.formConfig(), this.formGroup());
        }
        return record;
      });
    }
  }
  getFormRecord(formGroupName: string) {
    return this.formGroup()?.get(formGroupName) as FormRecord<
      FormControl | FormRecord
    >;
  }
  getFormArrray(formArrayName: string) {
    return this.formGroup()?.get(formArrayName) as FormArray;
  }
  getFormRecordByIndexFromFormArray(formArrayName: string, index: number) {
    return this.getFormArrray(formArrayName).at(index) as FormRecord<
      FormControl | FormRecord
    >;
  }
  createForm(conf: KsForm[], record: FormGroup | null) {
    conf.forEach((c) => {
      if (!['g', 'a'].includes(c.controlType ?? 'c')) {
        record?.addControl(
          c.formControlName!,
          this.fb.control(
            {
              value: c.defaultValue ?? null,
              disabled: c.disabled,
            },
            c.validators
          )
        );
      } else if (c.controlType === 'g' && !c.template) {
        if (c.internalFormGroup)
          record?.addControl(c.formGroupName!, this.fb.record({}));
      } else if (c.controlType === 'g' && c.template) {
        record?.addControl(
          c.formGroupName!,
          this.createForm(c.internalFormGroup!, this.fb.record({}))
        );
      }
    });
    return record;
  }
}
