import { Card, Grid, List, ListItem, TextField, Typography, Button } from '@mui/material';
import { Container } from '@mui/system';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Money } from '../components/Formats/FormatNumbers';
import { useCState } from '../hooks/useHooks';
import { DiscountInput, ItemsList } from '../sections/@dashboard/checkout/itemsList';
import { ProductSearchInput } from '../sections/@dashboard/products/ProductSearchInput';


export default function CheckoutPage () {
  const { products, add, update, onDelete, total, subtotal, setDiscount } = useCheckout();

  return (
    <>
      <Helmet>
        <title> Caja | Punto de venta </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Caja chica
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ProductSearchInput onSubmit={add} />

          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <TextField label='RFC'
              defaultValue={'XAXX010101000'}
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
            <Card>
              <List>

                <ListItem>
                  <Typography variant="subtitle1" sx={{ mb: 1 }} color='orange'>
                    Subtotal: <Money number={subtotal} />
                  </Typography>
                </ListItem>
                <ListItem>
                  <DiscountInput onChange={(ev) => {
                    setDiscount(ev.val)
                  }} total={subtotal} />
                </ListItem>
                <hr />
                <ListItem>
                  <Typography variant="subtitle1" sx={{ mb: 1 }} color='darkseagreen'>
                    Total: <Money number={total} />
                  </Typography>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Button variant="contained" fullWidth>
                        Pago Total
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="contained" fullWidth color='warning'>
                        Pago Parcial
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

function useCheckout () {
  const [products, setProducts] = useCState({ items: [] });
  const [discount, setDiscount] = useState(0);
  const subtotal = products.items.reduce((acc, cur) => acc + cur.amount, 0);
  const total = subtotal - setDiscountToAbsoluteValue(discount, subtotal);

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
    setDiscount
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