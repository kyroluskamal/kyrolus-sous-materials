export type AccordionConfig = {
  useTogglerTransition?: boolean;
  iconWhenOpened?: string;
  iconWhenClosed?: string;
  useBorderRadius?: boolean;
  borderRadiusClass_FirstChild?: string;
  borderRadiusClass_LastChild?: string;
  onlyOneItemOpened?: boolean;
  useTogglerIcon?: boolean;
  hoverClass?: string;
  useHoverEffect?: boolean;
  activeClass?: string;
};
export type KMatColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'dark'
  | 'accent'
  | 'yellow'
  | 'organe'
  | 'red'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'white'
  | 'black'
  | 'gray';
export type ButtonSize = 'sm' | 'normal' | 'lg';
export type ButtonAppearance =
  | 'basic'
  | 'raised'
  | 'outline'
  | 'flat'
  | 'custom';
export type SideBarPosition = 'left' | 'right';
export type SideBarMode = 'over' | 'side';
export type ToggleButtons = { text: string; value: any; selected: boolean };
