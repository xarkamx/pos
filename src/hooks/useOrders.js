

import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { OrderTransaction } from '../utils/transactions/orderTransaction';
import { usePopUp } from '../context/PopUpContext';

export function useOrders (queryString = {}) {
  const { popUpAlert } = usePopUp();
  const query = useQuery('orders', () => new OrderTransaction().getOrders(queryString));
  const mutation = useMutation((order) => new OrderTransaction().createOrder(order));
  const update = useMutation((payment) => new OrderTransaction().pay(payment), {
    onSuccess: () => {
      query.refetch();
    },
  });

  const checkIn = useMutation((orderId) => new OrderTransaction().checkIn(orderId), {
    onSuccess: () => {
      query.refetch();
    },
    onError: () => {
      popUpAlert('error', 'Error al facturar');

    },
  });

  return {
    createOrder: mutation.mutate,
    isLoading: mutation.isLoading || query.isLoading || update.isLoading || checkIn.isLoading,
    error: mutation.error,
    response: mutation.data,
    orders: query.data,
    pay: update.mutate,
    checkIn: checkIn.mutate,
  }
}

export function useOrder (orderId) {
  const navigate = useNavigate();
  const { popUpAlert } = usePopUp();
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

  const del = useMutation((orderId) => new OrderTransaction().deleteOrder(orderId), {
    onSuccess: () => {
      navigate('/dashboard/ordenes');
    },
  });

  const updateOrder = useMutation((order) => new OrderTransaction().updateOrder(orderId, order), {
    onSuccess: () => {
      query.refetch();
    },
  });


  const checkIn = useMutation((orderId) => new OrderTransaction().checkIn(orderId), {
    onSuccess: () => {
      query.refetch();
    },
    onError: () => {
      popUpAlert('error', 'Error al facturar');

    }
  });
  const [order, payments] = query.data || [];
  return {
    isLoading: query.isLoading,
    error: query.error,
    order,
    payments,
    pay: pay.mutate,
    del: del.mutate,
    update: updateOrder.mutate,
    checkIn: checkIn.mutate,
  }
}

