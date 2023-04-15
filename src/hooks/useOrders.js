
import { useMutation, useQuery } from 'react-query';
import { OrderTransaction } from '../utils/transactions/orderTransaction';

export function useOrders () {

  const query = useQuery('orders', () => new OrderTransaction().getOrders());
  const mutation = useMutation((order) => new OrderTransaction().createOrder(order));
  const update = useMutation((payment) => new OrderTransaction().pay(payment), {
    onSuccess: () => {
      query.refetch();
    },
  });

  return {
    createOrder: mutation.mutate,
    isLoading: mutation.isLoading || query.isLoading || update.isLoading,
    error: mutation.error,
    response: mutation.data,
    orders: query.data,
    pay: update.mutate,
  }
}

export function useOrder (orderId) {
  const query = useQuery(['order', orderId], () => {
    const orderTransaction = new OrderTransaction();
    const prom = [
      orderTransaction.getOrder(orderId),
      orderTransaction.getOrderPayments(orderId),
    ]
    return Promise.all(prom);
  });
  const pay = useMutation((payment) => new OrderTransaction().pay(payment), {
    onSuccess: () => {
      query.refetch();
    },
  });
  const [order, payments] = query.data || [];
  return {
    isLoading: query.isLoading,
    error: query.error,
    order,
    payments,
    pay: pay.mutate,
  }
}
