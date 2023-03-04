import { Grid, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOrders } from '../hooks/useOrders';
import { useCState } from '../hooks/useHooks';
import { ItemsList } from '../sections/@dashboard/checkout/itemsList';
import { ProductSearchInput } from '../sections/@dashboard/products/ProductSearchInput';
import { PaymentForm } from '../sections/@dashboard/checkout/paymentForm';
import { StatusModal } from '../components/CustomModal/StatusModal';


export default function CheckoutPage () {
  const { products,
    add,
    update,
    onDelete,
    total,
    subtotal,
    setDiscount,
    error,
    send, isLoading } = useCheckout();
  const [rfc, setRfc] = useState('XAXX010101000');
  const [open, setOpen] = useState(false);
  const submitable = products.length > 0 && !isLoading;
  return (
    <>
      <Helmet>
        <title> Caja | Punto de venta </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Caja
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProductSearchInput onSubmit={add} />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <TextField label='RFC'
              value={rfc}
              onChange={(ev) => {
                setRfc(ev.target.value)
              }}
              style={
                {
                  width: '100%'
                }
              } />
            <ItemsList
              products={products}
              onDeleteProduct={onDelete}
              onEditQuantity={update} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PaymentForm
              subtotal={subtotal}
              total={total}
              rfc={rfc}
              send={(_id, payment) => {
                send(rfc, payment)
                setOpen(true)
              }}
              onDiscount={setDiscount}
              submitable={submitable}
            />
          </Grid>
        </Grid>
      </Container>
      <StatusModal open={open}
        onClose={() => {
          setOpen(false);
        }}
        message={error ? "Error en registro" : "Completada"} status={error ? "error" : "success"} />
    </>
  );
};

function useCheckout () {
  const [products, setProducts] = useCState({ items: [] });
  const [discount, setDiscount] = useState(0);
  const { createOrder, isLoading, response, error } = useOrders();
  const subtotal = products.items.reduce((acc, cur) => acc + cur.amount, 0);
  const fullDiscount = setDiscountToAbsoluteValue(discount, subtotal)
  const total = subtotal - fullDiscount;

  const clear = () => {
    setProducts({ items: [] });
    setDiscount(0);
  };
  const onDelete = (id) => {
    const prod = products.items
    const index = prod.findIndex((product) => product.id === id);
    if (index !== -1) {
      prod.splice(index, 1);
    }
    setProducts({ items: prod });
  }
  const update = (id, quantity) => {

    const prod = products.items
    const index = prod.findIndex((product) => product.id === id);
    if (index !== -1) {
      prod[index].quantity = quantity;
      prod[index].amount = prod[index].price * quantity;
    }
    if (quantity <= 0 || Number.isNaN(-quantity)) return onDelete(id);
    setProducts({ items: prod });
    return prod;
  }
  return {
    products: products.items,
    add: (values) => {
      const prod = products.items
      const index = prod.findIndex((product) => product.id === values.id);
      if (index !== -1) {
        prod[index].quantity += values.quantity;
        prod[index].amount += values.price * values.quantity;
      }
      else {
        prod.push(values);
      }
      setProducts({ items: prod });
    },
    update,
    onDelete,
    total,
    subtotal,
    setDiscount,
    isLoading,
    response,
    error,
    send: (rfc, payment) => {
      createOrder({
        rfc,
        discount: fullDiscount,
        partialPayment: payment || total,
        items: products.items.map(({ id, quantity }) => ({ productId: id, quantity }))
      })
      clear()
    },
    clear
  }
}

function setDiscountToAbsoluteValue (discount, subtotal) {
  discount = discount || 0;
  let percentage = 0;
  if (Number.isNaN(-discount)) {
    discount = discount.replace(/%/, '')
    percentage = (discount / 100)
    discount = subtotal * percentage;
  }
  return discount;
}