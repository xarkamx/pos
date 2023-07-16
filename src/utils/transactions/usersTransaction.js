import { config } from '../../config';
import { TransactionService } from './transactionService';

export class UsersTransactions extends TransactionService {
  constructor () {
    super(config.apis.bos);
    this.users = [];
  }

  async getUsers () {
    return this.get('/users');
  }

  async addUser (user) {
    return this.post('/users', user);
  }

  async changeMyPassword (password) {
    return this.post('/users/me/password', { password });
  }
}