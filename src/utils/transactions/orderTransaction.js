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

  async checkIn (orderId) {
    return this.bill([orderId]);
  }

  async cancelBilling (billingId) {
    return this.delete(`/billing/${billingId}`, {
      motive: '03'
    });
  }

  async getAllBills (query) {
    return this.get(`/billing`, query);
  }

  async bill (orderIds) {
    return this.post(`/billing`, { orderIds });
  }

  async downloadBill (billingId) {
    return this.file(`/billing/${billingId}/download`);
  }

  async sendEmail (billingId) {
    return this.get(`/billing/${billingId}/send`);
  }

  async deleteOrder (orderId) {
    return this.delete(`/orders/${orderId}`);
  }

  async getOrder (orderId) {
    return this.get(`/orders/${orderId}`);
  }

  async getOrderPayments (orderId) {
    return this.get(`/orders/${orderId}/payments`);
  }

  async updateOrder (id, order) {
    return this.put(`/orders/${id}`, order);
  }
}