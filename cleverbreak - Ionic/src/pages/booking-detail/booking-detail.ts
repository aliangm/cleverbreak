import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Platform } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';
import moment from 'moment'

/**
 * Generated class for the BookingDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-booking-detail',
  templateUrl: 'booking-detail.html',
})
export class BookingDetailPage {

  booking:any;
  guide_detail:any;
  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public appInfo: AppinfoProvider, private http: HttpClient, private alertCtrl:AlertController, private viewCtrl:ViewController) {
    this.booking = navParams.get('booking');
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_user_details', this.appInfo.addCsrfToken({
      user_id:this.booking.guide_id
    }))
    .subscribe(
      res => {
        if (res['status']) {
          this.booking.guider = res['user'];
          console.log(this.booking);
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
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.closePostRequest(); 
    },3);*/
  }

  closePostRequest(){
    this.viewCtrl.dismiss({cancelled:false});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingDetailPage');
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
