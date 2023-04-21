import { config } from '../../config';
import { isObjectEmpty } from '../../core/helpers';

const { TransactionService } = require('./transactionService');

export class OrderTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.products = [];
  }

  async createOrder ({ clientId, products, discount, partialPayment, paymentType, items }) {
    return this.post('/orders', { clientId, products, discount, partialPayment, paymentType, items });
  }

  async getOrders (query) {
    query = isObjectEmpty(query) ? '' : `?${new URLSearchParams(query).toString()}`;
    return this.get(`/orders${query}`);
  }

  async pay ({ orderId, payment, clientId, paymentMethod }) {
    return this.put(`/orders/${orderId}/payment`, { payment, paymentMethod, clientId })
  }

  async getOrder (orderId) {
    return this.get(`/orders/${orderId}`);
  }

  async getOrderPayments (orderId) {
    return this.get(`/orders/${orderId}/payments`);
  }
}