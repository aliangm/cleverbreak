import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform, LoadingController, App } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { FacebookLoginResponse, Facebook } from '@ionic-native/facebook';
import { HomePage } from '../home/home';
import { VoicecallProvider } from '../../providers/voicecall/voicecall';
import { MainPage } from '../main/main';
//import {TwitterConnect} from '@ionic-native/twitter-connect'
/* import {AngularFireAuth} from 'angularfire2/auth' */
/**
 * Generated class for the AccountSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-settings',
  templateUrl: 'account-settings.html',
})
export class AccountSettingsPage {

  public new_password:any;
  public repeat_password:any;
  public old_password:any;
  public showNotification:boolean = false;
  public googleId:any;
  public facebookId:any;
  public twitterId:any;
  public logoutClicked:any = 0;
  constructor(private appCtrl:App,private facebook:Facebook,public voice: VoicecallProvider, private googlePlus:GooglePlus,public loadingCtrl:LoadingController, public platform:Platform,public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, private appInfo:AppinfoProvider, private alertCtrl: AlertController, private http: HttpClient) {
    /* let backAction =  platform.registerBackButtonAction(() => {
      this.dismiss();
    },2); */
    this.googleId = this.appInfo.common.userProfile.google_account;
    this.facebookId = this.appInfo.common.userProfile.facebook_account;
  }
  onClickLogout(){
    if(this.logoutClicked == 1)
      return;
    this.logoutClicked = 1;
    const req = this.http.post(this.appInfo.common.urlproxy + 'logout_via_ajax',this.appInfo.addCsrfToken({})).subscribe(
      res=>{
        if(res['status'] == true){
          window.localStorage.setItem('email', '');
          window.localStorage.setItem('password', '');
          this.appInfo.common.isLogedIn = false;
          this.appInfo.common.refresh = true;
          this.appInfo.common.guide_wishlist = [{}];
          this.appInfo.common.wishlist = [{}];
          this.appInfo.common.cards=[{}];
          this.voice.setAgoraAppInfo(this.appInfo.common.agora, {});
          //this.navCtrl.popToRoot();
          //this.appCtrl.getRootNav().popAll();
          this.appCtrl.getRootNav().push(HomePage,{ selectedTab: 1 });
          this.viewCtrl.dismiss();
          
          //this.navCtrl.push(HomePage, );
          //this.appCtrl.getRootNav().setRoot(HomePage);
        }else{
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone',
            buttons: ['OK']
          });
          alert.present();
        }
      }, err=>{
        const alert = this.alertCtrl.create({
          title: 'Server error',
          subTitle: 'Server is gone',
          buttons: ['OK']
        });
        alert.present();
      }
    )
  }
  onClickSaveButton(){
    if( this.repeat_password != this.new_password)
    {
      this.showNotification = true;
      return;
    }
    else
      this.showNotification = false;

    const req = this.http.post(this.appInfo.common.urlproxy + 'api/changePassword', this.appInfo.addCsrfToken({
      'current-password': this.old_password, password: this.new_password
          }) )
      .subscribe(
        res => {
          if(res['status']){
            const alert = this.alertCtrl.create({
              title: 'Change Password',
              subTitle: 'Changed Successfully',
              buttons: ['OK']
            });
            alert.present();
          }else{
            const alert = this.alertCtrl.create({
              title: 'Server error',
              subTitle: 'Please enter correct password',
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
    console.log('ionViewDidLoad AccountSettingsPage');
  }
  dismiss() {
    this.dismiss();
  }
  updateGoogleAccount(email){

    const req = this.http.post(this.appInfo.common.urlproxy + 'api/updateGoogleAccount', this.appInfo.addCsrfToken({
      email:email
    })).subscribe(
      res => {
      }, err => {

      }
    );
  }
  updateFacebookAccount(email){
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/updateFacebookAccount', this.appInfo.addCsrfToken({
      email:email
    })).subscribe(
      res => {
      }, err => {

      }
    );
  }
  onClickGoogleVerify(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.googlePlus.login({
    })
    .then(res => {
      loading.dismiss();
      this.googleId = res.email;
      this.updateGoogleAccount(res.email);
      console.log(res);
    }).catch(function (error) {
      loading.dismiss();
    });
  }
  onClickFacebookVerify(){
    
    this.facebook.login(['email']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=email', []).then(profile => {
        this.facebookId = profile['email'];
        this.updateFacebookAccount(profile['email']);
      })
    });
  }
  onClickTwitterVerify(){
    /* let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.fire.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
    .then(res => {
      this.twitterId = res.user.displayName;
    }) */
  }
}
