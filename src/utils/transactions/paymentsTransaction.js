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

  async addPayment (payment) {
    return this.post('/payments', payment);
  }

  async deletePayment (id) {
    return this.delete(`/payments/${id}`);
  }
}