
import { useMutation, useQuery } from 'react-query';
import { PaymentsTransaction } from '../utils/transactions/paymentsTransaction';
import { usePopUp } from '../context/PopUpContext';

export function usePayments () {
  const query = useQuery('payments', () => new PaymentsTransaction().getPayments());
  const { popUpAlert } = usePopUp();
  const mutation = useMutation((payment) => new PaymentsTransaction().addPayment(payment), {
    onSuccess: () => {
      popUpAlert('success', 'Movimiento registrado',);
      query.refetch();
    },
    onError: () => {
      popUpAlert('error', 'Error al registrar el movimiento');
    }
  });
  const del = useMutation((id) => new PaymentsTransaction().deletePayment(id), {
    onSuccess: () => {
      popUpAlert('success', 'Movimiento eliminado',);
      query.refetch();
    },
    onError: () => {
      popUpAlert('error', 'Error al eliminar el movimiento');
    },
  });
  return { payments: query.data, addPayment: mutation.mutate, deletePayment: del.mutate };
}