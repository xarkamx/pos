

import { useState } from 'react';
import { useQuery } from 'react-query';
import { OrderTransaction } from '../utils/transactions/orderTransaction';
import { usePopUp } from '../context/PopUpContext';

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
  const { popUpAlert } = usePopUp();

  // create order mutation

  const addOrder = async (order) => {
    setIsLoading(true);
    const orderTransaction = new OrderTransaction();
    const { orderId } = (await orderTransaction.createOrder(order)).data;

    setIsLoading(false);
    if (!orderId) {
      popUpAlert('error', 'Error en registro de orden');
      return 0;
    }
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

  const clearOrder = () => {
    setOrderId(0);
  };

  return {
    addOrder,
    addRequestedOrder,
    orderId,
    isLoading,
    clearOrder
  };
}