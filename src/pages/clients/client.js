
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, ListItem } from '@mui/material';
import { useOrders } from '../../hooks/useOrders';
import { QuickFormContainer } from '../../components/Containers/QuickFormContainer';
import { OrdersTable } from '../../sections/@dashboard/orders/OrdersTable';
import { useClient } from '../../hooks/useClients';
import { useCState } from '../../hooks/useHooks';
import { DebounceInput } from '../../components/Inputs/DebounceInput';
import { localeDate } from '../../core/helpers';
import { AppWidgetSummary } from '../../sections/@dashboard/app';
import { PaymentModal } from '../../sections/@dashboard/orders/paymentModal';
import { Money } from '../../components/Formats/FormatNumbers';
import { ConditionalWall } from '../../components/FilterWall/ConditionalWall';
import { TaxSystem } from '../../sections/@dashboard/clients/TaxSystemInput';

export default function SinglePageClient () {
  const { clientId } = useParams();
  const { orders, pay } = useOrders({ clientId });
  const { client, clientResume, setClient } = useClient(clientId);
  const navigate = useNavigate();
  if (!client || !clientResume) return null;
  const billable = [client.rfc, client.email, client.postal_code].every((item) => item)
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <h1>{client.name} (Ultima Compra - {localeDate(clientResume.latestPurchase)})</h1>
      </Grid>
      <Grid item xs={12}>
        <ClientCards
          {...clientResume}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ClientBasicForm
          rfc={client.rfc}
          name={client.name}
          email={client.email}
          phones={client.phones}
          legal={client.legal}
          postalCode={client.postal_code}
          taxSystem={client.tax_system}
          onItemChange={(item) => {
            setClient({ id: client.id, client: { ...item } })
          }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <ClientOrders orders={orders} pay={pay} />
      </Grid>
      <Grid item xs={12}>
        <ConditionalWall condition={billable}>
          <Button variant="contained" color="primary" onClick={() => {
            navigate(`/dashboard/clientes/${clientId}/factura`)
          }}>Facturar</Button>
        </ConditionalWall>
      </Grid>
    </Grid>
  );
}


function ClientBasicForm ({ rfc, name, email, phones, legal, postalCode, taxSystem, onItemChange }) {
  if (!Array.isArray(phones)) phones = [phones]
  const [vals, setVals] = useCState({ rfc, name, email, phones, legal, postalCode, taxSystem })

  return (
    <QuickFormContainer title={'Cliente'}>
      <QuickDebounceInput label='RFC' value={vals.rfc} onChange={(ev) => {
        setVals({ rfc: ev.target.value })
        onItemChange({ rfc: ev.target.value })
      }} />
      <QuickDebounceInput label='Nombre' value={vals.name} onChange={(ev) => {
        setVals({ name: ev.target.value })
        onItemChange({ name: ev.target.value })
      }} />
      <QuickDebounceInput label='Email' value={vals.email} onChange={(ev) => {
        setVals({ email: ev.target.value })
        onItemChange({ email: ev.target.value })
      }} />
      <QuickDebounceInput label='Teléfono' value={vals.phones?.join(',')} onChange={(ev) => {
        const phones = ev.target.value.split(',')
        setVals({ phones })
        onItemChange({ phones: JSON.stringify(phones) })
      }} />
      <QuickDebounceInput label='Código Postal' value={vals.postalCode || ''} onChange={(ev) => {
        setVals({ postalCode: ev.target.value })
        onItemChange({ postal_code: ev.target.value })
      }} />


      <TaxSystem
        value={vals.taxSystem}
        onChange={(item) => {
          setVals({ taxSystem: item.value })
          onItemChange({ tax_system: item.value })
        }}
      />
    </QuickFormContainer>
  )
}

function QuickDebounceInput (props) {
  return <ListItem>
    <DebounceInput {...props} variant='outlined' fullWidth />
  </ListItem>
}

function ClientCards ({ orders, pending, totalPaid, totalDebt }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Notas" total={orders} color="success" icon={'material-symbols:list-alt'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Pendientes" total={pending} color="warning" icon={'material-symbols:list-alt'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Total Pagado" total={<Money number={totalPaid} />} icon={'material-symbols:attach-money'} />
      </Grid>
      <Grid item xs={12} md={3}>
        <AppWidgetSummary title="Deuda Total" total={<Money number={totalDebt} />} color="info" icon={'material-symbols:money'} />
      </Grid>
    </Grid>
  )
}

function ClientOrders ({ orders, pay }) {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [order, setOrder] = useState({});
  const total = order.total - order.partialPayment
  return (<>
    <OrdersTable orders={orders} onStatusClick={(order) => {
      setOpenPaymentModal(true);
      setOrder(order);
    }} />
    <PaymentModal
      open={openPaymentModal}
      amount={total}
      clientId={order.clientId}
      max={total}
      onPay={(clientId, amount, paymentMethod) => {
        pay({ orderId: order.id, clientId, payment: amount, paymentMethod })
        setOpenPaymentModal(false);
      }}
      onClose={() => {
        setOpenPaymentModal(false);
      }}
    />
  </>)
}