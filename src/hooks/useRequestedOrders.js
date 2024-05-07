

import { useState } from 'react';
import { useQuery } from 'react-query';
import { OrderTransaction } from '../utils/transactions/orderTransaction';

export function useRequestedOrders () {
  const query = useQuery('requestedOrders', () => {
    const orderTransaction = new OrderTransaction();
    return orderTransaction.getRequestedOrders();
  });


  return { orders: query.data ?? [], isLoading: query.isLoading };
}

export function useCheckoutOrder () {
  // if param order is given, load requested order

  const [orderId, setOrderId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  // create order mutation

  const addOrder = async (order) => {
    setIsLoading(true);
    const orderTransaction = new OrderTransaction();
    const orderId = await orderTransaction.createOrder(order);

    setIsLoading(false);
    setOrderId(orderId);
    return orderId;
  };
  // create requested order mutation

  const addRequestedOrder = (order) => {
    const orderTransaction = new OrderTransaction();
    const [nOrderId] = orderTransaction.createRequest(order, orderId);
    setOrderId(nOrderId);
    return nOrderId;
  };

  return {
    addOrder,
    addRequestedOrder,
    orderId,
    isLoading
  };
}