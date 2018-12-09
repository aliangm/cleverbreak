import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http'; 
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
//Permission
import { Diagnostic } from '@ionic-native/diagnostic';
//import { AngularAgoraRtcModule, AgoraConfig } from 'angular-agora-rtc';

// 3rd party module
import { CalendarModule } from "ion2-calendar";
import { MomentModule } from 'ngx-moment';

// Pages
import { MyApp } from './app.component';
import { SplashPage } from '../pages/splash/splash';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { GuidesPage } from '../pages/guides/guides';
import { ToursPage } from '../pages/tours/tours';
import { TourviewPage } from '../pages/tourview/tourview';
import { TourviewPageModule } from '../pages/tourview/tourview.module';
import { TripsPage } from '../pages/trips/trips';
import { MessagePage } from '../pages/message/message';
import { ProfilePage } from '../pages/profile/profile';
import { BookingPage } from '../pages/booking/booking';
import { MyRequestPage } from '../pages/my-request/my-request';
import { PersonalInformationPage } from '../pages/personal-information/personal-information';
// Custom providers
import { CommonProvider } from '../providers/common/common';
import { AppinfoProvider } from '../providers/appinfo/appinfo';
import { VoicecallProvider } from '../providers/voicecall/voicecall';

import { StringcutPipe, timeStringPipe } from '../pipes/stringcut/stringcut';
import {VideoPlayerPipe} from '../pipes/video-player/video-player'

import { CommonModule } from '@angular/common';
import { GuideInformationPage } from '../pages/guide-information/guide-information';
import { AccountSettingsPage } from '../pages/account-settings/account-settings';
import { PaymentMethodsPage } from '../pages/payment-methods/payment-methods';
import { NewCardPage } from '../pages/new-card/new-card';
import { PaypalPage } from '../pages/paypal/paypal';
import { IbanPage } from '../pages/iban/iban';
import { NewPaymentMethodPage } from '../pages/new-payment-method/new-payment-method';
import { ImageSlidePage } from '../pages/image-slide/image-slide';
import { ViewallReviewsPage } from '../pages/viewall-reviews/viewall-reviews';
import { ViewallTourPage } from '../pages/viewall-tour/viewall-tour';
import {MessageviewPageModule} from '../pages/modals/messageview/messageview.module'
import { BookPage } from '../pages/book/book';
import { ManageBookingPage } from '../pages/manage-booking/manage-booking';
import { PostRequestPage } from '../pages/post-request/post-request';
import { BookingDetailPage } from '../pages/booking-detail/booking-detail';
import { EditRequestPage } from '../pages/edit-request/edit-request';
import { GuideReviewsPage } from '../pages/guide-reviews/guide-reviews';
import { ViewallGuidePage } from '../pages/viewall-guide/viewall-guide';
import { BookGuidePage } from '../pages/book-guide/book-guide';
import { GuideviewPage } from '../pages/modals/guideview/guideview';
import { GuideviewPageModule } from '../pages/modals/guideview/guideview.module';
import { GuideConfirmPage } from '../pages/guide-confirm/guide-confirm';
import { ConfirmRequestPage } from '../pages/confirm-request/confirm-request';
import { TourConfirmPage } from '../pages/tour-confirm/tour-confirm';
import {GooglePlus} from '@ionic-native/google-plus';
import {Facebook} from '@ionic-native/facebook';
import {InAppBrowser} from '@ionic-native/in-app-browser'
import { Stripe } from '@ionic-native/stripe';
import {PayPal} from "@ionic-native/paypal";
//import {TwitterConnect} from '@ionic-native/twitter-connect'
/* import {AngularFireModule} from 'angularfire2'
import {AngularFireAuthModule} from 'angularfire2/auth' */
/*const agoraConfig: AgoraConfig = {
  AppID: '746f420dc65b4729982900e4a2b971b5',
};*/

/* var config = {
  apiKey: "AIzaSyC7PwalaGg-e6n946xk8-0YAu31sRKxxn4",
  authDomain: "cleverbreak-222407.firebaseapp.com",
  databaseURL: "https://cleverbreak-222407.firebaseio.com",
  projectId: "cleverbreak-222407",
  storageBucket: "cleverbreak-222407.appspot.com",
  messagingSenderId: "96642135408"
}; */

@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    HomePage,
    ListPage,
    LoginPage,
    MainPage,
    GuidesPage,
    ToursPage,
    TripsPage,
    MessagePage,
    ProfilePage,
    StringcutPipe,
    timeStringPipe,
    BookingPage,
    MyRequestPage,
    PersonalInformationPage,
    GuideInformationPage,
    AccountSettingsPage,
    PaymentMethodsPage,
    NewCardPage,
    PaypalPage,
    IbanPage,
    NewPaymentMethodPage,
    ImageSlidePage,
    ViewallReviewsPage,
    ViewallTourPage,
    BookPage,
    ManageBookingPage,
    PostRequestPage,
    BookingDetailPage,
    EditRequestPage,
    GuideReviewsPage,
    ViewallGuidePage,
    BookGuidePage,
    GuideConfirmPage,
    ConfirmRequestPage,
    TourConfirmPage,
    VideoPlayerPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
     
      backButtonText: ' '
    }),
    /* AngularFireAuthModule,
    AngularFireModule.initializeApp(config), */
    //AngularAgoraRtcModule.forRoot(agoraConfig),
    CalendarModule,
    MomentModule,
    MessageviewPageModule,
    GuideviewPageModule,
    TourviewPageModule,
    ionicGalleryModal.GalleryModalModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashPage,
    HomePage,
    ListPage,
    LoginPage,
    MainPage,
    GuidesPage,
    ToursPage,
    TripsPage,
    MessagePage,
    ProfilePage,
    BookingPage,
    MyRequestPage,
    PersonalInformationPage,
    GuideInformationPage,
    AccountSettingsPage,
    PaymentMethodsPage,
    NewCardPage,
    PaypalPage,
    IbanPage,
    NewPaymentMethodPage,
    ImageSlidePage,
    ViewallReviewsPage,
    ViewallTourPage,
    BookPage,
    ManageBookingPage,
    PostRequestPage,
    BookingDetailPage,
    EditRequestPage,
    GuideReviewsPage,
    ViewallGuidePage,
    BookGuidePage,
    GuideConfirmPage,
    ConfirmRequestPage,
    TourConfirmPage
  ],
  providers: [
    {
      provide: ErrorHandler, useClass: IonicErrorHandler
    },
    {
      provide: HAMMER_GESTURE_CONFIG, 
      useClass: ionicGalleryModal.GalleryModalHammerConfig
    },
    Stripe,
    Facebook,
    GooglePlus,
   // TwitterConnect,
    Diagnostic,
    CommonProvider,
    AppinfoProvider,
    VoicecallProvider,
    InAppBrowser,
    PayPal
  ]
})
export class AppModule {
}
