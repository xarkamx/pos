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
}