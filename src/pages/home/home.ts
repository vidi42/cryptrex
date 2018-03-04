import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Refresher } from 'ionic-angular/components/refresher/refresher';
import { CoinWatch } from './domain';
import { BittrexService, AccountBalance } from './bittrex.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private _observableList: BehaviorSubject<CoinWatch[]> = new BehaviorSubject([]);
  balanceBTC = 0.0;
  estUSD = 0.0;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public bittrexService: BittrexService) {

  }

  ngOnInit() {
    this.updateBalance(null);
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

    this.bittrexService.getBalances().then(balanceReponse => {

      this.bittrexService.getMarketSummaries().then(marketSummaryResponse => {

        let marketSummaryMap = this.bittrexService.convertToMarketSummaryMap(marketSummaryResponse.result);

        dollars = marketSummaryMap.get("USDT-BTC").Last;

        balanceReponse.result.forEach((coin: AccountBalance) => {

          if (coin.Balance > 0) {

            let coinWatch: CoinWatch;

            if (coin.Currency === "BTC") {
              bitcoins += coin.Balance;
              coinWatch = new CoinWatch(coin.Currency, "USDT", coin.Balance, dollars, coin.Balance, coin.Balance * dollars);
            } else if (coin.Currency != "USDT") {
              let unitValue = marketSummaryMap.get("BTC-" + coin.Currency).Last;
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

        if (refresher != null) {
          refresher.complete();
        }

      }, error => {
        toast.setMessage(error.message).present();
        if (refresher != null) {
          refresher.complete();
        }
      });

    }, error => {
      toast.setMessage(error.message).present();
      if (refresher != null) {
        refresher.complete();
      }
    });
  }

  doRefresh(refresher: Refresher) {
    setTimeout(() => this.updateBalance(refresher), 2000);
  }
}
