import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[ksSeparator]',
  host: {
    class: 'my-3 br-grey-38 br-w-1 br-s-solid',
    '[attr.aria-hidden]': 'isDecorative() ? true : null',
    '[attr.role]': 'isDecorative() ? null : "separator"',
  },
})
export class SeparatorDirective {
  /* v8 ignore start */
  isDecorative = input<boolean, string>(false, {
    transform: booleanAttribute,
  });
  /* v8 ignore end */
}
