import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuideviewPage } from './guideview';

@NgModule({
  declarations: [
    GuideviewPage,
  ],
  imports: [
    IonicPageModule.forChild(GuideviewPage),
  ],
})
export class GuideviewPageModule {}
