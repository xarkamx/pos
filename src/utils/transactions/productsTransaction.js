import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class ProductsTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.products = [];
  }

  async createProduct ({ name, price }) {
    this.products.push({ name, price });
    return this.products;
  }

  async getProducts () {
    return this.get('/products');
  }

  async addProduct (product) {
    return this.post('/products', product);
  }

  async deleteProduct (id) {
    return this.delete(`/products/${id}`);
  }

  async getProcessList () {
    return this.get('/process');
  }

  async addProcess (process) {
    return this.post('/process', process);
  }

  async updateProduct (id, product) {
    if (!product) {
      return false;
    }
    return this.put(`/products/${id}`, product);
  }

  async getProductInventoryList () {
    return this.get('/products/inventory');
  }

  async getProductInfo (id) {
    return this.get(`/products/${id}/info`);
  }
}