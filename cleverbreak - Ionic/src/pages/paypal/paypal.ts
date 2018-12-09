import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the PaypalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paypal',
  templateUrl: 'paypal.html',
})
export class PaypalPage {

  paypal_email:any;
  constructor(private alertCtrl:AlertController, private http:HttpClient, public appInfo:AppinfoProvider, public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController) {
    this.paypal_email = this.appInfo.common.userProfile.paypal_email;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaypalPage');
  }
  dismissPaypal(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }
  clickSavePaypal(){
    this.appInfo.common.userProfile.paypal_email = this.paypal_email;
    console.log(this.appInfo.common.urlproxy);
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/addPaypalPayment', this.appInfo.addCsrfToken({paypal_email: this.paypal_email})).subscribe(
      res => {
        if(res['status'] == true){
          const alert = this.alertCtrl.create({
            title: 'Paypal',
            subTitle: 'Your paypal address added successfully',
            buttons: ['OK']
          });
          alert.present();
          alert.onDidDismiss(() => {
            this.navCtrl.parent.viewCtrl.dismiss();
          });
        }else{
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      },err=>{
        const alert = this.alertCtrl.create({
          title: 'Server error',
          subTitle: 'Server is gone for now!',
          buttons: ['OK']
        });
        alert.present();
      }
    )
  }
}
