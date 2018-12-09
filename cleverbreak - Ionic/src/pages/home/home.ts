import { Component, ViewChild } from '@angular/core';
import { NavController, Events, ModalController ,NavParams, Platform} from 'ionic-angular';

import { MainPage } from '../main/main';
import { GuidesPage } from '../guides/guides';
import { TripsPage } from '../trips/trips';
import { MessagePage } from '../message/message';
import { ProfilePage } from '../profile/profile';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
 import { VoicecallProvider } from '../../providers/voicecall/voicecall'; 
import { Tabs } from 'ionic-angular/umd/navigation/nav-interfaces';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild("mainTabs") mainTabs: Tabs;
  tab1Main = MainPage;
  tab2Guides = GuidesPage;
  tab3Trips = TripsPage;
  tab4Message = MessagePage;
  tab5Profile = ProfilePage;
  
  constructor(public navCtrl: NavController, public appInfo: AppinfoProvider, public voice: VoicecallProvider, public evt: Events, public modalCtrl: ModalController,public platform: Platform) {
    
    
    //voiceCall config and event
    
     this.evt.subscribe('message:voicecall-incoming', (data) =>{
      var targerUserId = data['targetUserId'];

      var modalPage = this.modalCtrl.create('MessagecallvoicePage', {
        defaultAction: 'incoming-call',
        user_from: targerUserId,
        user_to: this.appInfo.common.userProfile.id,
        target_user: targerUserId
      });
      modalPage.onDidDismiss(data => {  
        // after close action
      });
      modalPage.present();
    });
    /* platform.registerBackButtonAction(() => {
       this.backButtonAction();
    }); */
  }
  backButtonAction(){
        this.platform.exitApp();
  }
  ionViewWillEnter() {
    if(this.appInfo.common.trips == true)
    {
      
      this.mainTabs.select(2, {}, false);
    }else
      this.mainTabs.select(0, {}, false);
  }
  onSelectTrips(){
    console.log("---------------trips---------------------");
  }
  onSelectMessage(){
    console.log("---------------Message---------------------");
  }
}
