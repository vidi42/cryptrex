import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { BittrexService } from './bittrex.service';
import { Storage } from '@ionic/storage';

export const BITTREX_INITIALIZER: FactoryProvider = {
  provide: APP_INITIALIZER,
  useFactory: initBittrexCredentials,
  deps: [BittrexService, Storage],
  multi: true // flag needed in order to allow multiple initializers
};

export function initBittrexCredentials(bittrexService: BittrexService, storage: Storage) {
  return () => storage.get('apiCredentials').then((val) => {
    if (val != null) {
      bittrexService.init(val.key, val.secret);
    }
  });
}
