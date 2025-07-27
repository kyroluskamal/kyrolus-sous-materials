import { Directive, effect, inject, input, model } from '@angular/core';
import { ButtonDirective } from '../button/button.directive';
import { IconDirective } from '../icon/icon.directive';

@Directive({
  selector: '[ksToggleButton]',
  hostDirectives: [
    {
      directive: ButtonDirective,
      inputs: [
        'size',
        'variant',
        'appearance',
        'isRaised',
        'borderRadius',
        'shape',
        'disabled',
        'RaisedClass',
      ],
    },
    {
      directive: IconDirective,
      inputs: ['iconOptions', 'ksIcon:iconName'],
    },
  ],
  host: {
    '(click)': 'this.toggled.set(!this.toggled())',
  },
  standalone: true,
})
export class ToggleButtonDirective {
  iconToggled = input<string>();
  iconDirective = inject(IconDirective, { self: true });
  toggled = model<boolean>(false);
  private readonly mainIcon = this.iconDirective.ksIcon();
  private readonly eff = effect(() => {
    if (this.iconToggled()) {
      if (this.toggled()) {
        this.iconDirective.ksIcon.set(this.iconToggled()!);
      } else {
        this.iconDirective.ksIcon.set(this.mainIcon);
      }
    }
  });
}
