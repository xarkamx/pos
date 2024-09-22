
import { useState } from 'react';
import { useQuery } from 'react-query';
import { EmployeeTransaction } from '../../../utils/transactions/employeeTransaction';
import { usePopUp } from '../../../context/PopUpContext';

export function usePTO (employeeId) {
  const transaction = new EmployeeTransaction();
  const { popUpAlert } = usePopUp();
  const [requestLoading, setLoading] = useState(false)
  const ptos = useQuery('ptos', async () => transaction.getEmployeePTO(employeeId))
  const changeStatus = async (id, status) => {
    try {
      await transaction.setPTOStatus(id, status)
    } catch (e) {
      popUpAlert('error', 'No se pudo cambiar el estado del PTO')
    }
    ptos.refetch()
  }

  return {
    req: ptos.data || [],
    createPTO: async (pto) => {
      setLoading(true)
      try {
        await transaction.createEmployeePTO({ ...pto, employeeId })
        popUpAlert('success', 'PTO creado')
      } catch (e) {
        popUpAlert('error', 'No se pudo crear el PTO')
      }
      setLoading(false)
      ptos.refetch()
    },
    changeStatus,
    requestLoading
  };

}