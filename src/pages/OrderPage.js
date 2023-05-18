import { Card, CardHeader, Collapse, Grid, Button } from '@mui/material';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
import { DangerModal } from '../components/CustomModal/ConfirmModal';
import { ClientsSearchInput } from '../sections/@dashboard/clients/SelectClient';
import { Money } from '../components/Formats/FormatNumbers';
import { BillingButton } from './orders/billingButton';


export default function OrderPage () {
  const { orderId } = useParams();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const { order, payments, isLoading, pay, del, update, checkIn } = useOrder(orderId);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
        <Grid item xs={12} sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <h1
            style={{
              color: colors[order?.order.status],
            }}
          >Nota: {orderId} - {status}  {date} </h1>
          <Button color='error' onClick={() => {
            setOpenDeleteModal(true);
          }} startIcon={<DeleteForeverIcon />}>BORRAR</Button>
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
          <ClientsSearchInput onSubmit={(ev) => {
            update({
              clientId: ev.id
            })
          }} />
          <ClientCard
            id={order?.order.clientId}
            rfc={order?.order.rfc}
            name={order?.order.clientName}
            email={order?.order.email}
            phones={order?.order.phones}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <CollapsableTables payments={payments} products={formatOrder} />
        </Grid>
        <Grid item xs={4}>
          <PrintTicket orderId={orderId} products={
            formatOrder
          }
            order={order}
          />
        </Grid>
        <Grid item xs={4}>

          <ConditionalWall condition={order?.order.status === 'pending'}>
            <Button variant='contained' color='success' onClick={() => {
              if (isLoading) return;
              setOpenPaymentModal(true);
            }} sx={{
              color: 'white',
            }} fullWidth>Pagar</Button>

          </ConditionalWall>
        </Grid>
        <Grid item xs={4}>
          <BillingButton billingId={order.order.billed} orderId={orderId} onBilling={() => {
            if (isLoading) return;
            checkIn(orderId);
          }} />
        </Grid>
        <DangerModal open={openDeleteModal}
          condition={(val) => val === orderId}
          onClose={() => {
            setOpenDeleteModal(false);
          }}
          onConfirm={() => {
            setOpenDeleteModal(false);
            del(orderId);
          }}
          message={"Para eliminar la nota ingresa el folio de la misma en el siguiente campo"} />
      </Grid >


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
        <AppWidgetSummary title="Total" total={<Money number={total} />} color="success" icon={'material-symbols:attach-money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Descuento" total={<Money number={discount} />} color="warning" icon={'material-symbols:money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Subtotal" total={<Money number={subtotal} />} icon={'material-symbols:attach-money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Pagado" total={<Money number={payment} />} color="info" icon={'material-symbols:money'} />
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

