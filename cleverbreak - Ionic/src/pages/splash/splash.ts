import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, LoadingController, AlertController, ViewController, App } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { HttpClient } from '@angular/common/http';
import { VoicecallProvider } from '../../providers/voicecall/voicecall';

/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  splash = true;

  constructor(private appCtrl:App , private loadingCtrl: LoadingController,private viewCtrl:ViewController , public voice: VoicecallProvider,private alertCtrl:AlertController, private http: HttpClient, public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public appInfo: AppinfoProvider) {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splash = false;

        let username = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
        let password = window.localStorage.getItem('password') ? window.localStorage.getItem('password') : '';
        if (username != '') {
          while(this.appInfo.addCsrfToken == null){
          }
          const req = this.http.post(this.appInfo.common.urlproxy + 'login_via_ajax', this.appInfo.addCsrfToken({ email: username, password: password }))
            .subscribe(
              res => {
                if (res['status']) {
                  this.appInfo.common.isLogedIn = true;
                  this.appInfo.common.userProfile = res['user'];
                  voice.setAgoraAppInfo(this.appInfo.common.agora, this.appInfo.common.userProfile);
                  this.refreshCards();
                }
                this.navCtrl.push(HomePage);
                this.appCtrl.getRootNav().setRoot(HomePage);
                this.viewCtrl.dismiss();
              },
              err => {
                this.navCtrl.push(HomePage);
                this.appCtrl.getRootNav().setRoot(HomePage);
                this.viewCtrl.dismiss();
              }
            );
        }else
        {
          this.navCtrl.push(HomePage);
          this.appCtrl.getRootNav().setRoot(HomePage);
          this.viewCtrl.dismiss();
        }

        //this.navCtrl.push(HomePage);
      }, 2500);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

  refreshCards(){
    const req = this.http.get(this.appInfo.common.urlproxy + 'api/get_all_paymentmethod').subscribe(
      res=>{
        if(res['status'] == true){
          this.appInfo.common.cards = res['all_cards']['data'];   
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
    );
  }
}
