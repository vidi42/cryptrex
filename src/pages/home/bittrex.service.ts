import { Injectable } from '@angular/core';
import * as bittrex from 'node-bittrex-api';

@Injectable()
export class BittrexService {

    
    constructor() {

    }

    init(apiKey: String, apiSecret: String) {
        
        bittrex.options({
            'apikey': apiKey,
            'apisecret': apiSecret
        });
    }

    getBalances(): Promise<APIResponse<AccountBalance>> {

        let promise: Promise<APIResponse<AccountBalance>> = new Promise(function (resolve, reject) {
            bittrex.getbalances((success, error) => {
                if (error != null) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });

        return promise;
    }

    getMarketSummaries(): Promise<APIResponse<MarketSummary>> {

        let promise: Promise<APIResponse<MarketSummary>> = new Promise(function (resolve, reject) {
            bittrex.getmarketsummaries((success, error) => {
                if (error != null) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });

        return promise;

    }

    convertToMarketSummaryMap(marketSummaries: Array<MarketSummary>): Map<string, MarketSummary> {
        let marketSummaryMap: Map<string, MarketSummary> = new Map();

        marketSummaries.forEach(m => {
            marketSummaryMap.set(m.MarketName, m);
        })

        return marketSummaryMap;
    }


}

export class APIResponse<T> {

    success: boolean;
    message: string;
    result: Array<T>;

}

export class MarketSummary {

    MarketName: string;
    Last: number;

}

export class AccountBalance {
    Currency: string;
    Balance: number;

}