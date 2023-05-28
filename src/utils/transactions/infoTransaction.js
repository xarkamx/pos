import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class InfoTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
  }


  async getSummary () {
    return this.get('/info');
  }

  async getDebtors () {
    return this.get('/info/debtors');
  }

  async getProductsPerformance () {
    return this.get('/info/products');
  }

}