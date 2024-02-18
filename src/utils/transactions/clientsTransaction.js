import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class ClientsTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.clients = [];
  }

  async getClients () {

    return this.get('/clients');
  }

  async addClient (client) {
    return this.post('/clients', client);
  }

  async getClientResume (id) {
    if (!id) return Promise.resolve({});
    return this.get(`/clients/${id}/resume`);
  }

  async getClient (id) {
    if (!id) return Promise.resolve({});
    const format = {
      rfc: '',
      name: '',
      email: '',
      phones: '',
      legal: false,
      postal_code: ''
    }
    const client = await this.get(`/clients/${id}`);

    return { ...format, ...client };
  }

  async updateClient (id, client) {
    return this.put(`/clients/${id}`, client);
  }

  async getClientPayments (id) {
    return this.get(`/clients/${id}/resume/payments`);
  }

  async getClientDebts (id) {
    return this.get(`/clients/${id}/debt`);
  }

  async payClientDebt (id, payment, method) {
    return this.post(`/clients/${id}/debt`, { amount: payment, paymentMethod: method });
  }
}