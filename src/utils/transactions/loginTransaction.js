import { config } from '../../config';

import { TransactionService } from './transactionService';

export class LoginTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    console.log('LoginTransaction', config.apis.bos);
  }

  async login (email, password) {
    return this.post('/auth', { email, password });
  }

}