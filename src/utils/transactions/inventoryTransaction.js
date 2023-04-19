import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class InventoryTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.products = [];
  }

  async addItem ({ id, qty, type }) {
    return this.post('/inventory', { external_id: id, quantity: qty, type });
  }

  async getItem () {
    return this.get('/inventory');
  }

  async deleteItem (id) {
    return this.delete(`/inventory/${id}`);
  }

  async updateItem (id, product) {
    if (!product) {
      return false;
    }
    return this.put(`/inventory/${id}`, product);
  }
}