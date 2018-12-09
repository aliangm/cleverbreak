import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageviewPage } from './messageview';
import { MomentModule } from 'ngx-moment';
@NgModule({
  declarations: [
    MessageviewPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageviewPage),
    MomentModule
  ],
})
export class MessageviewPageModule {}
