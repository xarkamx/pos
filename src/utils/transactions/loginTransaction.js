import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class LoginTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.products = [];
  }

  async login (email, password) {
    return this.post('/auth', { email, password });
  }

}