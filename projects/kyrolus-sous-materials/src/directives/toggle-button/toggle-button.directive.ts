import { Directive, effect, inject, input, model, OnInit } from '@angular/core';
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
      inputs: ['iconOptions', 'ksIcon:iconName', 'isNotDecorativeIcon'],
    },
  ],
  host: {
    '(click)': 'this.toggled.set(!this.toggled())',
  },
  standalone: true,
})
export class ToggleButtonDirective implements OnInit {
  /* v8 ignore start */
  readonly iconToggled = input<string>();
  readonly iconDirective = inject(IconDirective, { self: true });
  readonly toggled = model<boolean>(false);
  private mainIcon: string = '';
  /* v8 ignore end */
  ngOnInit(): void {
    this.mainIcon = this.iconDirective.ksIcon();
  }
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
