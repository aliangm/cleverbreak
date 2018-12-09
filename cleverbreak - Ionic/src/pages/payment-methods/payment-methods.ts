import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { NewPaymentMethodPage } from '../new-payment-method/new-payment-method';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

/**
 * Generated class for the PaymentMethodsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
})
@Component({
  selector: 'page-payment-methods',
  templateUrl: 'payment-methods.html',
})
export class PaymentMethodsPage {

  constructor(private loadingCtrl: LoadingController, private alertCtrl:AlertController,public appInfo:AppinfoProvider ,private http:HttpClient, public platform:Platform,public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, private modalCtrl: ModalController) {

    /*let backAction =  platform.registerBackButtonAction(() => {
       this.dismiss(); 
    },3);*/
    if(this.appInfo.common.cards[0])
    this.refreshCards();
  }
  refreshCards(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    const req = this.http.get(this.appInfo.common.urlproxy + 'api/get_all_paymentmethod').subscribe(
      res=>{
        if(res['status'] == true){
          this.appInfo.common.cards = res['all_cards']['data'];
          loading.dismiss();
        }else{
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      },err=>{
        loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
      }
    );
  }
  removeCard(card){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    const req = this.http.get(this.appInfo.common.urlproxy + 'api/deleteCard/'+ card.id + '/' + card.customer).subscribe(
      res=>{
        if(res['status'] == true){
          var idx = this.appInfo.common.cards.indexOf(card);
          if(idx > -1)
            this.appInfo.common.cards.splice(idx, 1);
          loading.dismiss();
        }else{
          loading.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      },err=>{
        loading.dismiss();
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
    console.log('ionViewDidLoad PaymentMethodsPage');
  }
  dismiss(){
    this.dismiss();
  }
  clickViewNewPaymentMethod(){
    /* var modalPage = this.modalCtrl.create(NewPaymentMethodPage);
    modalPage.onDidDismiss(data => {
    });
    modalPage.present(); */
    this.navCtrl.push(NewPaymentMethodPage);
  }
}
