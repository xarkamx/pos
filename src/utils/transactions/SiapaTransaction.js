import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class SiapaTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
  }


  async getSiapaBills () {
    return this.get('/info/siapa');
  }


}