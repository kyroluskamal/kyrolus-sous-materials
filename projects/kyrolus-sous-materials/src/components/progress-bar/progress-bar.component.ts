import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'ks-progress-bar',
  imports: [],
  template: `
    <div
      class="progress-bar"
      [style.animation-duration.ms]="durationMs()"
      [class]="'bg-' + color()"
      [class.paused]="paused()"
    ></div>
  `,
  host: { class: 'w-100 d-block' },
  styles: `
    :host{
      background: #eee;
      margin-bottom: 1rem;
      border-radius: 0.125rem;
      overflow: hidden;
    }

     .progress-bar {
        height: 100%;
        animation: progress linear forwards;
      }

      .progress-bar.paused {
        animation-play-state: paused;
      }

      @keyframes progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

  `,
})
export class ProgressBarComponent {
  color = input<string>('primary');
  durationMs = input<number>(5000);
  height = input<string>('0.25rem');
  paused = input<boolean>(false);
  @HostBinding('style.height') get _height() {
    return this.height();
  }
}
