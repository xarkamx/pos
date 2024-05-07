import { Grid } from '@mui/material';
import { RequestedOrderTable } from '../sections/@dashboard/orders/OrdersTable';
import { useRequestedOrders } from '../hooks/useRequestedOrders';

export function PendingOrders () {
  const { orders } = useRequestedOrders();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <h1>Pedidos Pendientes</h1>
      </Grid>
      <Grid item xs={12}>
        <RequestedOrderTable
          orders={orders}
        />
      </Grid>
    </Grid>
  );
}