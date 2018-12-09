import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';

import moment from 'moment'
/**
 * Generated class for the GuideConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guide-confirm',
  templateUrl: 'guide-confirm.html',
})
export class GuideConfirmPage {

  public booking:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, public appInfo:AppinfoProvider,
    public http:HttpClient, public alertCtrl:AlertController) {
    this.booking = navParams.get('booking');
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_user_details', this.appInfo.addCsrfToken({
      user_id:this.booking.customer_id
    }))
    .subscribe(
      res => {
        if (res['status']) {
          this.booking.customer = res['user'];
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

  onClickCancel(){
    var date1 = moment(new Date().toISOString());
    var date2 = moment(this.booking.date_from);
    var diff = date2.diff(date1, 'days');
    if(diff < 7){
      const alert = this.alertCtrl.create({
        title: 'Cancelling Booking is not allowed',
        subTitle: 'You have to cancel this booking before 7 days.',
        buttons: ['OK']
      });
      alert.onDidDismiss(data => {
        
      });
      alert.present();
      return;
    }
   
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/cancel_booking', this.appInfo.addCsrfToken({
      booking_id:this.booking.booking_id
    }))
    .subscribe(
      res => {
        if (res['status']) {
          this.viewCtrl.dismiss({cancelled:true});
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
    console.log('ionViewDidLoad GuideConfirmPage');
  }
  closePostRequest(){
    this.viewCtrl.dismiss({cancelled:false});
  }
}
