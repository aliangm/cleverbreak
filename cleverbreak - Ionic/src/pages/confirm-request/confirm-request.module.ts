import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmRequestPage } from './confirm-request';

@NgModule({
  declarations: [
    ConfirmRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmRequestPage),
  ],
})
export class ConfirmRequestPageModule {}
