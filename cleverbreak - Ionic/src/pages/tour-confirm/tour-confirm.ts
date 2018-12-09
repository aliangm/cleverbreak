import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

import moment from 'moment';
/**
 * Generated class for the TourConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tour-confirm',
  templateUrl: 'tour-confirm.html',
})
export class TourConfirmPage {

  public booking:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:HttpClient, public alertCtrl:AlertController, public appInfo:AppinfoProvider, private viewCtrl:ViewController) {
      this.booking = navParams.get('booking');
      this.booking.guests_adults = 0;
      this.booking.guests_children = 0;
      this.booking.guests_infants = 0;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad TourConfirmPage');
  }
  closeTourConfirmPage(){
    this.viewCtrl.dismiss({cancelled:false});
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
}
