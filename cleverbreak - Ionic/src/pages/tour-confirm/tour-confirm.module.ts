import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TourConfirmPage } from './tour-confirm';

@NgModule({
  declarations: [
    TourConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(TourConfirmPage),
  ],
})
export class TourConfirmPageModule {}
