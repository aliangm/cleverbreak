import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

import { HomePage } from '../home/home';
import { GuidesPage } from '../guides/guides';
import { ToursPage } from '../tours/tours';
import { TourviewPage } from '../tourview/tourview';
import { ModalPriceRange } from '../modals/pricerange/pricerange';
import { GuideviewPage } from '../modals/guideview/guideview';

import { CalendarModal, CalendarModalOptions } from "ion2-calendar";
import { LoginPage } from '../login/login';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  mainData: any;
  searchInfo: any;
  loading: any;
  isAjaxLoading:boolean = false;
  mySlideOptions = {
    pager:true
  };
  wishlist:any = [{}];
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private modalCtrl: ModalController, public loadingCtrl: LoadingController, public appInfo: AppinfoProvider, private http: HttpClient) {
    this.mainData = {
      tours: []
    };

    this.searchInfo = {
      keyword: '',
      guests: '0',
      interests: [],
      guidetype: '0',
      dateRange: {
        from: null,
        to: null
      },
      pricerange:{
        min: null,
        max: null
      }
    }
    if(this.appInfo.common.isLoggedIn == true)
    {
      this.getWishlist();
    }
    if(this.appInfo.common.refresh == true)
    {
      if(this.appInfo.common.isLogedIn == true)
        this.getWishlist();
      else{
        this.appInfo.common.wishlist = [{}];
        this.appInfo.common.guide_wishlist = [{}];
      }
        
      this.searchSubmit();
    }else
      this.mainData = this.appInfo.common.mainData;
    this.appInfo.common.norefresh = true;
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad MainPage');
  }
  ionViewWillEnter() {
    console.log('ionViewWill Enter MainPage');
  }
  showLoadingCustom() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'loading-transparent',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box">
          </div>
        </div>`,
      duration: 10000
    });
  
    this.loading.onDidDismiss(data => {
      console.log(data);
    });
  
    this.loading.present();
  }

  hideLoadingCustom(){
    this.loading.dismiss(true);
  }

  clickSeeAllGuides(){
    this.navCtrl.push(GuidesPage, {srchInfo: this.searchInfo});
  }

  clickSeeAllTours(type:string){
    this.navCtrl.push(ToursPage, {srchInfo: this.searchInfo, pagetype: type});
  }

  clickViewTour(tour){
    var modalPage = this.modalCtrl.create('TourviewPage', {tour: tour});
    modalPage.onDidDismiss(data => {
    });
    modalPage.present();
  }

  clickViewGuide(guide){
    var modalPage = this.modalCtrl.create('GuideviewPage', {guide: guide});
    modalPage.onDidDismiss(data => {
      // after close action
    });
    modalPage.present();
  }


  private searchSubmit(){

    if(!this.isAjaxLoading){
      this.isAjaxLoading = true;
      this.showLoadingCustom();
      const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_main_data', this.appInfo.addCsrfToken({
        search: this.searchInfo,
        searchRange: ['tours', 'experiences', 'guides']
      }) )
        .subscribe(
          res => {
            this.isAjaxLoading = false;
            this.hideLoadingCustom();
            
            if(res['status']){
              if(res['guides'] != null){
                res['guides'].forEach(guide => {
                  var rateAvg = 0;
                  if(guide.reviews != null){
                    if(parseInt(guide.reviews.legnth) != 0){
                      guide.reviews.forEach(function (value) {
                        rateAvg += value.stars;
                      }); 
                      rateAvg /= guide.reviews.length;
                      if(isNaN(rateAvg)) rateAvg = 0;
                      rateAvg = Math.round(rateAvg * 2) / 2;
                    }
                    guide.rating = rateAvg;
                    guide.slideIndex = 0;
                  }
                });
              }
              this.mainData['tours'] = res['tours'];
              this.appInfo.common.mainData = this.mainData;
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
            this.isAjaxLoading = false;
            this.hideLoadingCustom();
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

  private onSearchInput($event){
    this.searchSubmit();
  }
  private onSearchCancel($event){
    this.searchInfo.keyword = '';
    this.searchSubmit();
  }
  
  private searchSelectDates($event){
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'RANGE',
      closeLabel: 'Cancel',
      doneLabel: 'Done',
      cssClass: 'show-page',
      defaultDateRange: this.searchInfo.dateRange
    };

    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date, type) => {
      if (type === 'done') {
        this.searchInfo.dateRange = Object.assign({}, {
          from: date.from.dateObj,
          to: date.to.dateObj,
        });
      }else{
        this.searchInfo.dateRange = Object.assign({}, {
        });
      }
      this.searchSubmit();
    });
  }

  private searchSelectPrice($event){
    var data = { 
      title: 'Price range',
      range: this.searchInfo.pricerange
    };
    var modalPage = this.modalCtrl.create('ModalPriceRange', data, {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: 'customDialog small-width'
    });
    modalPage.onDidDismiss(data => {
      if(typeof data == "undefined") {
        this.searchInfo.pricerange = Object.assign({min:null, max:null});
      }else{

        if(typeof data.min != 'undefined') this.searchInfo.pricerange.min = data.min;
        if(typeof data.max != 'undefined') this.searchInfo.pricerange.max = data.max;
      }
      this.searchSubmit();
    });
    modalPage.present();
  }

  private searchSelectGuests($event){

    let options = [
      {label: 'All', value: '0'},
      {label: '1-5', value: '1'},
      {label: '6-10', value: '2'},
      {label: '10+', value: '3'}
    ];

    let alert = this.alertCtrl.create();
    alert.setTitle('Guests range');

    var i:number; 
    for(i = 0; i <  options.length; i++){
      let item = options[i];

      let radioOption = {
        type: 'radio',
        label: item.label,
        value: item.value,
        checked: false
      }
      if(item.value == this.searchInfo.guests) radioOption.checked = true;
      alert.addInput(radioOption);
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Apply',
      handler: (data: any) => {
        this.searchInfo.guests = data;
        this.searchSubmit();
      }
    });

    alert.present();
  }

  private searchSelectGuideType($event){

    let options = [
      {label: 'Both', value: '0'},
      {label: 'Local Guides', value: '1'},
      {label: 'Virtual Guides', value: '2'}
    ];

    let alert = this.alertCtrl.create();
    alert.setTitle('Guide Type');

    var i:number; 
    for(i = 0; i <  options.length; i++){
      let item = options[i];

      let radioOption = {
        type: 'radio',
        label: item.label,
        value: item.value,
        checked: false
      }
      if(item.value == this.searchInfo.guidetype) radioOption.checked = true;
      alert.addInput(radioOption);
    }

    alert.addButton({text:'Cancel', handler: (data:any) => {
      if(this.searchInfo.guidetype != 0){
        this.searchInfo.guidetype = 0;
        this.searchSubmit();
      }
    }});
    alert.addButton({
      text: 'Apply',
      handler: (data: any) => {
        this.searchInfo.guidetype = data;
        this.searchSubmit();
      }
    });

    alert.present();
  }

  private searchSelectInterests($event) {
    var activities = this.appInfo.common.activities;
    let options = activities.map(item => ({label: item.activity, value: item.activity}));

    let alert = this.alertCtrl.create();
    alert.setTitle('Interests');

    var i:number; 
    for(i = 0; i <  options.length; i++){
      let item = options[i];

      let radioOption = {
        type: 'checkbox',
        label: item.label,
        value: item.value,
        checked: false
      }
      if(this.searchInfo.interests.includes(item.value)) radioOption.checked = true;
      alert.addInput(radioOption);
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Apply',
      handler: (data: any) => {
        console.log(data);
        this.searchInfo.interests = data;
        this.searchSubmit();
      }
    });

    alert.present();
  }

  public getWishlist(){
    const req = this.http.get(this.appInfo.common.urlproxy + 'api/wishlist')
    .subscribe(
      res => {
        if(res['status']){
          for(let wishitem of res['wishlist'])
          {
            this.appInfo.common.wishlist[wishitem['item_id']] = true;
          }
          console.log(this.appInfo.common.wishlist);
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

  public addToWishlist(id){
    if(this.appInfo.common.isLogedIn == true){
      const req = this.http.get(this.appInfo.common.urlproxy + 'api/addToWishList/' + id)
        .subscribe(
          res => {
            if(res['status']){
              this.appInfo.common.wishlist[id] = true;
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
      }else{
        var modal = this.modalCtrl.create(LoginPage);
        modal.present();
        modal.onDidDismiss(data => {
          if(this.appInfo.common.isLogedIn == true){
          const req = this.http.get(this.appInfo.common.urlproxy + 'api/addToWishList/' + id)
          .subscribe(
          res => {
            if(res['status']){
              this.appInfo.common.wishlist[id] = true;
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
        }}); 
      }
  }
  
  public removeFromWishlist(id){
    if(this.appInfo.common.isLogedIn == true){
      const req = this.http.get(this.appInfo.common.urlproxy + 'api/removeFromWishList/'+ id)
        .subscribe(
          res => {
            if(res['status']){
              this.appInfo.common.wishlist[id] = false;
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
      }else{
        var modal = this.modalCtrl.create(LoginPage);
        modal.present();
        modal.onDidDismiss(data => {
          if(this.appInfo.common.isLogedIn == true){
            const req = this.http.get(this.appInfo.common.urlproxy + 'api/removeFromWishList/'+ id)
            .subscribe(
              res => {
                if(res['status']){
                  this.appInfo.common.wishlist[id] = false;
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
        }}); 
        } 
  }
}

