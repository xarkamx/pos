
import { useParams } from 'react-router-dom';
import { Autocomplete, Box, Button, Chip, Grid, ListItem, ListItemText, TextField, Typography } from '@mui/material';

import { useState } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import { Money } from '../../../components/Formats/FormatNumbers';
import { useClient } from '../../../hooks/useClients';
import { OrderTransaction } from '../../../utils/transactions/orderTransaction';
import { CustomTable } from '../../../components/tables/Table';
import { useBilling } from '../../../hooks/useBilling';

export function BillingPage () {
  const { clientId } = useParams()
  const { client } = useClient(clientId)
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { bill } = useBilling()
  const validation = [client?.rfc, client?.email, client?.postal_code]
  if (!validation.every(item => item)) {
    return <h1>Completa los datos del cliente</h1>
  }
  return (
    <Box sx={{ width: '80%', margin: "0 auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <h1>Facturar a {client.name}</h1>

        </Grid>



        <Grid item xs={12} md={12}>
          <OrderSelector clientId={clientId} onChange={async (orders) => {
            setLoading(true)
            setItems(await getProducts(orders.map(order => order.id)))
            setOrders(orders)
            setLoading(false)
          }} />
        </Grid>
        <Grid item xs={12} md={12}>
          <ProductsList products={items} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h4"><Money number={items.reduce((acc, item) => acc + item.total, 0)} /></Typography>
          <Button
            variant="contained"
            color="primary" fullWidth
            onClick={async () => {
              bill(orders, clientId)
            }}
            disabled={loading}>{loading ? 'Cargando...' : 'Facturar'}</Button>
        </Grid>
      </Grid>
    </Box>
  )
}


function OrderSelector ({ clientId, onChange }) {
  const { orders } = useOrders()
  const [value, setValue] = useState([])
  const filtered = orders?.filter(order => parseInt(order.clientId, 10) === parseInt(clientId, 10) && !order.billed)
  return <Autocomplete
    options={filtered || []}
    multiple
    value={value}
    getOptionLabel={(option) => `Nota # ${option.id}`}
    renderInput={(params) => <TextField {...params} label="Notas de venta" />}
    renderOption={(props, option) => <Option {...props} {...option} />}
    onChange={(event, newValue) => {
      setValue(newValue)
      onChange(newValue)
    }}
  />
}

function Option ({ id, total, status, ...props }) {
  status = status === 'paid' ? 'Pagado' : 'Pendiente'
  const color = status === 'Pagado' ? 'success' : 'warning'
  return (
    <ListItem {...props}>
      <ListItemText primary={`Nota # ${id}`} secondary={<Money number={total} />} />
      <Chip color={color} label={status} />
    </ListItem>
  )
}

function ProductsList ({ products = [] }) {

  return <CustomTable content={products} titles={['Cantidad', 'Nombre', 'Unitario', 'Total']}
    format={(product) => ([
      product.quantity,
      product.name,
      <Money number={product.unitPrice} key={`price-${product.id}`} />,
      <Money number={product.total} key={`total-${product.id}`} />,
    ])} />

}

async function getProducts (orderIds) {
  const service = new OrderTransaction()
  const orders = await Promise.all(orderIds.map(orderId => service.getOrder(orderId)))
  return orders.map(order => order.items).flat()
}