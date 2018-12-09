import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuideConfirmPage } from './guide-confirm';

@NgModule({
  declarations: [
    GuideConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(GuideConfirmPage),
  ],
})
export class GuideConfirmPageModule {}
