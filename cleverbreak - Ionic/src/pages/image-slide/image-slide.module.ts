import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageSlidePage } from './image-slide';

@NgModule({
  declarations: [
    ImageSlidePage,
  ],
  imports: [
    IonicPageModule.forChild(ImageSlidePage),
  ],
})
export class ImageSlidePageModule {}
