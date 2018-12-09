import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { HomePage } from '../home/home';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { MainPage } from '../main/main';
import { VoicecallProvider } from '../../providers/voicecall/voicecall';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  validation_messages: any;
  isCalledSubmit:any = false;
  submit_errors:any = [];

  constructor(public voice: VoicecallProvider,private alertCtrl:AlertController, private loadingCtrl:LoadingController, private appCtrl:App ,private viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, public appInfo: AppinfoProvider, public formBuilder: FormBuilder, private http: HttpClient) {
    
  }

  ionViewWillLeave(){
    if(this.appInfo.common.isLogedIn == false)
    {
      this.appInfo.common.refresh = false;
      /* this.appCtrl.getRootNav().push(HomePage);
      console.log("dddd"); */
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillLoad() {
    // Related login form validation
    this.loginForm = this.formBuilder.group({
      email: ['',  Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])],
    });

    
    this.validation_messages = {
      'username': [
        { type: 'required', message: 'Username is required.' },
        { type: 'minlength', message: 'Username must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
        { type: 'validUsername', message: 'Your username has already been taken.' }
      ],
      'email': [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'Enter a valid email.' }
      ],
      'password': [
        { type: 'required', message: 'Password is required.' },
        { type: 'minlength', message: 'Password must be at least 5 characters long.' }
      ]
    };
  }

  submitLogin() {
    if(this.loginForm.valid){
      this.isCalledSubmit = true;
      const req = this.http.post(this.appInfo.common.urlproxy + 'login_via_ajax', this.appInfo.addCsrfToken(this.loginForm.value) )
      .subscribe(
        res => {
          if(res['status']){
            this.refreshCards();
            this.appInfo.common.isLogedIn = true;
            this.appInfo.common.userProfile = res['user'];
            this.appInfo.common.refresh = true;
            window.localStorage.setItem('email', this.loginForm.value.email);
            window.localStorage.setItem('password', this.loginForm.value.password);
            this.viewCtrl.dismiss();
            this.voice.setAgoraAppInfo(this.appInfo.common.agora, this.appInfo.common.userProfile);
            this.refreshCards();
            //this.navCtrl.push(HomePage);
            //this.navCtrl.setRoot(HomePage);
          }else{
            this.submit_errors = ['Email or Password is incorrect!'];
          }
        },
        err => {
          this.submit_errors = ['Server error'];
        }
      );
    }
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
  onChange(){
    this.submit_errors = [];
  }
}
