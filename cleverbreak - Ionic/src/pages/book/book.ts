import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { TourviewPage } from '../tourview/tourview';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HttpClient } from '@angular/common/http';
import moment from 'moment'
import { TripsPage } from '../trips/trips';
import { HomePage } from '../home/home';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Type } from '@angular/compiler/src/output/output_ast';
import {PayPal, PayPalPayment, PayPalConfiguration} from "@ionic-native/paypal";
/**
 * Generated class for the BookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var Stripe;

@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {

  stripe = Stripe('pk_test_40DGCIWQtfLaxUi4G75iUGEM');
  public tourData: any;
  public number_adults: any = 1;
  public number_children: any = 0;
  public a: any = 3;
  public tour_date_from: any = new Date().toISOString();
  public tour_date_to: any = new Date().toISOString();
  public time_from: any = "00:00";
  public time_to: any = "01:00";
  public additional: any;
  public paymentType:Number = 1;
  public selectedCard:any;
  public anyTime:boolean = false;
  public selectedDate:any;
  public date_limit:any;
  public today:any;
  public saveCard:boolean = false;
  public hours:number = 1;
  public newCard:boolean = false;
  public card:any;
  public fromTimes:any = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]
  public toTimes:any= ["01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","24:00"]
  constructor(private iab:InAppBrowser,private loadingCtrl:LoadingController , public platform:Platform,public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public appInfo: AppinfoProvider, private http: HttpClient, private alertCtrl: AlertController,private payPal: PayPal) {
    this.today = new Date();
    this.today.setDate(this.today.getDate() + 7);
    this.date_limit = new Date();
    this.date_limit.setDate(this.date_limit.getDate() + 7);
    this.tour_date_from = this.date_limit.toISOString();
    //this.tour_date_from = this.tour_date_from + new Date('0000-00-07');
    this.tourData = navParams.get('tourData');
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.closeBookPage(); 
    },3);*/
  
    if(this.tourData.dates[0] ==null || this.tourData.dates[0].timeFrom == this.tourData.dates[0].timeTo)
    {
      this.anyTime = true;
    }
    for(let date of this.tourData.dates){
      date.dateFrom = moment(date.dateFrom).format('ll');
    }
  }

  SelectNewCard(){
    let elements = this.stripe.elements();
    this.newCard = true;
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '18px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    // Create an instance of the card Element.
    this.card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

  }
  ionViewDidLoad() {
    //stripe = Stripe('pk_test_40DGCIWQtfLaxUi4G75iUGEM');
    // Create an instance of Elements.

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    
    console.log('ionViewDidLoad BookPage');
  }

  closeBookPage() {
    console.log(this.tour_date_from);
    this.navCtrl
      .push(TourviewPage, { tour: this.navParams.data.tour })
      .then(() => {
        this.viewCtrl.dismiss();
      });
  }
  SelectPayment(type){
    this.paymentType = type;
    if(type == 2)
      this.newCard = false;
  }
  SelectCard(card){
    this.newCard = false;
    this.selectedCard = card;
  }


  selectFromTime(){
    var mdate = new Date(this.tour_date_from);
    var from = new Date();
    var to = new Date();
    var startTime = parseInt(this.time_from.substr(0, 2));
    from.setHours(startTime);
    from.setMinutes(parseInt(this.time_from.substr(3, 5)));
    this.toTimes = [];
    var i = 0;
    for(var j = startTime + 1;j <= 24;j ++)
    {
      if(j < 10)
        this.toTimes[i] = "0" + j + ":00";
      else
        this.toTimes[i] = j + ":00";
        i ++;
    }
    if(parseInt(this.time_to.substr(0, 2)) == 1)
      this.time_to = this.toTimes[0];
    to.setHours(parseInt(this.time_to.substr(0, 2)));
    to.setMinutes(parseInt(this.time_to.substr(3, 5)));
    this.hours = to.getHours() - from.getHours();
    console.log(this.hours);
  }
  selectToTime(){
    var mdate = new Date(this.tour_date_from);
    var from = new Date();
    var to = new Date();
    from.setHours(parseInt(this.time_from.substr(0,2)));
    from.setMinutes(parseInt(this.time_from.substr(3, 5)));
    to.setHours(parseInt(this.time_to.substr(0, 2)));
    to.setMinutes(parseInt(this.time_to.substr(3, 5)));
    this.hours = to.getHours() - from.getHours();
    console.log(this.hours);
  }

  SelectDate(date){
    this.selectedDate = date;
    this.tour_date_from = date.dateFrom;
    this.time_from = this.selectedDate.timeFrom;
    this.time_to = this.selectedDate.timeTo;
    var from = new Date(this.time_from);
    var to = new Date(this.time_to);
    this.hours = to.getHours() - from.getHours();
  }
  // success payment alert
  successPaymentAlert(){
    let alert = this.alertCtrl.create({
      title: 'Payment Success',
      subTitle: 'Successfully paid',
      buttons: ['Ok']
    });
    alert.present();
    alert.onDidDismiss((res) => {
      this.appInfo.common.trips = true;
      this.navCtrl.push(HomePage, { selectedTab: 3 }).then(() => {
        this.viewCtrl.dismiss();
      });
    })
  }

  // failure Payment Alert
  failurePaymentAlert(){
    let alert = this.alertCtrl.create({
      title: 'Payment Failed' ,
      subTitle: 'Server is gone',
      buttons: [{
        text: 'Try Again',
        handler: () => {
        }
      },{
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    alert.present();
  }
  updateBookingPaymentStatus(id, payId){
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/updateBookingPayment', this.appInfo.addCsrfToken({'booking_id':id, 'pay_id':payId})).subscribe(
      res => {
        
      }, err => {

      }
    );
  }
  onClickContinueButton() {
    var mdate = new Date(this.tour_date_from);
    var from = new Date();
    var to = new Date();
    from.setHours(parseInt(this.time_from.substr(0, 2)));
    from.setMinutes(parseInt(this.time_from.substr(3, 5)));
    to.setHours(parseInt(this.time_to.substr(0, 2)));
    to.setMinutes(parseInt(this.time_to.substr(3, 5)));
    
    if(this.paymentType == 0){
      const alert = this.alertCtrl.create({
        title: 'select your payment method',
        subTitle: 'Please select your payment method',
        buttons: ['OK']
      })
      alert.present();
      return;
    }
    var tokenId;
    if(this.newCard == true)
    {
      this.stripe.createToken(this.card).then(result => {
        if(result.error){

        } else {
          tokenId = result['token']['card']['id'];
          console.log(tokenId);
        }
      });
    }else if(this.selectedCard != null){
      tokenId = this.selectedCard;
    }
    console.log(this.selectedCard);

    var grand_total = this.number_adults * this.tourData.tour.price_per_adult + this.number_children * this.tourData.tour.price_per_children;
    /*if(grand_total == 0)
    {
      const alert = this.alertCtrl.create({
        title: 'Please input your members',
        subTitle: 'Please input your members',
        buttons: ['OK']
      })
      alert.present();
      return;
    }*/
    
    
   
    this.hours = to.getHours() - from.getHours();
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/sendTourBooking', this.appInfo.addCsrfToken({
      'guide_tour': this.tourData.guide.isGuideTour, 'tourId': this.tourData.tour.id, 'tour_date_from': mdate.toISOString(), 'tour_date_to': mdate.toISOString(), 'tour_time': this.time_from + '-' + this.time_to, 'grand_total': this.number_adults * this.tourData.tour.price_per_adult + this.number_children * this.tourData.tour.price_per_children, 'guests_adults': this.number_adults, 'guests_children': this.number_children, 'additional_requests': this.additional, 'price_guests_adults': this.tourData.tour.price_per_adult * this.number_adults, 'price_guests_children': this.tourData.tour.price_per_children * this.number_children, 'price_guests_infants': this.tourData.tour.price_per_infant, 'number_hours': this.hours
    }))
      .subscribe(
        res => {
          if (res['status']) {

            
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
            loading.present();
            var grand_total = this.number_adults * this.tourData.tour.price_per_adult * this.hours + this.number_children * this.tourData.tour.price_per_children * this.hours;
            if(this.paymentType == 2){  //Paypal
              /* const ret = this.http.post(this.appInfo.common.urlproxy + 'api/bookWithPaypal', this.appInfo.addCsrfToken({
                'booking': res['booking_id']
              })).subscribe(
                res => {
                  loading.dismiss();
                  console.log(res['link']);
                  const browser = this.iab.create(res['link'], '_self').on('loadstart').subscribe(event => {
                    var param = getParameters(event.url); //Read the parameters from the url
                  
                  
                    if (isCorrectParameters(param)) { //Check parameters agaist the payment gateway response url
                      browserRef.close(); // colse the browser
                  
                      //Handle the success and failed scenarios
                      if(success){
                        $state.go('test');
                      }else{
                        // handle fail scenario
                      }
                    }
                  });
                }, error => {
                  loading.dismiss();
                  const alert = this.alertCtrl.create({
                    title: 'Server error',
                    subTitle: 'Server is gone for now!',
                    buttons: ['OK']
                  });
                  alert.present();
                }
              ); */
              
                this.payPal.init({
                  PayPalEnvironmentProduction: '',
                  PayPalEnvironmentSandbox: 'Afg5DVEQIBgU1B1xesydsCMWtg8qJ-FmyfETY51kxYTPT_KyJxhiJ4Vrc96usORWGLy5FTqsRa3oKpaV'
                }).then(() => {
                   this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
                  })).then(() => {
                    let payment = new PayPalPayment(grand_total.toString(), 'USD', 'Description', 'sale');
                    this.payPal.renderSinglePaymentUI(payment).then((result) => {
                        console.log("Result from paypal:", result);
                        loading.dismiss();
                        this.successPaymentAlert();
                        this.updateBookingPaymentStatus(res['booking_id'], result['response']['id']);
                     }, (err) => {
                      loading.dismiss();
                        console.log("Error", err);
                        console.log("Your order has not been submitted");
                        this.failurePaymentAlert();
                    });
                  }, (conf) => {
                    loading.dismiss();
                      console.log("Configuration Error", conf);
                      console.log("Your order has not been submitted");
                      this.failurePaymentAlert();
                  });
                },(init) => {
                  loading.dismiss();
                    console.log("Init Error", init);
                    console.log("Your order has not been submitted");
                    this.failurePaymentAlert();
                });
              }
            else{
              const ret = this.http.post(this.appInfo.common.urlproxy + 'api/bookWithStripe', this.appInfo.addCsrfToken({
                'booking': res['booking_id'], 'amount': grand_total, 'stripeTokenId': tokenId
              })).subscribe(
                res => {
                  loading.dismiss();
                  if(res['status'] == true){
                    const alert = this.alertCtrl.create({
                      title: 'Success',
                      subTitle: 'Successfully paid!',
                      buttons: ['OK']
                    });
                    alert.present();
                    alert.onDidDismiss(() => {
                      this.appInfo.common.trips = true;
                      this.navCtrl.push(HomePage, { trips: 1 }).then(() => {
                        this.viewCtrl.dismiss();
                      });
                    })
                    
                  }
                }, error => {
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
}
