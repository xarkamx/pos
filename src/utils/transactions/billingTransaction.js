import { config } from '../../config';
import { TransactionService } from './transactionService';

export class BillingTransactions extends TransactionService {
  constructor () {
    super(config.apis.bos);
  }

  async customBilling ({
    orgTaxSystem,
    paymentForm,
    paymentMethod,
    customerId,
    use,
    products,
  }) {
    return this.post('/billing/custom',
      {
        orgTaxSystem,
        paymentForm,
        paymentMethod,
        customerId,
        use,
        products,
      }
    );
  }
}