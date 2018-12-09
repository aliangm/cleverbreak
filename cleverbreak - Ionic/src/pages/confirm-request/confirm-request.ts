import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

/**
 * Generated class for the ConfirmRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-request',
  templateUrl: 'confirm-request.html',
})
export class ConfirmRequestPage {

  public request:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:HttpClient, public appInfo:AppinfoProvider, private alertCtrl:AlertController, public viewCtrl:ViewController) {
    this.request = navParams.get('request');
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_user_details', this.appInfo.addCsrfToken({
      user_id:this.request.customer_id
    }))
    .subscribe(
      res => {
        if (res['status']) {
          this.request.customer = res['user'];
          console.log(this.request);
        } else {
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      },
      err => {
        const alert = this.alertCtrl.create({
          title: 'Server error',
          subTitle: 'Server is gone for now!',
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmRequestPage');
  }

  onClickAccept(){
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/acceptBooking', this.appInfo.addCsrfToken({
      booking_id:this.request.booking_id
    }))
    .subscribe(
      res => {
        if (res['status']) {
          this.viewCtrl.dismiss({change: true});
        } else {
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      },
      err => {
        const alert = this.alertCtrl.create({
          title: 'Server error',
          subTitle: 'Server is gone for now!',
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }
  onClickReject(){
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/declineBooking', this.appInfo.addCsrfToken({
      booking_id:this.request.booking_id
    }))
    .subscribe(
      res => {
        if (res['status']) {
          this.viewCtrl.dismiss({change: true});
        } else {
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      },
      err => {
        const alert = this.alertCtrl.create({
          title: 'Server error',
          subTitle: 'Server is gone for now!',
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }
  closeConfirmRequest(){
    this.viewCtrl.dismiss({change:false});
  }
}
