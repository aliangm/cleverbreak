import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController, ViewController, App  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

import { HomePage } from '../home/home';
import { GuidesPage } from '../guides/guides';
import { ToursPage } from '../tours/tours';
import { MessageviewPage } from '../modals/messageview/messageview';
import { ModalPriceRange } from '../modals/pricerange/pricerange';
import { GuideviewPage } from '../modals/guideview/guideview';
import { CalendarModal, CalendarModalOptions } from "ion2-calendar";


import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LoginPage } from '../login/login';
import { MainPage } from '../main/main';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  pageType:string = '';
  convList:any;
  convVoiceList:any;
  loading: any;
  seletedUserAvatar: any;

  constructor(public appCtrl:App,public viewCtrl: ViewController ,public navCtrl: NavController, public navParams: NavParams, private diagnostic: Diagnostic, private alertCtrl: AlertController, private modalCtrl: ModalController, public loadingCtrl: LoadingController, public appInfo: AppinfoProvider, private http: HttpClient) {

    if(appInfo.common.isLogedIn == false){
      var modal = modalCtrl.create(LoginPage);
      modal.present();
      modal.onDidDismiss(data => {
        if(appInfo.common.isLogedIn == false)
        {
          this.viewCtrl.dismiss();
          this.appCtrl.getRootNav().push(HomePage);
        }else{
          this.pageType = "text";
          this.convList = {
            msg_user_list: []
          };
          this.convVoiceList = {
            msg_user_list: []
          };
          this.loadUserList();
        }
      });
    }
    if(appInfo.common.isLogedIn == true){
      this.pageType = "text";
      this.convList = {
        msg_user_list: []
      };
      this.convVoiceList = {
        msg_user_list: []
      };
      this.loadUserList();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
    this.getPermission();
  }

  
  getPermission() {
    this.diagnostic.getMicrophoneAuthorizationStatus().then((status) => {
      console.log(`=======================AuthorizationStatus`);
      console.log(status);
      if (status != this.diagnostic.permissionStatus.GRANTED) {
        this.diagnostic.requestMicrophoneAuthorization().then((data) => {
          console.log(`============================getCameraAuthorizationStatus`);
          console.log(data);
        })
      } else {
        console.log("================We have the permission");
      }
    }, (statusError) => {
      console.log(`===============statusError`);
      console.log(statusError);
    });
  }

  loadVoiceList(){
    this.loadUserList();
  }

  showLoadingCustom() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loading-transparent',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box">
          </div>
        </div>`,
      duration: 10000
    });
  
    this.loading.onDidDismiss(data => {
      console.log(data);
    });
  
    this.loading.present();
  }

  hideLoadingCustom(){
    this.loading.dismiss(true);
  }

  clickUser(conv){
    var modalPage = this.modalCtrl.create('MessageviewPage', {defaultAction: null, conv: conv});
    modalPage.onDidDismiss(data => {
      // after close action
    });
    modalPage.present();
  }

  // function loading data from backend
  loadUserList(){

    var range = this.pageType;
    this.showLoadingCustom();

    const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_msg_data', this.appInfo.addCsrfToken({
      type: 'msg-user-list',
      range: range
    }) )
      .subscribe(
        res => {
          this.hideLoadingCustom();
          if(res['status']){
            if(this.pageType == "text"){
              this.convList = res;
            }
            else if(this.pageType == "voice"){
              this.convVoiceList = res;
            }
          }else{
            const alert = this.alertCtrl.create({
              title: 'Server error',
              subTitle: 'Server is gone for now!',
              buttons: ['OK']
            });
            alert.present();
          }
        },
        err => {
          this.hideLoadingCustom();
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
