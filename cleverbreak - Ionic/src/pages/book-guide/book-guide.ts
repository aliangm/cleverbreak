import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GuideviewPage } from '../modals/guideview/guideview';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { HomePage } from '../home/home';
import moment from 'moment'
import {PayPal, PayPalPayment, PayPalConfiguration} from "@ionic-native/paypal";
/**
 * Generated class for the BookGuidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-book-guide',
  templateUrl: 'book-guide.html',
})
export class BookGuidePage {

  public number_adults: any = 1;
  public number_children: any = 0;
  public number_infants: any = 0;
  public a: any = 3;
  public guide_date: any = new Date().toISOString();
  public tour_date_to: any = new Date().toISOString();
  public time_from: any = "00:00";
  public time_to: any = "01:00";
  public additional: any;
  public guide:any;
  public guide_type:any = 'Tour Guide';
  public isTour:boolean = true;
  public isVirtual:boolean = false;
  public anyTime:boolean = false;
  public paymentType:Number = 2;
  public selectedCard:any;
  public date_limit:any;
  public today:any;
  public fromTimes:any = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]
  public toTimes:any= ["01:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","24:00"]
  public hours:number = 1;


  constructor(private payPal:PayPal, private loadingCtrl:LoadingController, public platform:Platform,public navCtrl: NavController, public navParams: NavParams, private http:HttpClient, private viewCtrl:ViewController, public appInfo:AppinfoProvider, private alertCtrl:AlertController) {
    this.today = new Date();
    this.date_limit = new Date();
    this.date_limit.setDate(this.today.getDate() + 7);
    this.guide_date = this.today.toISOString();
    this.guide = navParams.get('guide');
    if(this.guide.dates[0] == null || this.guide.dates[0].timeFrom == this.guide.dates[0].timeTo)
    {
      this.anyTime = true;
    }
    for(let date of this.guide.dates){
      date.dateFrom = moment(date.dateFrom).format('ll');
    }
    /* let backAction =  platform.registerBackButtonAction(() => {
       this.closeBookPage(); 
    },3); */
  }

  SelectDate(date){
    this.time_from = date.timeFrom;
    this.time_to = date.timeTo;
    this.guide_date = new Date(date.dateFrom).toISOString();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BookGuidePage');
  }
  closeBookPage() {
    this.navCtrl
      .push(GuideviewPage, { guide: this.guide })
      .then(() => {
        this.viewCtrl.dismiss();
      });
  }

  selectFromTime(){
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
    var from = new Date();
    var to = new Date();
    from.setHours(parseInt(this.time_from.substr(0,2)));
    from.setMinutes(parseInt(this.time_from.substr(3, 5)));
    to.setHours(parseInt(this.time_to.substr(0, 2)));
    to.setMinutes(parseInt(this.time_to.substr(3, 5)));
    this.hours = to.getHours() - from.getHours();
    console.log(this.hours);
  }


  SelectPayment(type){
    this.paymentType = type;
  }
  SelectCard(card){
    this.selectedCard = card;
  }

  onClickContinueButton() {
    var mdate = new Date(this.guide_date);
    var from = new Date(this.time_from);
    var to = new Date(this.time_to);
    this.hours = to.getHours() - from.getHours();
    from.setHours(parseInt(this.time_from.substr(0, 2)));
    from.setMinutes(parseInt(this.time_from.substr(3, 5)));
    to.setHours(parseInt(this.time_to.substr(0, 2)));
    to.setMinutes(parseInt(this.time_to.substr(3, 5)));

    var price, price_guests_adults, price_guests_children, price_guests_infants;
    if(this.isTour == true)
    {
      price = this.guide.priceForTourGuide * this.number_adults + this.guide.priceForTourGuideChildren * this.number_children + this.guide.priceForTourGuideInfants * this.number_infants;
      price_guests_adults = this.guide.priceForTourGuide;
      price_guests_children = this.guide.priceForTourGuideChildren;
      price_guests_infants = this.guide.priceForTourGuideInfants;
    }else if(this.isVirtual == true){
      price = this.guide.priceForVirtualGuide * this.number_adults + this.guide.priceForVirtualGuide * this.number_children + this.guide.priceForVirtualGuide * this.number_infants;
      price_guests_adults = this.guide.priceForVirtualGuide;
      price_guests_children = this.guide.priceForVirtualGuide;
      price_guests_infants = this.guide.priceForVirtualGuide;
    }
    if(this.paymentType == 0){
      const alert = this.alertCtrl.create({
        title: 'select your payment method',
        subTitle: 'Please select your payment method',
        buttons: ['OK']
      })
      alert.present();
      return;
    }
    /*if(price == 0)
    {
      const alert = this.alertCtrl.create({
        title: 'Please input your members',
        subTitle: 'Please input your members',
        buttons: ['OK']
      })
      alert.present();
      return;
    }*/
    
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/sendGuideBooking', this.appInfo.addCsrfToken({
      'guideId': this.guide.id,'isTourGuide':this.isTour, 'isVirtualGuide':this.isVirtual, 'date':mdate.toISOString(),'price_guide': price, 'adults': this.number_adults, 'children': this.number_children, 'infants': this.number_infants, 'additional_request': this.additional,'price_guests_adults': price_guests_adults, 'price_guests_children': price_guests_children, 'price_guests_infants': price_guests_infants,'grand_total':price,'number_hours':this.hours, 'bookGuidetimeFrom': this.time_from,'bookGuidetimeTo': this.time_to
    }))
      .subscribe(
        res => {
          if (res['status']) {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
            loading.present();
            var grand_total = price;
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
                'booking': res['booking_id'], 'amount': grand_total, 'stripeTokenId': this.selectedCard.id
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
                      this.navCtrl.push(HomePage, { selectedTab: 3 }).then(() => {
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
  updateBookingPaymentStatus(id, payId){
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/updateBookingPayment', this.appInfo.addCsrfToken({'booking_id':id, 'pay_id':payId})).subscribe(
      res => {
      }, err => {

      }
    );
  }
  onChangeTime(){
    var to = moment(this.time_to,'HH:mm');
    var from = moment(this.time_from,'HH:mm');
    console.log(to);
    console.log(from);
    var dur = to.diff(from, 'hours');
    this.hours = dur;
  }
  successPaymentAlert(){
    let alert = this.alertCtrl.create({
      title: 'Payment Success',
      subTitle: 'Successfully paid',
      buttons: ['Ok']
    });
    alert.present();
    alert.onDidDismiss((res) => {
      this.appInfo.common.trips = true;
      this.navCtrl.push(HomePage, { trips: 1 }).then(() => {
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
}
