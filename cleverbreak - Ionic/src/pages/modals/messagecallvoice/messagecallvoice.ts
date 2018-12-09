import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, LoadingController, NavParams, AlertController, ModalController, Events, DateTime } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { AppinfoProvider } from '../../../providers/appinfo/appinfo';
 import { VoicecallProvider } from '../../../providers/voicecall/voicecall'; 


import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
/**
 * Generated class for the MessagecallvoicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-messagecallvoice',
  templateUrl: 'messagecallvoice.html',
})
export class MessagecallvoicePage {

  defaultAction:any;
  user_from:any;
  user_to:any;
  target_user:any;
  targetUserData:any = {};
  isAjaxLoading:boolean;
  callStatusText:string;
  callStartTime:number;
  nowTime:number;
  callStarted:boolean = false;
  timerInterval:number;
  isConnected:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private diagnostic: Diagnostic, private alertCtrl: AlertController, private viewCtrl:ViewController, public appInfo: AppinfoProvider, public voice: VoicecallProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private http: HttpClient, public evt: Events) {

     this.defaultAction = navParams.get('defaultAction');
    this.target_user = navParams.get('target_user');
    this.user_from = navParams.get('user_from');
    this.user_to = navParams.get('user_to');
    this.callStatusText = "";

    this.loadInformation();
    this.voiceCallEventProcessor(); 
  }

  ionViewDidLoad() {
     console.log('ionViewDidLoad MessagecallvoicePage');
    
    this.getPermission();
    this.appInfo.isVoiceModalOpened = true;

    if(this.defaultAction == "call"){
      console.log(this.target_user);
      this.voice.callVoiceToUser(this.target_user);
      this.callStatusText = "Calling now ...";
      this.callStarted = false;
    }else{
      this.callStarted = false;
      this.callStatusText = "Incomming call...";
    }
  }

  
  
   getPermission() {
    this.diagnostic.getMicrophoneAuthorizationStatus().then((status) => {
      console.log(`=======================AuthorizationStatus`);
      console.log(status);
      if (status != this.diagnostic.permissionStatus.GRANTED) {
        this.diagnostic.requestMicrophoneAuthorization().then((data) => {
          console.log(`============================getCameraAuthorizationStatus`);
          console.log(data);
          if(data['RECORD_AUDIO'] == 'DENIED'){
            const alert = this.alertCtrl.create({
              title: 'Permission needed',
              subTitle: 'It is needed mic permission for voice call. Without it, you couldn`t have a voice call.',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    this.cancelCall();
                  }
                }
              ]
            });
            alert.present();
          }
        })
      } else {
        console.log("================We have the permission");
      }
    }, (statusError) => {
      console.log(`===============statusError`);
      console.log(statusError);
    });
  }

  voiceCallEventProcessor(){
    this.evt.subscribe('message:receiver-status', (data) =>{
      if(data['status'] == 'is-not-online'){
        this.callStarted = false;
        this.callStatusText = "Receiver is not online";
        setTimeout(() => {
          this.dismiss();
        }, 1500);
      }else if(data['status'] == 'cancelled_by_receiver'){
        this.callStarted = false;
        this.callStatusText = "Receiver cancelled call";
        setTimeout(() => {
          this.dismiss();
        }, 1500);
      }else if(data['status'] == 'accepted_by_receiver'){
        this.callStatusText = "Connecting...";
      }else if(data['status'] == 'close'){
        this.callStatusText = data['statusText'];
        setTimeout(() => {
          this.dismiss();
        }, 1500);
      }
    });
    this.evt.subscribe('message:call-connected', (data) =>{
      if(data['status'] == 'started'){
        this.isConnected = true;
        this.callStartTime = Date.now();
        this.nowTime = this.callStartTime;
        this.timerInterval = setInterval(() => {
          this.nowTime = Date.now();
        }, 1000);
        this.callStarted = true;
      }
    });
  }

  acceptCall(){
    this.callStatusText = "Connecting...";
    this.evt.publish('message:receiver-status', {status: 'accept-call'});
  }

  cancelCall(){
    this.dismiss();
  }

  ionViewWillLeave() {
    if(this.user_from == this.target_user){
      if(!this.callStarted)
        this.evt.publish('message:caller-status', {status: 'cancelled_by_receiver', targetUserId: this.target_user});
      else
        this.evt.publish('message:caller-status', {status: 'cancelled_by_receiver', targetUserId: this.target_user});
    }else{
      if(!this.callStarted)
        this.evt.publish('message:caller-status', {status: 'cancelled_by_caller', targetUserId: this.target_user});
      else
        this.evt.publish('message:caller-status', {status: 'cancelled_by_caller', targetUserId: this.target_user});
    }
  }

  loadInformation(){
    if(this.isAjaxLoading) return;

    this.isAjaxLoading = true;
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_msg_data', this.appInfo.addCsrfToken({
      type: 'get-user-profile',
      target_user: this.target_user,
      user_from: this.user_from,
      user_to: this.user_to
    }) )
      .subscribe(
        res => {
          this.isAjaxLoading = false;
          if(res['status']){
            console.log(res);
            this.targetUserData = res['target_user'];
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
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }

  timeDifToString(value: number) {
    var seconds:number = Math.round(value/1000);
    var retstr:string = '';
    var hours:number = Math.floor(seconds / 3600);
    console.log(seconds);
    if(hours > 0) retstr = hours + ":";
    var mins:number =  Math.floor((seconds - hours * 3600 ) / 60);
    retstr = (mins < 10)? retstr + '0' + mins + ':' : retstr + '' + mins + ':';
    var seconds:number =  seconds - hours * 3600 - mins * 60;
    retstr = (seconds < 10)? retstr + '0' + seconds : retstr + '' + seconds;
    return retstr;
  } 

  dismiss() {

     clearInterval(this.timerInterval);

    this.viewCtrl.dismiss();
    this.appInfo.isVoiceModalOpened = false; 
  }
}
