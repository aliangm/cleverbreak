import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Platform } from 'ionic-angular';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the EditRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-request',
  templateUrl: 'edit-request.html',
})
export class EditRequestPage {
  date:any = new Date().toISOString();
  time_from: any = "00:00";
  time_to: any = "00:00";
  title:any;
  location:any;
  language:any;
  price:any;
  about:any;
  interests:any;
  number_adults:any;
  number_children: any;
  number_infants: any;
  request:any;
  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams,public appInfo: AppinfoProvider, private http:HttpClient, private alertCtrl:AlertController, private viewCtrl:ViewController) {
    this.request = navParams.get('request');
    this.date = this.request.dateTo;
    this.time_from = this.request.timeFrom;
    this.time_to = this.request.timeTo;
    this.title = this.request.title;
    this.location = this.request.location;
    this.language = this.request.languages;
    this.price = this.request.price;
    this.about = this.request.about;
    this.interests = this.request.activities;
    this.number_adults = this.request.adults;
    this.number_children = this.request.children;
    this.number_infants = this.request.infants;
    this.about = this.request.about;

    /* let backAction =  platform.registerBackButtonAction(() => {
       this.closeEditRequest(); 
    },3); */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditRequestPage');
  }
  publishRequest(){
    var activities = "";
    for(let interest of this.interests){
      activities = activities + ' ' + interest;
    }
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/update_request', this.appInfo.addCsrfToken({request_id: this.request.request_id,title:this.title,location:this.location,language: this.language, price:this.price, date:this.date, timeFrom:this.time_from, timeTo:this.time_to, about: this.about,activities: activities, adults:this.number_adults, children: this.number_children, infants: this.number_infants
    }))
    .subscribe(
      res => {
        if (res['status']) {
          const alert = this.alertCtrl.create({
            title: 'Succcess',
            subTitle: 'Updated Successfully',
            buttons: ['OK']
          });
          alert.onDidDismiss(data =>{
            this.viewCtrl.dismiss({updated:true});
          });
          alert.present();
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

  closeEditRequest(){
    this.viewCtrl.dismiss({updated:false});
  }
}
