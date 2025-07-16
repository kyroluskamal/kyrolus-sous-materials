import { TemplateRef } from '@angular/core';
import { Icon } from '../../directives/icon.types';
import { ErrorStateMatcher } from './error-state-matcher';
import { ValidatorFn } from '@angular/forms';
import { InputComponent } from './input.component';

export type InputColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'light'
  | 'dark';
export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'
  | 'checkbox'
  | 'checkbox-group';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputIcon = 'left' | 'right';
export type InputAppearance =
  | 'outline'
  | `ghost`
  | 'n-horizontal'
  | 'normal-float'
  | 'ghost'
  | 'n-vertical';

export type InputError = {
  errorKey: string;
  errorMessage?: string;
};
export type CheckBoxConfig = {
  label: string;
  labelPosition: 'before' | 'after';
  indeterminate?: boolean;
  binary?: boolean;
  triState?: boolean;
  checked?: boolean;
};
export interface KsForm {
  appearance?: InputAppearance;
  color?: InputColor;
  size?: InputSize;
  DoNotshowInHtml?: boolean;
  errorStateMatcher?: ErrorStateMatcher;
  controlType?: 'c' | 'g' | 'a';
  formControlName?: string;
  internalFormGroup?: KsForm[];
  internalFormArray?: KsForm[];
  template?: TemplateRef<any>;
  formGroupName?: string;
  formArrayName?: string;
  min?: number | null;
  max?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  readonly?: boolean | null;
  required?: boolean;
  disabled?: boolean | null;
  placeholder?: string | null;
  type?: InputType | null;
  label?: string | null;
  iconLeft?: Icon | null;
  iconRight?: Icon | null;
  errorMessages?: InputError[];
  autocomplete?: string | null;
  pattern?: string | null;
  order?: number;
  defaultValue?: any;
  validators?: ValidatorFn | ValidatorFn[];
  formArrayTableHeaders?: string[];
  fieldSetLegend?: string;
  htmlSeparator?: string;
  id?: string;
  checkboxConfig?: CheckBoxConfig;
  name?: string;
}

export type KsIConEvent = {
  event: any;
  input: InputComponent;
  icon: Icon;
};
