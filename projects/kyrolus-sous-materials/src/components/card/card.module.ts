import { NgModule } from '@angular/core';
import { CardComponent } from './card.component';
import { CardActionsComponent } from './card-actions.component';
import { CardContentComponent } from './card-content.component';
import { CardFooterComponent } from './card-footer.component';
import { CardHeaderModule } from './card-header.module';

const components = [
  CardComponent,
  CardActionsComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderModule,
];

@NgModule({
  declarations: [],
  imports: [...components],
  exports: [...components],
})
export class CardModule {}
