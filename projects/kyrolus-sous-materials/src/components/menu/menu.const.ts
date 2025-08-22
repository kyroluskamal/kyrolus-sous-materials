export function getErrorMessageForMenuItemNotInMenu(
  componentName: 'Item' | 'Section' | 'Header' | 'Footer'
): string {
  return `Menu${componentName}Component must be used within a MenuComponent or PopoverMenuBlock. Please ensure it is placed inside a MenuComponent element.`;
}
