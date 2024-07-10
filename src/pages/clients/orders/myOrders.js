import { useQuery } from 'react-query';
import { OrderTransaction } from '../../../utils/transactions/orderTransaction';
import { OrdersTable } from '../../../sections/@dashboard/orders/OrdersTable';

export function MyOrders () {
  const data = useMyOrders();

  console.log(data);
  return (
    <OrdersTable orders={data} />
  )
}

function useMyOrders () {
  const transaction = new OrderTransaction();
  const orders = useQuery('myOrders', async () => {
    return transaction.getMyOrders();
  });

  return orders.data;

}