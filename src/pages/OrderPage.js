import { Card, CardHeader, Collapse, Grid, Button } from '@mui/material';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { ConditionalWall } from '../components/FilterWall/ConditionalWall';
import { localeDate } from '../core/helpers';
import { useOrder } from '../hooks/useOrders';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import { ItemsList } from '../sections/@dashboard/checkout/itemsList';
import { ClientCard } from '../sections/@dashboard/clients/ClientCard';
import { PaymentModal } from '../sections/@dashboard/orders/paymentModal';
import { Ticket } from '../sections/@dashboard/orders/Ticket';
import { SimplePaymentsTable } from '../sections/@dashboard/payments/PaymentsTable';



export default function OrderPage () {
  const { orderId } = useParams();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const { order, payments, isLoading, pay } = useOrder(orderId);
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
    <>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1
            style={{
              color: colors[order?.order.status],
            }}
          >Orden: {orderId} - {status}  {date} </h1>
        </Grid>
        <Grid item xs={12}>
          <OrderStatusCard
            discount={order?.order.discount}
            total={order?.order.total}
            payment={order?.order.partialPayment}
            subtotal={order?.order.subtotal}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ClientCard
            rfc={order?.order.rfc}
            name={order?.order.clientName}
            email={order?.order.email}
            phones={order?.order.phones}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <CollapsableTables payments={payments} products={formatOrder} />
        </Grid>
        <Grid item xs={6}>
          <PrintTicket orderId={orderId} products={
            formatOrder
          }
            order={order}
          />
        </Grid>
        <ConditionalWall condition={order?.order.status === 'pending'}>
          <Grid item xs={6}>
            <Button variant='contained' color='success' onClick={() => {
              setOpenPaymentModal(true);
            }} sx={{
              color: 'white',
            }} fullWidth>Pagar</Button>
          </Grid>
        </ConditionalWall>
      </Grid>


      <PaymentModal
        open={openPaymentModal}
        amount={order?.order.total - order?.order.partialPayment}
        clientId={order?.order.clientId}
        max={order?.order.total}
        onPay={(clientId, amount, paymentMethod) => {
          pay({ orderId, clientId, payment: amount, paymentMethod })
          setOpenPaymentModal(false);
        }}
        onClose={() => {
          setOpenPaymentModal(false);
        }}
      />
    </>
  )
};

function OrderStatusCard ({ discount, total, payment, subtotal }) {

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Total" total={total} color="success" icon={'material-symbols:attach-money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Descuento" total={discount} color="warning" icon={'material-symbols:money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Subtotal" total={subtotal} icon={'material-symbols:attach-money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Pagado" total={payment} color="info" icon={'material-symbols:money'} />
      </Grid>
    </Grid>
  );
}

function CollapsableTables ({ payments, products }) {
  const [open, setOpen] = useState(false);
  const style = {
    marginBottom: '1rem',
  }
  const headStyle = {
    cursor: 'pointer',
    padding: '1rem',
  }
  return (<>
    <Card sx={style}>
      <CardHeader sx={headStyle} title="Productos" onClick={() => (setOpen(true))} />
      <Collapse in={open} timeout="auto" unmountOnExit >
        <ItemsList products={products || []} />
      </Collapse>
    </Card>
    <Card sx={style}>
      <CardHeader sx={headStyle} title="Pagos" onClick={() => (setOpen(false))} />
      <Collapse in={!open} timeout="auto" unmountOnExit >
        <SimplePaymentsTable payments={payments || []} />
      </Collapse>
    </Card>
  </>)
}

function PrintTicket ({ orderId, products, order }) {

  const componentRef = useRef();
  if (!order.order) return (<></>)
  return (<div>
    <ReactToPrint
      trigger={() => <Button variant='contained' color='primary' fullWidth>Imprimir</Button>}
      content={() => componentRef.current}
    />
    <div style={{
      display: 'none',
    }}>
      <Ticket
        clientId={order?.order.clientId}
        ref={componentRef}
        orderId={orderId}
        products={products}
        discount={order?.order.discount}
        subtotal={order?.order.subtotal}
        total={order?.order.total}
        payment={order?.order.partialPayment} />
    </div>
  </div>
  )
}
const translations = {
  'pending': 'Pendiente',
  'paid': 'Pagada',
  'cancelled': 'Cancelada',
}

