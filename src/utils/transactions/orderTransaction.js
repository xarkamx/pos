import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class OrderTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.products = [];
  }

  async createOrder ({ rfc, products, discount, partialPayment, paymentType, items }) {
    return this.post('/orders', { rfc, products, discount, partialPayment, paymentType, items });
  }

  async getOrders () {
    return this.get('/orders');
  }
}