
import { inject, Injectable, OnInit, signal, DOCUMENT } from '@angular/core';

export type Direction = 'ltr' | 'rtl';

export const DIR = {
  LTR: 'ltr',
  RTL: 'rtl',
};

@Injectable({
  providedIn: 'root',
})
export class DirectionService implements OnInit {
  ngOnInit(): void {
    this.DOCUMENT.body.dir = this.direction();
  }
  readonly DOCUMENT = inject(DOCUMENT);

  direction = signal<Direction>('ltr');
}
