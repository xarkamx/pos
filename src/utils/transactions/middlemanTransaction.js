import { TransactionService } from './transactionService';
import { config } from '../../config';

export class MiddlemanTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.middlemen = [];
  }

  async createMiddleman (middleman) {
    return this.post('/middleman', middleman);
  }

  async getMiddlemen () {
    return this.get(`/middleman`);
  }

  async addMyClient (clientDetails) {
    return this.post(`/middleman/me/clients`, clientDetails)
  }

  async getMyMiddlemanPayments () {
    return this.get(`/middleman/me/payments`)
  }

  async deleteMiddleman (middlemanId) {
    return this.delete(`/middleman/${middlemanId}`);
  }

  async getMiddleman (middlemanId) {
    return this.get(`/middleman/${middlemanId}`);
  }

  async getMiddlemanOrders (middlemanId) {
    return this.get(`/middleman/${middlemanId}/orders`);
  }

  async getMyMiddlemanClients () {
    return this.get(`/middleman/me/clients`)
  }

  async sendPayment (middlemanId, payment) {
    return this.post(`/middleman/${middlemanId}/paid`, { amount: payment })
  }
}