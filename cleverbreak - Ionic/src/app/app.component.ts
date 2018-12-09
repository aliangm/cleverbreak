import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, NavController, App } from 'ionic-angular';

import { SplashPage } from '../pages/splash/splash';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { AppinfoProvider } from '../providers/appinfo/appinfo';

import { HttpClient } from '@angular/common/http';
import { MainPage } from '../pages/main/main';
import { TourviewPage } from '../pages/tourview/tourview';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = SplashPage;
  //rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;
  pagesFooter: Array<{title: string, component: any}>;
  csrfToken:any;


  constructor(public platform: Platform, modalCtrl: ModalController, public appInfo: AppinfoProvider, private http: HttpClient, app: App) {

    this.initializeApp(modalCtrl);

    platform.ready().then(() => {

    }) 

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Your cases', component: HomePage },
      { title: 'Payment', component: HomePage },
      { title: 'Settings', component: HomePage },
      { title: 'Help', component: HomePage }
    ];

    this.pagesFooter = [
      { title: 'Become a Lawyer with iJude', component: HomePage },
      { title: 'Legal', component: HomePage }
    ];

    /* this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          app.navPop();
      });
  }) */
  }

  initializeApp(modalCtrl: ModalController) {
    this.platform.ready().then(() => {
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
}
