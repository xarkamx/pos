import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { useCheckout } from '../../../hooks/useCheckout';
import { usePopUp } from '../../../context/PopUpContext';
import { ProductSearchInput } from '../../../sections/@dashboard/products/ProductSearchInput';
import { ItemsList } from '../../../sections/@dashboard/checkout/itemsList';
import { StatusModal } from '../../../components/CustomModal/StatusModal';
import { Money } from '../../../components/Formats/FormatNumbers';
import { OrderTransaction } from '../../../utils/transactions/orderTransaction';

export default function ClientCheckoutPage () {
  const { products,
    add,
    update,
    onDelete,
    error,
    clear,
    orderId
  } = useCheckout();
  const [open, setOpen] = useState(false);
  const { popUpAlert } = usePopUp()
  return (
    <>
      <Helmet>
        <title> Caja | Pedidos </title>
      </Helmet>

      <Container maxWidth="xl">

        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Caja
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ProductSearchInput onSubmit={add} />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>

            <ItemsList
              products={products}
              onDeleteProduct={onDelete}
              onEditQuantity={update} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RequestsOrderForm items={products} onSubmit={async () => {
              await sendRequestedOrder({ products })
              clear();
              popUpAlert('success', 'La orden ha sido registrada correctamente')
              setOpen(true);
            }} />
          </Grid>
        </Grid>
      </Container>

      <StatusModal open={open && orderId}
        onClose={() => {
          setOpen(false);
        }}
        message={error ? "Error en registro" : "Completada"} status={error ? "error" : "success"} />
    </>
  );
};


function RequestsOrderForm ({ items = [], onSubmit }) {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return <>
    <Card>
      <CardContent>
        <Money number={total} style={{
          marginBottom: '1rem',
          display: 'block',
          textAlign: 'center',
          fontSize: '1.5rem',
          color: 'green'
        }} />
      </CardContent>
    </Card>
    <Button variant='contained' disabled={items.length <= 0 && !total} fullWidth onClick={onSubmit}>Generar Pedido</Button>
  </>
}



function sendRequestedOrder (content) {
  return new OrderTransaction().requestOrder({
    items: content.products.map((product) => ({
      productId: product.id,
      quantity: product.quantity
    }))
  });
}