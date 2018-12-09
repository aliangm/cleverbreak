import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ViewController, Platform } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';
import { TourviewPage } from '../tourview/tourview';
import {DomSanitizer} from '@angular/platform-browser'
/**
 * Generated class for the ImageSlidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-slide',
  templateUrl: 'image-slide.html',
})
export class ImageSlidePage {

  tour : any;
  videoUrl: any;
  constructor(private dom: DomSanitizer, public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public appInfo: AppinfoProvider, private viewCtrl:ViewController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private http: HttpClient) {
    this.tour = navParams.get('tour');
    if(this.tour.video == "yes")
      this.videoUrl = dom.bypassSecurityTrustResourceUrl(this.tour.videoUrl);
    console.log(this.tour);
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.closeImageSlide(); 
    },3);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageSlidePage');
  } 
   closeImageSlide(){
     this.navCtrl
    .push(TourviewPage, {tour: this.navParams.data.tour})
    .then(() => {
        this.viewCtrl.dismiss();
        /* const index = this.viewCtrl.index;
        for(let i = index; i > 0; i--){
            this.navCtrl.remove(i);
        } */

    });
    /* this.navParams.data.modal.dismiss();
    let modal = this.navCtrl.getByIndex(2);
    modal.dismiss(); */
  } 
}
