
import { useQuery } from 'react-query';
import { PaymentsTransaction } from '../utils/transactions/paymentsTransaction';

export function usePayments () {
  const query = useQuery('payments', () => new PaymentsTransaction().getPayments());
  return { payments: query.data }
}