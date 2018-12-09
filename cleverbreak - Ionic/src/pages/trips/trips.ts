import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, AlertController, ModalController, ViewController ,App} from 'ionic-angular';
import { BookingPage } from '../booking/booking';
import { MyRequestPage } from '../my-request/my-request';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { ManageBookingPage } from '../manage-booking/manage-booking';
import { EmailValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PostRequestPage } from '../post-request/post-request';
import { BookingDetailPage } from '../booking-detail/booking-detail';
import { EditRequestPage } from '../edit-request/edit-request';
import { GuideviewPage } from '../modals/guideview/guideview';
import { GuideConfirmPage } from '../guide-confirm/guide-confirm';
import { ConfirmRequestPage } from '../confirm-request/confirm-request';
import { TourConfirmPage } from '../tour-confirm/tour-confirm';
import { LoginPage } from '../login/login';
import { BookPage } from '../book/book';
import { MainPage } from '../main/main';
import { HomePage } from '../home/home';
/**
 * Generated class for the TripsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({priority: 'high', segment: 'tabs'})
@Component({
  selector: 'page-trips',
  templateUrl: 'trips.html',
})
export class TripsPage {

  pageType: any = 0;
  requests: any;
  bookings: any;
  activities: any;
  active_bookings: any;
  manage_bookings: any;
  guideRequests: any;

  showManageBooking:boolean = false;
  constructor(public appCtrl:App, private viewCtrl : ViewController ,public navCtrl: NavController, public navParams: NavParams, public appInfo:AppinfoProvider, private http:HttpClient, private alertCtrl:AlertController, private modalCtrl:ModalController) {
    if(this.appInfo.common.isLogedIn == false){
      var modal = modalCtrl.create(LoginPage);
      modal.present();
      modal.onDidDismiss(data => {
      if(appInfo.common.isLogedIn == false)
      {
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNav().push(HomePage);
      }else{
        if(appInfo.common.userProfile && appInfo.common.userProfile.is_guide == "yes"){  
          this.showManageBooking = true;
        }
        this.refreshBookingData();
      } 
      });
    }
    if(appInfo.common.userProfile && appInfo.common.userProfile.is_guide == "yes"){  
      this.showManageBooking = true;
    }
    if(navParams.get('trips') == 1 && appInfo.common.isLogedIn)
    {
      let elm = <HTMLElement>document.querySelector("#bookings");
      elm.style.color = '#47bc00';
      elm.style.borderBottom = '1px solid #47bc00';
      elm = <HTMLElement>document.querySelector("#requests");
      elm.style.color = '#000000';
      elm.style.borderBottom = '1px solid #dedede';
      this.pageType = 0;
      if(this.showManageBooking == false)
        return;
      elm = <HTMLElement>document.querySelector("#manage");
      elm.style.color = '#000000';
      elm.style.borderBottom = '1px solid #dedede';
    }
  }
  refreshBookingData(){
    const req = this.http.get(this.appInfo.common.urlproxy + 'api/bookings', {
    })
    .subscribe(
      res => {
        if (res['status']) {
          this.requests = res['requests'];
          this.bookings = res['bookings'];
          this.activities = res['activities'];
          this.active_bookings = res['active_bookings'];
          this.manage_bookings = res['manage_bookings'];
          this.guideRequests = res['guideRequests'];
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
  
  ionViewDidEnter(){
    this.appInfo.common.trips = false;
    let elm = <HTMLElement>document.querySelector("#bookings");
    elm.style.color = '#47bc00';
    elm.style.borderBottom = '1px solid #47bc00';
    elm = <HTMLElement>document.querySelector("#requests");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
    this.pageType = 0;
    if(this.showManageBooking == false)
      return;
    elm = <HTMLElement>document.querySelector("#manage");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
    
  }
  ionViewWillEnter(){
    /*this.appInfo.common.trips = false;
    if(this.appInfo.common.isLogedIn == false)
      return;
    let elm = <HTMLElement>document.querySelector("#bookings");
    elm.style.color = '#47bc00';
    elm.style.borderBottom = '1px solid #47bc00';
    elm = <HTMLElement>document.querySelector("#requests");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
    this.pageType = 0;
    this.refreshBookingData();
    if(this.showManageBooking == false)
      return;
    elm = <HTMLElement>document.querySelector("#manage");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
    console.log("this.ionViewWillEnter");*/
  }
  onClickBookings(){
    this.pageType = 0;
    let elm = <HTMLElement>document.querySelector("#bookings");
    elm.style.color = '#47bc00';
    elm.style.borderBottom = '1px solid #47bc00';
    elm = <HTMLElement>document.querySelector("#requests");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
    if(this.showManageBooking == false)
      return;
    elm = <HTMLElement>document.querySelector("#manage");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
  }
  onClickRequests(){
    this.pageType = 1;
    let elm = <HTMLElement>document.querySelector("#bookings");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
    elm = <HTMLElement>document.querySelector("#requests");
    elm.style.color = '#47bc00';
    elm.style.borderBottom = '1px solid #47bc00';
    if(this.showManageBooking == false)
      return;
    elm = <HTMLElement>document.querySelector("#manage");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';

  }
  onClickManageBookings(){
    this.pageType = 2;
    let elm = <HTMLElement>document.querySelector("#bookings");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
    elm = <HTMLElement>document.querySelector("#requests");
    elm.style.color = '#000000';
    elm.style.borderBottom = '1px solid #dedede';
    if(this.showManageBooking == false)
      return;
    elm = <HTMLElement>document.querySelector("#manage");
    elm.style.color = '#47bc00';
    elm.style.borderBottom = '1px solid #47bc00';
  }

  onClickNewRequest(){
    let modal = this.modalCtrl.create(PostRequestPage);
    modal.onDidDismiss(data => {
      this.refreshBookingData();
    });
    modal.present();
  }
  confirmedBooking(i){
    let modal = this.modalCtrl.create(BookingDetailPage, {booking:this.active_bookings[i]});
    modal.onDidDismiss(data => {
      if(data.cancelled != null && data.cancelled == true)
      {
        this.refreshBookingData();
      }
    });
    modal.present();
  }
  confirmedGuide(i){
    let modal = this.modalCtrl.create(GuideConfirmPage, {booking:this.manage_bookings[i]});
    modal.onDidDismiss(data => {
      if(data.cancelled != null && data.cancelled == true)
      {
        this.refreshBookingData();
      }
    });
    modal.present();
  }
  onClickViewGuide(guide){
    let modal = this.modalCtrl.create(GuideviewPage, {guide:guide,'fromTrips':true});
    modal.onDidDismiss(data => {
    });
    modal.present();
  }
  onClickEditRequest(i){
    let modal = this.modalCtrl.create(EditRequestPage, {request:this.requests[i]});
    modal.onDidDismiss(data => {
      if(data.updated == true){
        this.refreshBookingData();
      }
    });
    modal.present();
  }
  onClickDeleteRequest(i){
    const alert = this.alertCtrl.create({
      title: 'Delete request',
      subTitle: 'Are you sure you want to delete this request?',
      buttons: [{text:'Yes', handler: () =>{
        const req = this.http.post(this.appInfo.common.urlproxy + 'api/delete_request', this.appInfo.addCsrfToken({
          requestId: this.requests[i].request_id
        }))
        .subscribe(
          res => {
            if (res['status']) {
              this.refreshBookingData();
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
      }}
      , 'No']
    });
    alert.present();
  }
  onClickViewRequest(request){
    let modal = this.modalCtrl.create(ConfirmRequestPage, {request: request});
    modal.onDidDismiss(data =>{
      if(data.change == true)
        this.refreshBookingData();
    });
    modal.present();
  }
  onClickConfirmedTourRequest(i){
    let modal = this.modalCtrl.create(TourConfirmPage, {booking: this.manage_bookings[i]});
    modal.onDidDismiss(data =>{
      if(data.cancelled == true)
        this.refreshBookingData();
    });
    modal.present();
  }
}
