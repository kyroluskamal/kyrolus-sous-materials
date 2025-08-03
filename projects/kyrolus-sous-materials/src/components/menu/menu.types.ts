import { TemplateRef } from '@angular/core';

export type Menu = IMenuWithSections | IMenuWithoutSection;

export interface IMenuItem<TTemplateBefore = any, TTemplateAfter = any> {
  id: string;
  label: string;
  href?: string;
  routerLink?: string;
  action?: () => void;
  before?: TemplateRef<TTemplateBefore>;
  after?: TemplateRef<TTemplateAfter>;
  disabled?: boolean;
  visible?: boolean;
  order?: number;
  tooltip?: string;
  items?: IMenuItem[];
  separator?: never;
}

export interface IMenuWithSections {
  sections: IMenuSection[];
}

export interface IMenuSection {
  title: string;
  items: (IMenuItem | MenuSeparator)[];
  classes?: string;
  icon?: string;
  styles?: string;
}
export interface IMenuWithoutSection {
  items: (IMenuItem | MenuSeparator)[];
  sections?: never;
}

export interface MenuSeparator {
  separator: true;
}
