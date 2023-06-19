import { Card, CardHeader, Collapse, Grid, Button } from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
import { PaymentMethodSelect } from '../sections/@dashboard/payments/SelectPaymentMethod';


export default function OrderPage () {
  const { orderId } = useParams();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const { order, payments, isLoading, pay, del, update, checkIn, cancelBilling, onPaymentsCancel } = useOrder(orderId);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
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
  const total = order?.order.total - order?.order.partialPayment;
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
          <ConditionalWall condition={!order?.order.billed}>
            <Button color='error' onClick={() => {
              setOpenDeleteModal(true);
            }} startIcon={<DeleteForeverIcon />}>BORRAR</Button>
          </ConditionalWall>
        </Grid>
        <Grid item xs={12}>
          <OrderStatusCard
            discount={order?.order.discount}
            payment={order?.order.partialPayment}
            total={order?.order.total}
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
          <PaymentMethodSelect
            paymentMethod={paymentType || order?.order.paymentType}
            onChange={(ev) => {
              update({
                paymentType: ev.value
              })
              setPaymentType(ev.value);
            }}
          />
          <CollapsableTables payments={payments} products={formatOrder} onPaymentsCancel={() => {
            onPaymentsCancel(orderId);
          }} />
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
            <Button
              variant='standard'
              color='success'
              startIcon={<AttachMoneyIcon />}
              onClick={() => {
                if (isLoading) return;
                setOpenPaymentModal(true);
              }} sx={{
                color: 'green',
              }} fullWidth>Pagar</Button>

          </ConditionalWall>
        </Grid>
        <Grid item xs={4}>
          <BillingButton billingId={order.order.billed} orderId={orderId} onBilling={() => {
            if (isLoading) return;
            if (order.order.billed) {
              cancelBilling(order.order.billed);
            } else {
              checkIn(orderId);
            }
          }}
          />
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
        amount={total}
        clientId={order?.order.clientId}
        max={total}
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

function OrderStatusCard ({ discount, total, payment }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Total" total={<Money number={total} />} color="success" icon={'material-symbols:attach-money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Descuento" total={<Money number={discount} />} color="warning" icon={'material-symbols:money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Deuda" total={<Money number={total - payment} />} color="error" icon={'material-symbols:attach-money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Pagado" total={<Money number={payment} />} color="info" icon={'material-symbols:money'} />
      </Grid>
    </Grid>
  );
}

function CollapsableTables ({ payments, products, onPaymentsCancel }) {
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        margin: '1rem',
      }}>
        <CardHeader sx={headStyle} title="Pagos" onClick={() => (setOpen(false))} />
        <Button color='error' startIcon={<DeleteForeverIcon />} onClick={() => {
          onPaymentsCancel();
        }}>Cancelar Pago</Button>
      </div>
      <SimplePaymentsTable payments={payments || []} />
    </Card>
  </>)
}

function PrintTicket ({ orderId, products, order }) {

  const componentRef = useRef();
  if (!order.order) return (<></>)
  return (<div>
    <ReactToPrint
      trigger={() => <Button
        color='primary'
        startIcon={<LocalPrintshopIcon />}
        fullWidth>Imprimir</Button>}
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

