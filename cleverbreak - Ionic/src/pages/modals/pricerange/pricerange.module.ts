import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPriceRange } from './pricerange';

@NgModule({
  declarations: [
    ModalPriceRange
  ],
  imports: [
    IonicPageModule.forChild(ModalPriceRange)
  ],
})
export class ModalsPageModule {}
