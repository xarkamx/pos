import { Card, Chip, Grid, TablePagination, TextField } from '@mui/material';
import { localeDate } from 'afio/src/core/helpers';
import { useState } from 'react';
import { Money } from '../components/Formats/FormatNumbers';
import { CustomTable } from '../components/tables/Table';
import { between } from '../core/helpers';
import { useCState } from '../hooks/useHooks';
import { useOrders } from '../hooks/useOrders';

export function OrdersPage () {
  const { orders } = useOrders();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useCState(null);
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
  let ords = orders?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  if (search) {
    const to = new Date(search.to).getTime();
    const from = new Date(search.from).getTime();
    ords = ords.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return between(createdAt, from || 0, to || Infinity)
    });
  }
  const itemsCount = search ? ords.length : orders?.length || 0;
  return <Card sx={{
    padding: '1rem',
  }}>
    <EarninsResume orders={search ? ords : orders} />
    <SearchOrdersInputs onChange={(dates) => {
      setSearch(dates);
    }} />

    <CustomTable
      pageComponent={<TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={itemsCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(ev, pageNumber) => {
          setPage(pageNumber);
        }}
        onRowsPerPageChange={(ev) => {
          setRowsPerPage(ev.target.value);
        }}
      />}
      titles={['ID', 'Fecha', 'Cliente', 'Pago', 'subtotal', 'Total', 'Descuento', 'Estatus']}
      content={ords}
      format={(item) => [
        item.id,
        localeDate(item.createdAt),
        item.rfc,
        <Money key={`item1-${item.id}`} number={item.partialPayment} />,
        <Money key={`item2-${item.id}`} number={item.subtotal} />,
        <Money key={`item3-${item.id}`} number={item.total} />,
        <Money key={`item4-${item.id}`} number={item.discount} />,
        <Chip key={`chip-${item.id}`} label={item.status} color={color(item.status)} sx={{
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'capitalize'
        }} />
      ]}
    />
  </Card>

}

function SearchOrdersInputs ({ onChange }) {
  const [dates, setDates] = useCState({
    from: null,
    to: null,
  });
  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth label="Desde"
          InputLabelProps={{ shrink: true }}
          type='date' onChange={(ev) => {
            setDates({ from: ev.target.value });
            onChange({ ...dates, from: ev.target.value });
          }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth label="Hasta"
          InputLabelProps={{ shrink: true }}
          type='date' onChange={(ev) => {
            setDates({ to: ev.target.value });
            onChange({ ...dates, to: ev.target.value });
          }} />
      </Grid>
    </Grid>
  </>
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
      <Card sx={{ ...sx, backgroundColor: 'orange' }}>
        <h3>Subtotal</h3>
        <Money number={payment} />
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={{ ...sx, backgroundColor: 'lightgreen' }}>
        <h3>Total</h3>
        <Money number={total} />
      </Card>
    </Grid>
    <Grid item xs={12} md={4}>
      <Card sx={{ ...sx, backgroundColor: 'red' }}>
        <h3>Pendiente</h3>
        <Money number={total - payment} />
      </Card>
    </Grid>
  </Grid>
}