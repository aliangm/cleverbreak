import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { GuideviewPage } from '../modals/guideview/guideview';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

/**
 * Generated class for the GuideReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guide-reviews',
  templateUrl: 'guide-reviews.html',
})
export class GuideReviewsPage {

  guide:any;
  constructor(public platform:Platform, public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController, public appInfo:AppinfoProvider) {
    this.guide = navParams.get('guide');
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.closeViewAllReviews(); 
    },3);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuideReviewsPage');
  }
  closeViewAllReviews(){
    this.navCtrl
    .push(GuideviewPage, {guide: this.guide})
    .then(() => {
        this.viewCtrl.dismiss();

    });
  }
}
