import { Card, Grid, TablePagination } from '@mui/material';
import { useState } from 'react';
import { Money } from '../components/Formats/FormatNumbers';
import { SearchDatesInputs } from '../components/Inputs/SearchDateInput';
import { CustomTable } from '../components/tables/Table';
import { between, localeDate } from '../core/helpers';
import { useCState } from '../hooks/useHooks';
import { usePayments } from '../hooks/usePayments';

export default function PaymentPages () {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useCState(null);
  const { payments } = usePayments();
  let pays = payments?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];
  console.log(pays);
  if (search) {
    const to = new Date(search.to).getTime();
    const from = new Date(search.from).getTime();
    pays = pays.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return between(createdAt, from || 0, to || Infinity)
    });
  }
  const itemsCount = search ? pays.length : payments?.length || 0;
  return <Card sx={{
    padding: '1rem',
  }}>
    <TotalResume payments={pays} />
    <SearchDatesInputs onChange={(dates) => {
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
      titles={['ID', 'Fecha', 'Orden', 'Pago', 'Método']}
      content={pays}
      format={(item) => [
        item.id,
        localeDate(item.createdAt),
        item.orderId,
        <Money key={`item2-${item.id}`} number={item.amount} />,
        item.paymentMethod === 1 ? 'Efectivo' : 'Deposito'
      ]}
    />
  </Card>

}

function TotalResume ({ payments }) {
  const total = payments?.reduce((acc, item) => acc + item.amount, 0);
  const sx = {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
    '& > *': {
      margin: '0.5rem 0',
    }
  }
  return (
    <Grid container spacing={2} sx={
      {
        padding: '1rem',
      }
    }>
      <Grid item xs={12} md={4}>
        <Card sx={{ ...sx, backgroundColor: 'primary.main' }}>
          <h2>Total</h2>
          <Money number={total} />
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ ...sx, backgroundColor: 'orange' }}>
          <h2>Depositos</h2>
          <Money number={payments?.filter(item => item.paymentMethod === 2).reduce((acc, item) => acc + item.amount, 0)} />
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ ...sx, backgroundColor: 'success.main' }}>
          <h2>Efectivo</h2>
          <Money number={payments?.filter(item => item.paymentMethod === 1).reduce((acc, item) => acc + item.amount, 0)} />
        </Card>
      </Grid>
    </Grid>
  )
}