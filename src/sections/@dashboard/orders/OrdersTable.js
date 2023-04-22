import { Chip, TablePagination } from '@mui/material';
import { useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { between, localeDate } from '../../../core/helpers';
import { CustomTable } from '../../../components/tables/Table';
import { useCState, useHistory } from '../../../hooks/useHooks';
import { SearchDatesInputs } from '../../../components/Inputs/SearchDateInput';


export function OrdersTable ({ orders, onStatusClick }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const history = useHistory();
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
  return (
    <>
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
        titles={['ID', 'RFC', 'Cliente', 'Fecha', 'subtotal', 'Descuento', 'Total', 'Pago', 'Estatus']}
        content={ords}
        onClick={(item) => {
          history(`/dashboard/ordenes/${item.id}`)
        }}
        format={(item) => [
          item.id,
          item.rfc || 'XAXX010101000',
          item.clientName || 'Consumidor final',
          localeDate(item.createdAt),
          <Money key={`item2-${item.id}`} number={item.subtotal} />,
          <Money key={`item4-${item.id}`} number={item.discount} />,
          <Money key={`item3-${item.id}`} number={item.total} />,
          <Money key={`item1-${item.id}`} number={item.partialPayment} />,
          <Chip key={`chip-${item.id}`}
            label={item.status}
            color={color(item.status)}
            onClick={(ev) => {
              ev.stopPropagation();
              if (item.status === 'paid') return;
              onStatusClick(item);
            }}
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }} />
        ]}
      />
    </>
  )
}