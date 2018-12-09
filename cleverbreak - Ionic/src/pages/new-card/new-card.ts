import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, AlertController, LoadingController } from 'ionic-angular';
import { PaymentMethodsPage } from '../payment-methods/payment-methods';
import { Stripe } from '@ionic-native/stripe';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

/**
 * Generated class for the NewCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-card',
  templateUrl: 'new-card.html',
})
export class NewCardPage {

  public name:any;
  public card_number:any;
  public cvc:any;
  public expr_date:any;
  constructor(private loadingCtrl:LoadingController, private alertCtrl:AlertController, private appInfo:AppinfoProvider, private http: HttpClient, private stripe:Stripe , public platform:Platform,public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.dismissNewCard(); 
    },4);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewCardPage');
  }
  dismissNewCard(){
    this.navCtrl.parent.viewCtrl.dismiss();
  }
  addNewCard(){
    let card = {
      number: this.card_number,
      expMonth: parseInt(this.expr_date.slice(-2)),
      expYear: parseInt(this.expr_date.slice(0,4)),
      cvc: this.cvc
    };
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.stripe.setPublishableKey('pk_test_40DGCIWQtfLaxUi4G75iUGEM');
    this.stripe.createCardToken(card)
    .then(token => {
      const req = this.http.post(this.appInfo.common.urlproxy + 'api/add_card',this.appInfo.addCsrfToken({'tokenid':token['id']})).subscribe(
        res=>{
          if(res['status'] == true){
            console.log(res['response']);
            loading.dismiss();
            const alert = this.alertCtrl.create({
              title: 'Card added',
              subTitle: 'Your new card has been added successfully',
              buttons: ['OK']
            });
            alert.present();
            alert.onDidDismiss(() => {
              this.appInfo.common.cards.push(res['response']);
              this.navCtrl.parent.viewCtrl.dismiss();
            }); 
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
    })
    .catch(error => console.error(error));
    console.log(card);
  }
}
