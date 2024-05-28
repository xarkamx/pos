import { useState } from 'react';
import { useQuery } from 'react-query';
import { Grid } from '@mui/material';
import { MiddlemanTransaction } from '../../utils/transactions/middlemanTransaction';
import { CustomTable } from '../../components/tables/Table';
import { Money } from '../../components/Formats/FormatNumbers';
import { QuickClientForm } from '../../sections/@dashboard/clients/QuickClientAddForm';
import { usePopUp } from '../../context/PopUpContext';
import { AppWidgetSummary } from '../../sections/@dashboard/app';
import { MinifyPaymentModal } from '../../sections/@dashboard/orders/paymentModal';
import { SmartGrid } from '../../components/Containers/SmartGrid';


export function MiddlemanOverview () {
  const { orders, payments, addClient, sendPayment } = useMiddlemanDetails();
  const [openPayment, setOpenPayment] = useState(false)
  const details = calcDetails(orders)
  const paid = calcPayments(payments)
  const pending = details.amount - paid
  return <SmartGrid container spacing={2}>
    <SmartGrid item xs={12}>
      <MiddlemanResume
        numberOfClients={details.clients}
        earnings={details.amount}
        pending={pending}
        paid={paid}

      />
      <MinifyPaymentModal open={openPayment} max={pending} onSubmit={(amount) => {
        sendPayment(amount)
        setOpenPayment(false)
      }} onClose={() => {
        setOpenPayment(false)

      }} />
    </SmartGrid>
    <SmartGrid item sm={12} md={4} sx={{
      margin: 'auto'
    }}>
      <QuickClientForm onSubmit={addClient} />
    </SmartGrid>
    <SmartGrid item sm={12} md={8}>
      <MiddlemanOrdersTable clients={orders} />
    </SmartGrid>
  </SmartGrid>
}


function MiddlemanResume ({ numberOfClients, earnings, pending, paid, onPendingClick }) {

  return <Grid container spacing={2} sx={{
    mb: 2

  }}>
    <Grid item xs={12} sm={6} md={3}>
      <AppWidgetSummary
        title="Ingresos" total={<Money number={earnings} />} color="success" icon={'ant-design:dollar'} />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <AppWidgetSummary
        title="Pendiente de pago" total={<Money number={pending} />} color="warning" icon={'ant-design:file-done'} onClick={
          onPendingClick

        } />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <AppWidgetSummary

        title="Pagado" total={<Money number={paid} />} color="info" icon={'ant-design:file-done'} />
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <AppWidgetSummary
        title="Clientes" total={<>{numberOfClients}</>} color="error" icon={'ant-design:shopping-cart'} />
    </Grid>
  </Grid>
}

function MiddlemanOrdersTable ({ clients }) {
  return <CustomTable
    titles={['ID', 'Cliente', 'RFC', 'Total', 'Ordenes', 'Comision']}
    content={clients}
    format={(item) => [
      item.id,
      item.name || 'Publico general',
      item.rfc,
      <Money key={`item3-${item.id}`} number={item.amount} />,
      item.numberOfOrders ?? 0,
      <Money key={`item3-${item.id}`} number={item.amount * 0.05} />,
    ]}
  />
}
function useMiddlemanDetails () {
  const { popUpAlert } = usePopUp()
  const query = useQuery(['middlemanDetails'], async () => {
    const service = new MiddlemanTransaction();
    return service.getMyMiddlemanClients();
  })

  const queryPayments = useQuery('middlemanPayments', async () => {
    const service = new MiddlemanTransaction();
    return service.getMyMiddlemanPayments()
  })

  const saveClient = async (clientDetails) => {
    const middleman = new MiddlemanTransaction()
    try {
      await middleman.addMyClient(clientDetails)
      popUpAlert('success', 'Cliente anexado')
      query.refetch()
    } catch (e) {
      popUpAlert('Error', e.toMessage())
    }
  }

  const sendPayment = async (amount) => {
    const service = new MiddlemanTransaction()
    try {
      await service.sendPayment(amount)
      popUpAlert('success', 'Pago registrado')
      queryPayments.refetch()
    } catch (e) {
      popUpAlert('error', e.toString())
    }
  }
  return {
    orders: query.data || [],
    payments: queryPayments.data || [],
    addClient: saveClient,
    sendPayment
  }
}

function calcDetails (clients) {
  return clients.reduce((acc, client) => {
    acc.clients += 1
    acc.amount = client.amount * 0.05
    return {
      amount: acc.amount || 0,
      clients: acc.clients
    };
  }, {
    clients: 0,
    amount: 0
  })
}

function calcPayments (payments) {
  return payments.reduce((acc, payment) => {
    acc += payment.amount
    return acc
  }, 0)
}