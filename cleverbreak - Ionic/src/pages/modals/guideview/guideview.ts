import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';

import { AppinfoProvider } from '../../../providers/appinfo/appinfo';

import { GalleryModal } from 'ionic-gallery-modal';
import { ViewallReviewsPage } from '../../viewall-reviews/viewall-reviews';
import { GuideReviewsPage } from '../../guide-reviews/guide-reviews';
import { ViewallGuidePage } from '../../viewall-guide/viewall-guide';
import { HttpClient } from '@angular/common/http';
import moment from 'moment'
import { BookGuidePage } from '../../book-guide/book-guide';
import { TourviewPage } from '../../tourview/tourview';
import { LoginPage } from '../../login/login';
/**
 * Generated class for the GuideviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guideview',
  templateUrl: 'guideview.html',
})
export class GuideviewPage {

  guide: any;
  private photos: any[] = [];
  conversation_id:any;
  fromTourview:any;
  isFollowed:boolean = false;
  isWish:boolean = false;

  constructor(public platform:Platform ,public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, public appInfo: AppinfoProvider, public modalCtrl: ModalController, private http:HttpClient, private alertCtrl:AlertController) {
    this.guide = navParams.get('guide');
    this.fromTourview = navParams.get('fromTourView');
    if(this.guide.reviews != null){
      for(let review of this.guide.reviews){
        review.updated_at = moment(review.updated_at.substring(0, 10)).format('ll');
      }
    }

    for(let follow of appInfo.common.userProfile.follows)
    {
      if(follow.uf_id == this.guide.user.id)
      {
        this.isFollowed = true;
        break;
      }
        
    }

    if(this.appInfo.common.isLogedIn == true){
      for(let wish of appInfo.common.userProfile.guide_wishlist)
      {
        if(wish.guide_id == this.guide.user.id)
        {
          this.isWish = true;
          break;
        }
      }
    }
    /* this.guide.tours.forEach(tour => {
      this.photos.push({
        url: this.appInfo.common.url + 'images/tours/' + tour.photo,
        title: tour.title
      });
    }); */
    /* let backAction =  platform.registerBackButtonAction(() => {
       this.dismiss(); 
    },4); */
    console.log(this.guide);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuideviewPage');
  }

  viewTourImageModal(index){

    let modal = this.modalCtrl.create(GalleryModal, {
      photos: this.photos,
      initialSlide: index, // The second image
    });
    modal.present();

  }

  dismiss() {
    if(this.fromTourview !=null && this.fromTourview== true)
    {
      this.navCtrl.push(TourviewPage, {tour:this.navParams.data.tour}).then(()=>{
        this.viewCtrl.dismiss();
      }
      );
    }else
      this.viewCtrl.dismiss();
  }
  clickViewAllAboutGuide(){
    let modalpage = this.modalCtrl.create(ViewallGuidePage, {guide: this.guide});
    modalpage.present().then(() => {
      this.viewCtrl.dismiss();
    });
  }
  clickViewGuideBookPage(){
    if(this.appInfo.common.isLogedIn == true){
      let modalpage = this.modalCtrl.create(BookGuidePage, {guide: this.guide});
      modalpage.present().then(() => {
        this.viewCtrl.dismiss();
      });
    }else{
      var modal = this.modalCtrl.create(LoginPage);
      modal.present();
      modal.onDidDismiss(data => {
        if(this.appInfo.common.isLogedIn == true){
          let modalpage = this.modalCtrl.create(BookGuidePage, {guide: this.guide});
          modalpage.present().then(() => {
          this.viewCtrl.dismiss();
          });
        }
      });
    }
  }
  clickViewAllReviews(){
    let modalpage = this.modalCtrl.create(GuideReviewsPage, {guide: this.guide});
    modalpage.present().then(() => {
      this.viewCtrl.dismiss();
    });
  }
  clickViewMessage(){
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/get_conversation_id', this.appInfo.addCsrfToken({
      user2: this.guide.user.id
    }))
      .subscribe(
        res => {
          //this.hideLoadingCustom();
          if(res['status']){
            this.conversation_id = res['conversation_id'];
             var modalPage = this.modalCtrl.create('MessageviewPage', {defaultAction: null, conv: {'conversation_id': this.conversation_id,'targetUser': this.guide.user},'fromGuideViewPage': true,guide:this.guide});
            modalPage.onDidDismiss(data => {
              this.viewCtrl.dismiss();
            });
            modalPage.present();
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
  clickFollow(){
    if(this.isFollowed == false)
    {
      const req = this.http.post(this.appInfo.common.urlproxy + 'api/follow_user', this.appInfo.addCsrfToken({
        followed_user_id: this.guide.user.id
      })).subscribe(res => {
        if(res['status'] == true)
        {
          this.isFollowed = true; 
          this.appInfo.common.userProfile.follows.push({uf_id: this.guide.user.id, user_id: this.appInfo.common.userProfile.id});
        }else{
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      }, err =>{
        const alert = this.alertCtrl.create({
          title: 'Server error',
          subTitle: 'Server is gone for now!',
          buttons: ['OK']
        });
        alert.present();
      });

    }else{
      const req = this.http.post(this.appInfo.common.urlproxy + 'api/unfollow_user', this.appInfo.addCsrfToken({
        followed_user_id: this.guide.user.id
      })).subscribe(res => {
        if(res['status'] == true)
        {
          this.isFollowed = false;
          for(var i = 0; i < this.appInfo.common.userProfile.follows.length; i ++)
          {
            if(this.appInfo.common.userProfile.follows[i].uf_id == this.guide.user.id)
            {
              this.appInfo.common.userProfile.follows.splice(i, 1);
              break;
            }
          }
        }else{
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        }
      }, err =>{
        const alert = this.alertCtrl.create({
          title: 'Server error',
          subTitle: 'Server is gone for now!',
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }
  addToWishlist(){
    if(this.appInfo.common.isLogedIn == true){
      this.isWish = !this.isWish;
      this.appInfo.common.userProfile.guide_wishlist.push({guide_id: this.guide.user.id, user_id: this.appInfo.common.userProfile.id});
      const req = this.http.get(this.appInfo.common.urlproxy + 'api/addToGuideWishList/' + this.guide.user.id)
        .subscribe(res => {
          if(res['status'] == true)
          {
  
          }else{
            const alert = this.alertCtrl.create({
              title: 'Server error',
              subTitle: 'Server is gone for now!',
              buttons: ['OK']
            });
            alert.present();
          }
        }, err => {
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        });
    }else{
      var modal = this.modalCtrl.create(LoginPage);
      modal.present();
      modal.onDidDismiss(data => {
        if(this.appInfo.common.isLogedIn == true){
          this.isWish = !this.isWish;
          this.appInfo.common.userProfile.guide_wishlist.push({guide_id: this.guide.user.id, user_id: this.appInfo.common.userProfile.id});
          const req = this.http.get(this.appInfo.common.urlproxy + 'api/addToGuideWishList/' + this.guide.user.id)
          .subscribe(res => {
            if(res['status'] == true)
            {
    
            }else{
              const alert = this.alertCtrl.create({
                title: 'Server error',
                subTitle: 'Server is gone for now!',
                buttons: ['OK']
              });
              alert.present();
            }
          }, err => {
            const alert = this.alertCtrl.create({
              title: 'Server error',
              subTitle: 'Server is gone for now!',
              buttons: ['OK']
            });
            alert.present();
          });
          }
      });
    }
    
  }
  removeFromWishlist(){
    if(this.appInfo.common.isLogedIn == true){
      this.isWish = !this.isWish;
      for(var i = 0;i < this.appInfo.common.userProfile.guide_wishlist.length;i ++)
      {
        if(this.appInfo.common.userProfile.guide_wishlist[i].guide_id == this.guide.user.id)
        {
          this.appInfo.common.userProfile.guide_wishlist.splice(i, 1);
          break;
        }
      }
      const req = this.http.get(this.appInfo.common.urlproxy + 'api/removeFromGuideWishList/' + this.guide.user.id)
        .subscribe(res => {
          if(res['status'] == true)
          {

          }else{
            const alert = this.alertCtrl.create({
              title: 'Server error',
              subTitle: 'Server is gone for now!',
              buttons: ['OK']
            });
            alert.present();
          }
        }, err => {
          const alert = this.alertCtrl.create({
            title: 'Server error',
            subTitle: 'Server is gone for now!',
            buttons: ['OK']
          });
          alert.present();
        });
    }else{
      var modal = this.modalCtrl.create(LoginPage);
      modal.present();
      modal.onDidDismiss(data => {
        if(this.appInfo.common.isLogedIn == true){
          this.isWish = !this.isWish;
          for(var i = 0;i < this.appInfo.common.userProfile.guide_wishlist.length;i ++)
          {
            if(this.appInfo.common.userProfile.guide_wishlist[i].guide_id == this.guide.user.id)
            {
              this.appInfo.common.userProfile.guide_wishlist.splice(i, 1);
              break;
            }
          }
          const req = this.http.get(this.appInfo.common.urlproxy + 'api/removeFromGuideWishList/' + this.guide.user.id)
            .subscribe(res => {
              if(res['status'] == true)
              {

              }else{
                const alert = this.alertCtrl.create({
                  title: 'Server error',
                  subTitle: 'Server is gone for now!',
                  buttons: ['OK']
                });
                alert.present();
              }
            }, err => {
              const alert = this.alertCtrl.create({
                title: 'Server error',
                subTitle: 'Server is gone for now!',
                buttons: ['OK']
              });
              alert.present();
            });
          }
      });
    }
  }
  clickTour(tour){
    /* var modal = this.modalCtrl.create(LoginPage);
    modal.present(); */
    this.navCtrl.push(TourviewPage, {tour:tour}).then(()=>{
      this.viewCtrl.dismiss();
    }
    );
  }
}
