import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { GuideviewPage } from '../modals/guideview/guideview';

/**
 * Generated class for the ViewallGuidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewall-guide',
  templateUrl: 'viewall-guide.html',
})
export class ViewallGuidePage {

  guide:any;
  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public appInfo: AppinfoProvider, private viewCtrl:ViewController) {
    this.guide = navParams.get('guide');
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.closeViewAllAboutGuide(); 
    },5);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewallGuidePage');
  }
  closeViewAllAboutGuide(){
    this.navCtrl
    .push(GuideviewPage, {guide: this.guide})
    .then(() => {
        this.viewCtrl.dismiss();
    });
  }
}
