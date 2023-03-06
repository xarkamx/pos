
import { useMutation, useQuery } from 'react-query';
import { PaymentsTransaction } from '../utils/transactions/paymentsTransaction';

export function usePayments () {
  const query = useQuery('payments', () => new PaymentsTransaction().getPayments());
  const mutation = useMutation((payment) => new PaymentsTransaction().addPayment(payment), {
    onSuccess: () => {
      query.refetch();
    }
  });
  return { payments: query.data, addPayment: mutation.mutate }
}