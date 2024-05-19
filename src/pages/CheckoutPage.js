import { Button, Grid, Typography } from '@mui/material';

import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { Container } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ItemsList } from '../sections/@dashboard/checkout/itemsList';
import { ProductSearchInput } from '../sections/@dashboard/products/ProductSearchInput';
import { PaymentForm } from '../sections/@dashboard/checkout/paymentForm';
import { StatusModal } from '../components/CustomModal/StatusModal';
import { ClientsSearchInput } from '../sections/@dashboard/clients/SelectClient';
import { Ticket } from '../sections/@dashboard/orders/Ticket';
import { ConditionalWall } from '../components/FilterWall/ConditionalWall';
import { CheckoutOngoingTicket } from '../sections/@dashboard/orders/onGoingTicket';
import { useCheckout } from '../hooks/useCheckout';
import { useHistory, useMountEffect, useQueryString } from '../hooks/useHooks';



export default function CheckoutPage () {
  const { products,
    add,
    update,
    onDelete,
    total,
    subtotal,
    setDiscount,
    error,
    send,
    isLoading,
    orderId,
    discount,
    clear
  } = useCheckout();
  const ref = useRef();
  const print = useReactToPrint({
    content: () => ref.current,
    onAfterPrint: () => {
      clear()
    }
  })
  const [clientId, setClientId] = useState(0);
  const param = useQueryString();
  const [payment, setPayment] = useState(0);
  const [open, setOpen] = useState(false);
  const [localId, setLocalId] = useState(param.localId ?? 0);
  const submitable = products.length > 0 && !isLoading;
  useMountEffect(() => {
    if (!localId) {
      setLocalId(`checkout-${new Date().getTime()}`)
    }
    const local = localStorage.getItem(localId);
    if (local) {
      const { products, discount, clientId, payment } = JSON.parse(local);
      setClientId(clientId);
      setPayment(payment);
      setDiscount(discount);
      products.forEach((product) => {
        add(product)
      })
    }
  });
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(localId, JSON.stringify({
        products,
        total,
        subtotal,
        discount,
        clientId,
        payment
      }))
    }
  }, [products, total, subtotal, discount, clientId, payment, localId]);
  const history = useHistory();
  return (
    <>
      <Helmet>
        <title> Caja | Punto de venta </title>
      </Helmet>

      <Container maxWidth="xl">

        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Caja
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={() => {
              history(`/dashboard/caja/historial`)
            }} variant="contained" >Historial</Button>
          </Grid>
          <Grid item xs={12}>
            <ProductSearchInput onSubmit={add} />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <PrintOnGoingTicket products={products} />
            <ItemsList
              products={products}
              onDeleteProduct={onDelete}
              onEditQuantity={update} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ClientsSearchInput onSubmit={(client) => {
              setClientId(client.id)
            }} />
            <PaymentForm
              subtotal={subtotal}
              total={total}
              clientId={clientId}
              send={(_id, payment, method) => {
                setPayment(payment)
                send(clientId, payment, method)
                setOpen(true)
              }}
              onDiscount={setDiscount}
              submitable={submitable}
            />
          </Grid>
        </Grid>
      </Container>
      <div style={{
        display: 'none',
      }}>
        <ConditionalWall condition={orderId && open} >
          <Ticket
            clientId={clientId}
            ref={ref}
            products={products}
            orderId={orderId}
            subtotal={subtotal}
            total={total}
            payment={payment}
            discount={discount}
          />
        </ConditionalWall>
      </div>

      <StatusModal open={open && orderId}
        onClose={() => {
          print();
          localStorage.removeItem(localId);
          setOpen(false);
        }}
        message={error ? "Error en registro" : "Completada"} status={error ? "error" : "success"} />
    </>
  );
};




function PrintOnGoingTicket ({ products }) {

  const componentRef = useRef();
  return (<div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '0.5rem'
  }}>
    <ReactToPrint
      trigger={() => <Button
        color='primary'
        startIcon={<LocalPrintshopIcon />}
      >Imprimir</Button>}
      content={() => componentRef.current}
    />
    <div style={{
      display: 'none',
    }}>
      <CheckoutOngoingTicket ref={componentRef} products={products} />
    </div>
  </div >
  )
}