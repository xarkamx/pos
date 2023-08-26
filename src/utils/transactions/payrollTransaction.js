import { config } from '../../config';

const { TransactionService } = require('./transactionService');

export class PayrollTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
  }

  async create (payroll) {
    console.log(payroll);
    return this.post('/payroll', payroll);
  }

  async getPayroll () {
    return this.get('/payroll');
  }

  async pay (payroll) {
    return this.post('/payroll/pay', {
      payrollEmployees: payroll.map(pay => ({
        workedDays: pay.daysWorked,
        payrollId: pay.id
      }))
    });
  }
}