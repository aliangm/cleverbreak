import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TourviewPage } from './tourview';
import {VideoPlayerPipe} from '../../pipes/video-player/video-player'


@NgModule({
  declarations: [
    TourviewPage
  ],
  imports: [
    IonicPageModule.forChild(TourviewPage),
  ],
})
export class TourviewPageModule {}
