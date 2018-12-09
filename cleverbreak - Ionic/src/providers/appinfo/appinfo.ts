import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';

/*
  Generated class for the AppinfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppinfoProvider {

  common: any;
  isVoiceModalOpened:boolean = false;
  showFooter:boolean = true;

  constructor(public http: HttpClient) {
    this.common = {
      name: 'Cleverbreak',
      url: 'http://cleverbreak-ionpan.c9users.io/',
      urlproxy: 'http://cleverbreak-ionpan.c9users.io/',  // For mobile production apk
      //urlproxy: '/proxy/', // For local test
      csrfToken: '',
      cards: [{}],
      mainData: {},
      wishlist: [{}],
      guide_wishlist: [{}],
      isLogedIn: false, 
      userProfile: null,
      trips: false,
      refresh: true,
      agora: {
        appId: '746f420dc65b4729982900e4a2b971b5',
        appCert: 'ff33cc637f3e42d38bf2bf88704b0484'
      }
    };
    
    this.loadInitialInformation();
  }

  public loadInitialInformation(){
    var data = this.getTokenFromServer({});
  }

  public async getTokenFromServer(data){
    let successData = await new Promise((resolve,reject)=>{
      console.log(this.common.urlproxy );
      console.log(this.common.urlproxy );
      console.log(this.common.urlproxy );
      console.log(this.common.urlproxy );
      console.log(this.common.urlproxy );
      let req = this.http.get(this.common.urlproxy + 'get_token')
      .subscribe(
        res => {
          this.common.csrfToken = res['token'];
          this.common.activities = res['activities'];
          this.common.agora.appId = res['agoraAppId'];
          this.common.agora.appCert = res['agoraAppCert'];
           resolve({
            token: res['token']
          });
        },
        err => {
          console.log(err);
            resolve({
            token: null
          });
        }
      );
    });
    return successData;
  }
  
  
  public addCsrfToken(data){
    data._token = this.common.csrfToken;
    return data;
  }

}
