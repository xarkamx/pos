
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { OrdersTable } from '../../sections/@dashboard/orders/OrdersTable';
import { OrderTransaction } from '../../utils/transactions/orderTransaction';

export function BilledOrders () {
  const { billingId } = useParams();
  const { orders } = useBilledOrders(billingId);
  return (
    <OrdersTable orders={orders} onStatusClick={() => {
      console.log('status clicked')
    }} />
  )
}

function useBilledOrders (billingId) {
  const orderService = new OrderTransaction();
  const resp = useQuery('billedOrders', async () => orderService.getOrdersByBill(billingId))
  return {
    orders: resp.data || [],
  }
}