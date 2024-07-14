

import { useQuery } from 'react-query';
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { localeDate } from '../../../core/helpers';
import { translations } from '../../../utils/translations/translations';
import { OrderStatusCard, PrintTicket } from '../../OrderPage';
import { OrderTransaction } from '../../../utils/transactions/orderTransaction';
import { ItemsList } from '../../../sections/@dashboard/checkout/itemsList';

export default function ClientOrderPage () {
  const { orderId } = useParams();
  const { order, isLoading } = useClientOrder(orderId);
  if (isLoading) return <h1>Cargando...</h1>
  const formatOrder = order?.items.map((item) => ({
    id: item.productId,
    name: item.name,
    price: item.unitPrice,
    quantity: item.quantity,
    amount: item.total,
  }));
  const status = translations[order?.order.status] || '';
  const date = localeDate(order?.order.createdAt)
  const colors = {
    'pending': 'orange',
    'paid': 'green',
    'cancelled': 'red',
  }

  return (


    <Grid container spacing={3}>

      <Grid item xs={12} sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <h1
          style={{
            color: colors[order?.order.status],
          }}
        >Nota: {orderId} - {status}  {date} </h1>
      </Grid>
      <Grid item xs={12}>
        <OrderStatusCard
          discount={order?.order.discount}
          payment={order?.order.partialPayment}
          total={order?.order.total}
        />
      </Grid>

      <Grid item xs={12}>
        <PrintTicket orderId={orderId} products={
          formatOrder
        }
          order={order}
        />
      </Grid>

      <Grid item xs={12}>
        <ItemsList products={order?.items.map(item => ({
          id: item.productId,
          name: item.name,
          price: item.unitPrice,
          quantity: item.quantity,
          amount: item.total,
        }))} />
      </Grid>

    </Grid >
  )
};

function useClientOrder (id) {
  const service = new OrderTransaction();
  const request = useQuery(['clientOrder', id], () => service.getClientOrder(id));

  return {
    order: request.data,
    isLoading: request.isLoading,
  }
}