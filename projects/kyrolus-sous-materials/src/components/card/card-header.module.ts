import { NgModule } from '@angular/core';
import { CardTitleComponent } from './card-title.component';
import { CardSubtitleComponent } from './card-subtitle.component';
import { CardHeaderComponent } from './card-header.component';

const components = [
  CardTitleComponent,
  CardSubtitleComponent,
  CardHeaderComponent,
];
@NgModule({
  declarations: [],
  imports: [...components],
  exports: [...components],
})
export class CardHeaderModule {}
