import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, LoadingController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { MessagecallvoicePage } from '../messagecallvoice/messagecallvoice'

import { AppinfoProvider } from '../../../providers/appinfo/appinfo';
import { TourviewPage } from '../../tourview/tourview';
import { GuideviewPage } from '../guideview/guideview';

/**
 * Generated class for the MessageviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messageview',
  templateUrl: 'messageview.html',
})
export class MessageviewPage {

  defaultAction:any;
  conversation:any;
  messageList = [];
  msgLastCheckId = 0;
  isAjaxLoading:boolean = false;
  loading: any;
  isOpened:boolean = true;
  inputText:string = '';
  isFromTourViewPage:boolean = false;
  isFromGuideViewPage:boolean = false;
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private viewCtrl:ViewController, public appInfo: AppinfoProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private http: HttpClient) {
  
    this.conversation = navParams.get('conv');
    this.defaultAction = navParams.get('defaultAction');
    var s = navParams.get('fromTourViewPage');
    if(s != null){
      this.isFromTourViewPage = s;
    }else{
      s = navParams.get('fromGuideViewPage');
      if(s !=null){
        this.isFromGuideViewPage = true;
      }
    }
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.dismiss(); 
    },4);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessageviewPage');
    this.isOpened = true;
    this.loadMessageData();
  }

  ionViewWillLeave() {
    this.isOpened = false;
  }

  loadMessageData(showLoading:boolean = true){
    if(!this.isOpened) return;

    if(!this.isAjaxLoading){
      this.isAjaxLoading = true;

      if(showLoading) this.showLoadingCustom();
      const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_msg_data', this.appInfo.addCsrfToken({
        type: 'msg-user-data',
        range: 'text',
        convData: this.conversation,
        lastCheckId: this.msgLastCheckId
      }) )
        .subscribe(
          res => {
            this.isAjaxLoading = false;
            if(showLoading) this.hideLoadingCustom();
            if(res['status']){
              let newMessageList = res['messages'];
              if(newMessageList.length > 0){
                this.messageList.splice.apply(this.messageList, [0, 0].concat(newMessageList));
              }
              this.msgLastCheckId = res['lastMsgId'];
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
            this.isAjaxLoading = false;
            if(showLoading) this.hideLoadingCustom();
            const alert = this.alertCtrl.create({
              title: 'Server error',
              subTitle: 'Server is gone for now!',
              buttons: ['OK']
            });
            alert.present();
          }
        );
    }
    
    /* setTimeout(() => {
      this.loadMessageData(false);
    }, 1500); */
  }

  callToUser(){

    console.log(this.conversation.targetUser.id);
    
    var modalPage = this.modalCtrl.create('MessagecallvoicePage', {
      defaultAction: 'call',
      user_from: this.appInfo.common.userProfile.id,
      user_to: this.conversation.targetUser.id,
      target_user: this.conversation.targetUser.id
    });
    modalPage.onDidDismiss(data => {
      // after close action
      this.ionViewDidLoad();
    });
    modalPage.present();
  }

  sendMsg(){
    if(this.inputText.trim().length > 0){
      const req = this.http.post(this.appInfo.common.urlproxy + 'sendMessage', this.appInfo.addCsrfToken({
        conID: this.conversation.conversation_id,
        msg: this.inputText
      }) )
        .subscribe(
          res => {
            this.inputText = '';
            this.loadMessageData();
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

  dismiss() {
    console.log(this.isFromTourViewPage);
    if(this.isFromTourViewPage == false)
    {
      if(this.isFromGuideViewPage ==true)
      {
        this.navCtrl
        .push(GuideviewPage, {guide: this.navParams.data.guide})
        .then(() => {
          this.viewCtrl.dismiss();
      });
      }else
        this.viewCtrl.dismiss();
    }
    else{
      this.navCtrl
      .push(TourviewPage, {tour: this.navParams.data.tour})
      .then(() => {
          this.viewCtrl.dismiss();
      });
    }
  }
}
