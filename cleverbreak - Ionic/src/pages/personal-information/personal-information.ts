import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import {  HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

/**
 * Generated class for the PersonalInformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personal-information',
  templateUrl: 'personal-information.html',
})
export class PersonalInformationPage {

  interests: any = ['Workshop', 'Water', 'Activities', 'Surfing', 'Food&Drinks'];
  indexes:any = {'Workshop': 0, 'Water': 1, 'Activities': 2, 'Surfing': 3, 'Food&Drinks': 4};
  models:any =[false, false, false, false, false];
  hobbies: any;
  firstname: any;
  lastname: any;
  location: any;
  dob: any;
  email: any;
  languages: any;
  aboutMe: any;
  constructor(public platform:Platform ,public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, private http: HttpClient, private appInfo: AppinfoProvider, private alertCtrl:AlertController) {
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.dismiss(); 
    },2);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalInformationPage');
  }
  onInterestChange(){
    var i = 0;
    for(i = 0;i < 5;i ++)
    this.models[i] = false;
    for(i = 0;i < this.hobbies.length;i ++){
      this.models[this.indexes[this.hobbies[i]]] = true;
    }
  }
  onClickWorkshop(){

  }
  onClickSaveButton(){
    console.log(this.firstname);
    var request = {firstname: this.firstname, lastname: this.lastname, location: this.location, dob: this.dob, email: this.email, languages: this.languages, aboutme: this.aboutMe};
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/updateProfile', this.appInfo.addCsrfToken({
      firstname: this.firstname, lastname: this.lastname, location: this.location, dob: this.dob, email: this.email, languages: this.languages, aboutme: this.aboutMe
    }) )
      .subscribe(
        res => {
          if(res['status']){
            const alert = this.alertCtrl.create({
              title: 'Personal Information',
              subTitle: 'Update Success',
              buttons: ['OK']
            });
            alert.present();
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
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }
  dismiss() {
    this.dismiss();
  }
}
