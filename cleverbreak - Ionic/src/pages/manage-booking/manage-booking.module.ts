import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageBookingPage } from './manage-booking';

@NgModule({
  declarations: [
    ManageBookingPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageBookingPage),
  ],
})
export class ManageBookingPageModule {}
