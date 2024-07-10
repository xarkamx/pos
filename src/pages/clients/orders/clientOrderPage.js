
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useOrder } from '../../../hooks/useOrders';
import { localeDate } from '../../../core/helpers';
import { translations } from '../../../utils/translations/translations';
import { CollapsableTables, OrderStatusCard, PrintTicket } from '../../OrderPage';

export default function ClientOrderPage () {
  const { orderId } = useParams();
  const { order, payments, isLoading } = useOrder(orderId);
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

        <CollapsableTables payments={payments} products={formatOrder} />
      </Grid>

    </Grid >
  )
};