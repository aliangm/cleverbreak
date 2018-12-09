import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController, Slides  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';

import { CalendarModal, CalendarModalOptions } from "ion2-calendar";

/**
 * Generated class for the GuidesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guides',
  templateUrl: 'guides.html',
})
export class GuidesPage {

  @ViewChild(Slides) slides: Slides;

  mainData: any;
  searchInfo: any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private modalCtrl: ModalController, public loadingCtrl: LoadingController, public appInfo: AppinfoProvider, private http: HttpClient) {

    this.mainData = {
      guides: []
    };

    var srchParam = navParams.get('srchInfo');
    if(typeof srchParam == "undefined"){
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
    }else{
      this.searchInfo = srchParam;
    }

    this.searchSubmit();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuidesPage');
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

  private clickSlideNext(guide, offset:number){
    console.log(guide);
    if(typeof guide.slideIndex == "undefined")
      guide.slideIndex = 0;
    guide.slideIndex += offset;
  }
  
  clickViewGuide(guide){
    var modalPage = this.modalCtrl.create('GuideviewPage', {guide: guide});
    modalPage.onDidDismiss(data => {
      // after close action
    });
    modalPage.present();
  }
  
  private searchSubmit(){
    this.showLoadingCustom();
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_main_data', this.appInfo.addCsrfToken({
      search: this.searchInfo,
      searchRange: ['guides']
    }) )
      .subscribe(
        res => {
          this.hideLoadingCustom();
          if(res['status']){
            res['guides'].forEach(guide => {
              if(guide.reviews != null){
              var rateAvg = 0;
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
            //console.log(res);
            this.mainData = res;
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

  onSearchInput($event){
    this.searchSubmit();
  }
  onSearchCancel($event){

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


}
