import { Button, Card, Chip, Grid, TextField, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useState } from 'react';
import { Money } from '../components/Formats/FormatNumbers';
import { SearchDatesInputs } from '../components/Inputs/SearchDateInput';
import { CustomTable } from '../components/tables/Table';
import { between, getEndOfDay, getLastMonday, localeDateUTFMex } from '../core/helpers';
import { useCState, useHistory } from '../hooks/useHooks';
import { useOrders } from '../hooks/useOrders';
import { PaymentModal } from '../sections/@dashboard/orders/paymentModal';
import { DangerModal } from '../components/CustomModal/ConfirmModal';
import { paymentType } from '../utils/formats';

export function OrdersPage () {
  const { orders, pay, checkIn, isLoading } = useOrders();
  const [search, setSearch] = useCState({ from: getLastMonday(new Date()), to: getEndOfDay(new Date()) });
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [order, setOrder] = useCState({});
  const [query, setQuery] = useState('');
  const history = useHistory();
  const color = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'canceled':
        return 'error';
      default:
        return 'info';
    }
  }
  if (isLoading) {
    return <h1>Cargando...</h1>
  }
  let ords = orders;
  if (query) {
    ords = ords.filter((item) => {
      const queryList = query.split(' ');

      const searchableString = Object.values(item).join(' ').toLowerCase();
      return queryList.some((q) => searchableString.includes(q.toLowerCase()));
    });
  }
  if (search) {
    const to = new Date(search.to).getTime();
    const from = new Date(search.from).getTime();
    ords = ords.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return between(createdAt, from || 0, to || Infinity)
    });
  }

  return <Card sx={{
    padding: '1rem',
  }}>
    <EarninsResume orders={search ? ords : orders} />
    <TextField label="Buscar"
      variant="outlined"
      sx={{ width: '100%', marginBottom: '1rem' }}
      onChange={(ev) => {
        setQuery(ev.target.value);
      }}
    />
    <SearchDatesInputs
      dfrom={search.from}
      onChange={(dates) => {
        setSearch(dates);
      }} />
    <CustomTable
      titles={['ID', 'Cliente', 'Fecha', 'Total', 'Pago', 'Tipo de pago', 'Estatus', 'Facturado', 'Acciones']}
      content={ords}
      format={(item) => [
        item.id,
        item.clientName || 'Consumidor final',
        localeDateUTFMex(item.createdAt),
        <Money key={`item3-${item.id}`} number={item.total} />,
        <Money key={`item1-${item.id}`} number={item.partialPayment} />,
        paymentType(item.paymentType),
        <Chip key={`chip-${item.id}`}
          label={item.status}
          color={color(item.status)}
          onClick={(ev) => {
            ev.stopPropagation();
            if (item.status === 'paid') return;
            setOrder(item);
            setOpenPaymentModal(true);
          }}
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'capitalize'
          }} />,
        <BillingButton order={item} key={`billing-${item.id}`} onClick={() => {
          checkIn(item.id);
        }} />,
        <Button key={`item2-${item.id}`} onClick={() => {
          history(`/dashboard/ordenes/${item.id}`)
        }}>Ver</Button>
      ]}
    />
    <PaymentModal
      amount={order.total - order.partialPayment}
      max={order.total - order.partialPayment}
      onPay={(clientId, amount, paymentMethod) => {
        pay({ orderId: order.id, clientId, payment: amount, paymentMethod })
        setOpenPaymentModal(false);
      }}
      onClose={() => {
        setOpenPaymentModal(false);
      }}
      open={
        openPaymentModal
      } />
  </Card>
}


function EarninsResume ({ orders = [] }) {
  let payment = 0;
  let total = 0;
  const sx = {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    '& > *': {
      margin: '0.5rem 0',
    }
  }
  if (!orders.length) return null;
  orders.forEach((item) => {
    payment += item.partialPayment;
    total += item.total;
  });
  return <Grid container spacing={5} sx={{
    padding: '1rem',
  }}>
    <Grid item xs={12} md={4}>
      <Card sx={{ ...sx, backgroundColor: 'darkorchid' }}>
        <h3>Ingresos reales</h3>
        <Money number={payment} />
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={{ ...sx, backgroundColor: 'green' }}>
        <h3>Ingresos Estimados</h3>
        <Money number={total} />
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={{ ...sx, backgroundColor: 'red' }}>
        <h3>Por Cobrar</h3>
        <Money number={total - payment} />
      </Card>
    </Grid>
  </Grid>
}

function BillingButton ({ order, onClick }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const valid = [order.rfc, order.email, order.postalCode]

  if (!valid.every(val => val)) return <Typography variant="caption" color="error">Datos incompletos</Typography>;
  if (order.billed) return <Chip label="Facturado" color="success" sx={{
    color: 'white',
  }} />
  return <><Button variant={'contained'} endIcon={<ReceiptLongIcon />}
    onClick={(ev) => {
      ev.stopPropagation();
      setOpenConfirm(true);
    }}
  >Facturar</Button>

    <DangerModal
      message={`¿Estás seguro de facturar la orden ${order.id}?`}
      placeholder='Escribe el ID de la orden para confirmar'
      onClose={() => {
        setOpenConfirm(false);
      }}
      onConfirm={() => {
        setOpenConfirm(false);
        onClick(order.id);
      }}
      open={openConfirm} condition={(input) => parseInt(input, 10) === parseInt(order.id, 10)} icon={ReceiptLongIcon} color='info' />
  </>
}

