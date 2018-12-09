import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, LoadingController, ModalController, AlertController, Content, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { ImageSlidePage } from '../image-slide/image-slide';
import { ViewallReviewsPage } from '../viewall-reviews/viewall-reviews';
import { ViewallTourPage } from '../viewall-tour/viewall-tour';
import { MessageviewPage } from '../modals/messageview/messageview';
import { BookingPage } from '../booking/booking';
import { BookPage } from '../book/book';
import moment from 'moment'
import { GuideviewPage } from '../modals/guideview/guideview';
import {DomSanitizer} from '@angular/platform-browser'
import { LoginPage } from '../login/login';

/* import {VideoPlayerPipe} from '../../pipes/video-player/video-player' */

/**
 * Generated class for the TourviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-tourview',
  templateUrl: 'tourview.html',
})
export class TourviewPage {

  @ViewChild('book') btn_book: ElementRef;
  isAlive:any = false;
  tour: any;
  review_length: any;
  reviews: any;
  tourData: any;
  loading: any;
  videoUrl: any;
  months: any = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov', 'Dec'];
  days: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  conversation_id: any;
  wishlist:any = [{}];
  morePhotosClicked: boolean = false;
  constructor(private dom:DomSanitizer,public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private viewCtrl:ViewController, public appInfo: AppinfoProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private http: HttpClient) {
    this.tour = navParams.get('tour');
    
    this.loadingData();
    console.log("tourview");
    /* let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
        Object.keys(elements).map((key) => {
            elements[key].style.display = 'none';
        });
    }  */
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.dismiss(); 
    },4);*/
  }
  clickedMorePhotos(){
    /* this.morePhotosClicked = true;
    var modalpage = this.modalCtrl.create(ImageSlidePage, {tour: this.tour});
    modalpage.present(); */
    this.navCtrl.push(ImageSlidePage, {
      tour: this.tour
    }).then(() => {
      this.viewCtrl.dismiss();
  });
  }
  clickViewBookPage(){
    if(this.appInfo.common.isLogedIn == true){
      this.navCtrl.push(BookPage, {
        tourData: this.tourData,
        tour: this.tour
      }).then(() => {
        this.viewCtrl.dismiss();
      });
    }else{
      var modal = this.modalCtrl.create(LoginPage);
      modal.present();
      modal.onDidDismiss(data => {
        if(this.appInfo.common.isLogedIn == true){
          this.navCtrl.push(BookPage, {
            tourData: this.tourData,
            tour: this.tour
          }).then(() => {
            this.viewCtrl.dismiss();
          });
        }
      });
    }
  }
  clickViewMessage(){
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_conversation_id', this.appInfo.addCsrfToken({
      user2: this.tourData.user.id
    }))
      .subscribe(
        res => {
          //this.hideLoadingCustom();
          if(res['status']){
            this.conversation_id = res['conversation_id'];
             var modalPage = this.modalCtrl.create('MessageviewPage', {defaultAction: null, conv: {'conversation_id': this.conversation_id,'targetUser': this.tourData.user},'fromTourViewPage': true,'tour':this.tour});
            modalPage.onDidDismiss(data => {
              this.viewCtrl.dismiss();
            });
            modalPage.present();
            /* this.navCtrl.push(MessageviewPage, {defaultAction: null, conv: {'conversation_id': this.conversation_id,'targetUser': this.tourData.user},'fromTourViewPage': true,'tour':this.tour}).then(() => {
              this.viewCtrl.dismiss();
           }); */
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
  clickViewAllAboutTour(){
    let modalpage = this.modalCtrl.create(ViewallTourPage, {about_tour: this.tourData.tour.about_tour, tour: this.tour});
    modalpage.present().then(() => {
      this.viewCtrl.dismiss();
    });
  }
  clickViewAllReviews(){
    let modalpage = this.modalCtrl.create(ViewallReviewsPage, {reviews: this.tourData.reviews, tour: this.tour});
    modalpage.present().then(() => {
      this.viewCtrl.dismiss();
    });
  }
  loadingData(){
    const req = this.http.get(this.appInfo.common.urlproxy + 'api/get_tour_data/' + this.tour.id)
      .subscribe(
        res => {
          //this.hideLoadingCustom();
          if(res['status']){
            this.tourData = res;
            if(this.tourData.tour.video == "yes")
            {
              this.videoUrl = this.dom.bypassSecurityTrustResourceUrl(this.tourData.tour.videoUrl);
            }
            if(this.tourData.reviews != null){
              for(let review of this.tourData.reviews){
                review.updated_at = moment(review.updated_at.substring(0, 10)).format('ll');
              }
              this.review_length = this.tourData.reviews.length;
            }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad TourviewPage'); 
  }
  ionViewDidEnter(){
    console.log('ionViewDidLoad TourviewPage'); 
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  onClickViewGuide(guide)
  {
    this.navCtrl.push(GuideviewPage, {
      guide: this.tourData.guide, fromTourView: true, tour:this.tour
    }).then(() => {
      this.viewCtrl.dismiss();
    });
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
