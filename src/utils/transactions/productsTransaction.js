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
}