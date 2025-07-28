import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'ks-menu',
  imports: [],
  template: `
    <div>
      <ng-content selector=".ks-menu-start"></ng-content>
    </div>
    <div>
      @if(hasSections()){
      <ng-content selector="ks-menu-section" />
      } @else{
      <ng-content selector="ks-menu-item" />
      }
    </div>
    <div>
      <ng-content selector=".ks-menu-end"></ng-content>
    </div>
  `,
  styles: [``],
  standalone: true,
})
export class MenuComponent {
  hasSections = input<boolean, string>(false, {
    transform: booleanAttribute,
  });

  layout = input<'horizontal' | 'vertical', string>('horizontal', {
    transform: (value: string) => value as 'horizontal' | 'vertical',
  });

  mode = input<'overlay' | 'inline', string>('overlay', {
    transform: (value: string) => value as 'overlay' | 'inline',
  });

  
}
