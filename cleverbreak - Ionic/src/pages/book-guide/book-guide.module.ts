import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookGuidePage } from './book-guide';

@NgModule({
  declarations: [
    BookGuidePage,
  ],
  imports: [
    IonicPageModule.forChild(BookGuidePage),
  ],
})
export class BookGuidePageModule {}
