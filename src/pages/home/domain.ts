'use strict';

/* Cryptrex domains */

export class CoinWatch {


    constructor(public coin: string, public market: string, public balance: number, public unitValue: number, public balanceBTC: number, public estUSD: number) {

    }

}