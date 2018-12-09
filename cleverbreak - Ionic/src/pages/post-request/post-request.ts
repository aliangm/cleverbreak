import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { Title } from '@angular/platform-browser';

/**
 * Generated class for the PostRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-request',
  templateUrl: 'post-request.html',
})
export class PostRequestPage {

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
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, private http:HttpClient, private appInfo:AppinfoProvider, private alertCtrl:AlertController) {
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.closePostRequest(); 
    },4);*/
  }
  
  publishRequest(){
    var activities = "";
    for(let interest of this.interests){
      activities = activities + ' ' + interest;
    }
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/save_request', this.appInfo.addCsrfToken({title:this.title,location:this.location,language: this.language, price:this.price, date:this.date, timeFrom:this.time_from, timeTo:this.time_to, about: this.about,activities: activities, adults:this.number_adults, children: this.number_children, infants: this.number_infants, interests: this.interests
    }))
    .subscribe(
      res => {
        if (res['status']) {
          this.viewCtrl.dismiss({posted:true});
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

  closePostRequest(){
    this.viewCtrl.dismiss({posted:false});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PostRequestPage');
  }

}
