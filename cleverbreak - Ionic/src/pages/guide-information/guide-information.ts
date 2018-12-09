import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AppinfoProvider } from '../../providers/appinfo/appinfo';
import { ArrayType } from '@angular/compiler/src/output/output_ast';

/**
 * Generated class for the GuideInformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guide-information',
  templateUrl: 'guide-information.html',
})
export class GuideInformationPage {

  public isTour:boolean = false;
  public tour_price: any;
  public tour_free: boolean = false;
  public isVirtual:boolean = false;
  public virtual_price:any;
  public virtual_free:boolean = false;
  public location_covered: any;
  public experience: any;
  public languages: any;
  public customParagraphs: any;
  public paragraph_count: any = 0;
  public paragraph_titles = new Array<string>(8);
  public paragraph_contents = new Array<string>(8);
  public showFlag:any = [{'index':0,'show':true}, {'index':1, 'show':false}, {'index':2, 'show':false}, {'index':3, 'show':false}, {'index':4, 'show':false},{'index':5, 'show':false},{'index':6, 'show':false},{'index':7, 'show':false}];

  constructor(public platform: Platform ,public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, private http:HttpClient, private appInfo:AppinfoProvider, private alertCtrl:AlertController) {
    /*let backAction =  platform.registerBackButtonAction(() => {
       this.dismiss();
    },2); */
  }
  onClickSaveButton(){
    let para_titles = new Array<string>();
    let para_des = new Array<string>();
    var cnt = 0;
    for(var i = 0;i < 8;i ++){
      if(this.showFlag[i].show == true){
        para_titles[cnt] = (this.paragraph_titles[i]);
        para_des[cnt] = (this.paragraph_contents[i]);
        cnt ++;
      }
    }
    console.log(para_titles);
    if(this.tour_free == true)
      this.tour_price = 0;
    if(this.virtual_free == true)
      this.virtual_price = 0;
    const req = this.http.post(this.appInfo.common.urlproxy + 'api/update_guide', this.appInfo.addCsrfToken({
      priceForVirtualGuide: this.virtual_price, priceForTourGuide: this.tour_price, locations: this.location_covered, experience: this.experience, languages: this.languages, is_tour_guide:this.isTour, is_virtual_guide:this.isVirtual, yourmotto: this.experience, para_title: this.paragraph_titles, para_description: this.paragraph_contents
          }) )
      .subscribe(
        res => {
          if(res['status']){
            const alert = this.alertCtrl.create({
              title: 'Guide Information',
              subTitle: 'Update Success',
              buttons: ['OK']
            });
            alert.present();
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
  deleteParagraph(i){
    this.showFlag[i].show = false;
  }
  onClickAddParagraph(){
    this.paragraph_count ++;
    this.showFlag[this.paragraph_count].show = true;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GuideInformationPage');
  }
  
  dismiss() {
    this.dismiss();
  }
}
