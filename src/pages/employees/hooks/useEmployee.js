
import { useState } from 'react';
import { useQuery } from 'react-query';
import { EmployeeTransaction } from '../../../utils/transactions/employeeTransaction';

export function useEmployee (id) {
  const employeeTransaction = new EmployeeTransaction();
  const [updateLoading, setUpdateLoading] = useState(false);
  const employeeDetails = useQuery('employee', async () => employeeTransaction.getEmployee(id));
  const info = useQuery('employeeInfo', async () => employeeTransaction.getInfo(id));

  const updateEmployee = async (employee) => {
    setUpdateLoading(true);
    await employeeTransaction.updateEmployee(employee);
    employeeDetails.refetch();
    setUpdateLoading(false);
  }

  return {
    employee: employeeDetails.data || {},
    isEmployeeLoading: employeeDetails.isLoading,
    info: info.data || {},
    updateEmployee,
    updateLoading
  }
}