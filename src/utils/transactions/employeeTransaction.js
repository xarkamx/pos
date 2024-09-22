const { config } = require('../../config');
const { TransactionService } = require('./transactionService');

export class EmployeeTransaction extends TransactionService {
  constructor () {
    super(config.apis.bos);
  }

  async create (employee) {
    return this.post('/employees', employee);
  }

  async getEmployees () {
    return this.get('/employees');
  }

  async getEmployee (id) {
    return this.get(`/employees/${id}`);
  }

  async updateEmployee (employee) {
    return this.put(`/employees/${employee.id}`, employee);
  }

  async deleteEmployee (id) {
    return this.delete(`/employees/${id}`);
  }

  async getEmployeePTO (id) {
    return this.get(`/employees/${id}/pto`);
  }

  async createEmployeePTO ({
    employeeId,
    type,
    startDate,
    endDate,
  }) {
    return this.post(`/employees/${employeeId}/pto`, {
      ptoType: type,
      startDate,
      endDate,
    });
  }

  async setPTOStatus (id, status) {
    return this.put(`/employees/pto/${id}`, { status });
  }

  async getInfo (id) {
    return this.get(`/employees/${id}/info`);
  }
}