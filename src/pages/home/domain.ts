'use strict';

/* Bittrex domains */

export class MarketSummary {

    MarketName: string;
    Last: number;

}

export class AccountBalance {
    Currency: string;
    Balance: number;

}

/* Cryptrex domains */

export class CoinWatch {


    constructor(public coin: string, public market: string, public balance: number, public unitValue: number, public balanceBTC: number, public estUSD: number) {

    }

}