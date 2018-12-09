import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, App } from 'ionic-angular';
import {PersonalInformationPage} from '../personal-information/personal-information'
import {GuideInformationPage} from '../guide-information/guide-information'
import {AccountSettingsPage} from '../account-settings/account-settings'
import {PaymentMethodsPage} from '../payment-methods/payment-methods'
import { LoginPage } from '../login/login';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HomePage } from '../home/home';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(private appCtrl:App,private modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams, public appInfo:AppinfoProvider, private viewCtrl:ViewController) {
    if(appInfo.common.isLogedIn == false){
    var modal = modalCtrl.create(LoginPage);
    modal.present();
    modal.onDidDismiss(data => {
      if(appInfo.common.isLogedIn == false)
      {
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNav().push(HomePage);
      }
    });
  }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  clickViewPersonalInformation()
  {
    this.navCtrl.push(PersonalInformationPage, {});
  }
  clickViewGuideInformation()
  {
    this.navCtrl.push(GuideInformationPage, {});
  }
  clickViewAccountSettings()
  {
    this.navCtrl.push(AccountSettingsPage, {});
  }
  clickViewPaymentInformation()
  {
    this.navCtrl.push(PaymentMethodsPage, {});
  }
}
