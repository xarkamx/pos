import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class OrderTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.products = [];
  }

  async createOrder ({ clientId, products, discount, partialPayment, paymentType, items }) {
    return this.post('/orders', { clientId, products, discount, partialPayment, paymentType, items });
  }

  async getOrders () {
    return this.get('/orders');
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