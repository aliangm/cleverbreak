import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modals',
  templateUrl: 'modals_pricerange.html',
})
export class ModalPriceRange {

  data:any;
  submit_errors = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController) {
    let range = navParams.get('range');
    this.data = {
      min: range.min,
      max: range.max
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalsPage');
  }

  apply() {
    if(!isNaN(this.data.min)){
      this.data.min = parseInt(this.data.min);
    }else {
      this.data.min = null;
    }
    if(!isNaN(this.data.max)){
      this.data.max = parseInt(this.data.max);
    }else {
      this.data.max = null;
    }

    if(this.data.max <= this.data.min){
      this.submit_errors = ["max price must be larger that min"];
    }else{
      this.viewCtrl.dismiss(this.data);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
