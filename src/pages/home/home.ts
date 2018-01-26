import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as bittrex from 'node-bittrex-api';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Refresher } from 'ionic-angular/components/refresher/refresher';
import { MarketSummary, CoinWatch, AccountBalance } from './domain';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private _observableList: BehaviorSubject<CoinWatch[]> = new BehaviorSubject([]);
  balanceBTC = 0.0;
  estUSD = 0.0;

  constructor(public navCtrl: NavController, private storage: Storage, public toastCtrl: ToastController) {

    this.storage.get('apiCredentials').then((val) => {
      if (val != null) {
        bittrex.options({
          'apikey': val.key,
          'apisecret': val.secret
        });

        this.updateBalance(null);
      }
    });
  }

  get observableList(): Observable<CoinWatch[]> { return this._observableList.asObservable() }

  updateBalance(refresher: Refresher) {

    let toast = this.toastCtrl.create({
      message: "error_message",
      position: 'bottom',
      duration: 3000
    });

    let coins = [];
    let bitcoins = 0.0;
    let dollars = 0.0;

    bittrex.getbalances((balanceData, error) => {

      if (error) {
        toast.setMessage(error.message).present();
      } else {

        bittrex.getmarketsummaries((marketData, error) => {

          if (error) {
            toast.setMessage(error.message).present();
          } else {

            let marketDataMap = new Map<string, MarketSummary>(marketData.result.map((i) => [i.MarketName, i]));

            dollars = marketDataMap.get("USDT-BTC").Last;

            balanceData.result.forEach((coin: AccountBalance) => {

              if (coin.Balance > 0) {

                let coinWatch: CoinWatch;

                if (coin.Currency === "BTC") {
                  bitcoins += coin.Balance;
                  coinWatch = new CoinWatch(coin.Currency, "USDT", coin.Balance, dollars, coin.Balance, coin.Balance * dollars);
                } else if (coin.Currency != "USDT") {
                  let unitValue = marketDataMap.get("BTC-" + coin.Currency).Last;
                  bitcoins += coin.Balance * unitValue;
                  coinWatch = new CoinWatch(coin.Currency, "BTC", coin.Balance, unitValue, coin.Balance * unitValue, coin.Balance * unitValue * dollars);
                } else if (coin.Currency === "USDT") {
                  let unitValue = 1 / dollars;
                  coinWatch = new CoinWatch(coin.Currency, "BTC", coin.Balance, unitValue, coin.Balance * unitValue, coin.Balance * unitValue * dollars);
                }

                coins.push(coinWatch);

              }
            });

            this.balanceBTC = bitcoins;
            this.estUSD = dollars * bitcoins;
            this._observableList.next(coins);
          }
        });


      }
    });

    if (refresher != null) {
      refresher.complete();
    }
  }

  doRefresh(refresher: Refresher) {
    setTimeout(() => this.updateBalance(refresher), 2000);
  }
}
