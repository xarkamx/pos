import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class PaymentsTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.payments = [];
  }

  async getPayments () {
    return this.get('/payments');
  }
}