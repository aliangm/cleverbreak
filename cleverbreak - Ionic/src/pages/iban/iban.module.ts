import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IbanPage } from './iban';

@NgModule({
  declarations: [
    IbanPage,
  ],
  imports: [
    IonicPageModule.forChild(IbanPage),
  ],
})
export class IbanPageModule {}
