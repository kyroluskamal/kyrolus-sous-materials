import { TemplateRef } from '@angular/core';

export type Menu = IMenuWithSections | IMenuWithoutSection;

export interface IMenuItem<TTemplateBefore = any, TTemplateAfter = any> {
  id: string;
  label: string;
  href?: string;
  action?: () => void;
  before?: TemplateRef<TTemplateBefore>;
  after?: TemplateRef<TTemplateAfter>;
  disabled?: boolean;
  visible?: boolean;
  order?: number;
  tooltip?: string;
}

export interface IMenuWithSections {
  sections: IMenuSection[];
}

export interface IMenuSection {
  title: string;
  items: IMenuItem[];
}
export interface IMenuWithoutSection {}
