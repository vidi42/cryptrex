import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder } from "@angular/forms";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  api: any;
  apiCredentialsForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public formBuilder: FormBuilder, public toastCtrl: ToastController) {
    this.api = {};

    storage.get('apiCredentials').then((val) => {
      if(val == null) {
        this.api = {};
      } else {
        this.api = val;
      }
    });

    this.apiCredentialsForm = this.formBuilder.group({
      'apiKey': this.api.key,
      'apiSecret': this.api.secret
    });

    
  }

  onSubmit() {
    this.storage.set('apiCredentials', this.api);

    let toast = this.toastCtrl.create({
      message: 'API Credentials Saved',
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
}
