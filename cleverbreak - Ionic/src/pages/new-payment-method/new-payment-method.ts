import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { NewCardPage } from '../new-card/new-card';
import { PaypalPage } from '../paypal/paypal';
/**
 * Generated class for the NewPaymentMethodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-payment-method',
  templateUrl: 'new-payment-method.html',
})
export class NewPaymentMethodPage {

  newcard = NewCardPage;
  paypal = PaypalPage;
  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.viewCtrl.dismiss(); 
    },2);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPaymentMethodPage');
  }

}
