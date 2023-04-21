import { Grid } from '@mui/material';
import { useOrders } from '../../hooks/useOrders';
import { OrdersTable } from '../../sections/@dashboard/orders/OrdersTable';
import { ClientCard } from '../../sections/@dashboard/clients/ClientCard';

export default function SinglePageClient () {
  const { orders } = useOrders({ clientId: '1' });
  return (
    <Grid container>
      <Grid item xs={4}>
        <ClientCard
        />
      </Grid>
      <Grid item xs={8}>
        <OrdersTable orders={orders} />
      </Grid>
    </Grid>
  );
}