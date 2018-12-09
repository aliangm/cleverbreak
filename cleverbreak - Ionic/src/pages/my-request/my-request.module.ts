import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyRequestPage } from './my-request';

@NgModule({
  declarations: [
    MyRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(MyRequestPage),
  ],
})
export class MyRequestPageModule {}
