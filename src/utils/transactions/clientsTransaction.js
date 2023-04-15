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
    client.phones = client.phones.split(',');
    return this.post('/clients', client);
  }

  async getClientResume (id) {
    if (!id) return Promise.resolve({});
    return this.get(`/clients/${id}/resume`);
  }

  async updateClient (id, client) {
    return this.put(`/clients/${id}`, client);
  }
}