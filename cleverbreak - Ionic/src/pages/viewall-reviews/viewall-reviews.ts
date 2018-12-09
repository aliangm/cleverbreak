import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ViewController, Platform } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';
import { TourviewPage } from '../tourview/tourview';
import moment from 'moment';
/**
 * Generated class for the ViewallReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewall-reviews',
  templateUrl: 'viewall-reviews.html',
})
export class ViewallReviewsPage {

  reviews: any;

  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public appInfo: AppinfoProvider, private viewCtrl:ViewController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private http: HttpClient) {
    this.reviews = navParams.get('reviews');
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.closeViewAllReviews(); 
    },5);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewallReviewsPage');
  }
  closeViewAllReviews(){
    this.navCtrl
    .push(TourviewPage, {tour: this.navParams.data.tour})
    .then(() => {
        this.viewCtrl.dismiss();

    });
  }
}
