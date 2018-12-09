import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController, Platform } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';
import { TourviewPage } from '../tourview/tourview';

/**
 * Generated class for the ViewallTourPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewall-tour',
  templateUrl: 'viewall-tour.html',
})
export class ViewallTourPage {

  aboutTour: any;
  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public appInfo: AppinfoProvider, private viewCtrl:ViewController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private http: HttpClient) {
    this.aboutTour = navParams.get('about_tour');
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.closeViewAllAboutTour(); 
    },5);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewallTourPage');
  }
  closeViewAllAboutTour(){
    this.navCtrl
    .push(TourviewPage, {tour: this.navParams.data.tour})
    .then(() => {
        this.viewCtrl.dismiss();
    });
  }
}
