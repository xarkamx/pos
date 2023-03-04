
import { useMutation } from 'react-query';
import { OrderTransaction } from '../utils/transactions/orderTransaction';

export function useOrders () {
  const mutation = useMutation((order) => new OrderTransaction().createOrder(order)
  );
  return { createOrder: mutation.mutate, isLoading: mutation.isLoading, error: mutation.error, response: mutation.data }
}