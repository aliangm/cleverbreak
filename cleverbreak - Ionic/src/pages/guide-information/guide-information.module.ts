import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuideInformationPage } from './guide-information';

@NgModule({
  declarations: [
    GuideInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(GuideInformationPage),
  ],
})
export class GuideInformationPageModule {}
