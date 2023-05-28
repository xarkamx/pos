import { useQuery } from 'react-query';
import { InfoTransaction } from '../utils/transactions/infoTransaction';

export function useStats () {

  const service = new InfoTransaction();
  const summary = useQuery('summary', () => service.getSummary())

  const debtors = useQuery('debtors', () => service.getDebtors());

  const products = useQuery('products', () => service.getProductsPerformance());

  return {
    summary,
    debtors,
    products,
  }
}