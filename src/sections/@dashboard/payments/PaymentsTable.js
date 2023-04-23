import { TablePagination, TextField } from '@mui/material';
import { useState } from 'react';
import { DeleteSmallButton } from '../../../components/Buttons/IconButons';
import { Money } from '../../../components/Formats/FormatNumbers';
import { SearchDatesInputs } from '../../../components/Inputs/SearchDateInput';
import { PaginatedTable } from '../../../components/tables/paginatedTable';
import { CustomTable } from '../../../components/tables/Table';
import { between, localeDate } from '../../../core/helpers';
import { useCState } from '../../../hooks/useHooks';
import { TotalResume } from './PaymentsResume';

export default function PaymentTable ({ payments, onDeletePayment }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useCState(null);
  const [query, setQuery] = useState('');
  let pays = payments
  if (search) {
    const to = new Date(search.to).getTime();
    const from = new Date(search.from).getTime();
    pays = pays.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return between(createdAt, from || 0, to || Infinity);
    });
  }
  if (query) {
    pays = pays.filter((item) => {
      const str = `${item.id} ${item.description} ${item.externalId} ${item.amount}`;
      return str.toLowerCase().includes(query.toLowerCase());
    });
  }
  pays = pays?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];
  const itemsCount = pays.length || 0;
  return (
    <>

      <TotalResume payments={pays} />
      <TextField fullWidth label="Buscar" sx={{
        marginBottom: '1rem'
      }} onChange={(ev) => {
        setQuery(ev.target.value);
      }} />
      <SearchDatesInputs
        onChange={(dates) => {
          setSearch(dates);
        }}
      />
      <CustomTable
        pageComponent={
          <TablePagination
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
          />
        }
        titles={['', 'ID', 'Fecha', 'Referencia', 'Flujo', 'Descripcion', 'Tipo de pago', 'Pago', 'Método']}
        content={pays}
        format={(item) => [
          <DeleteSmallButton key={`del-${item.id}`} onClick={() => {
            onDeletePayment(item.id);
          }} />,
          item.id,
          localeDate(item.createdAt),
          item.externalId,
          item.flow === 'inflow' ? 'Entrada' : 'Salida',
          item.description,
          item.paymentType,
          <Money key={`item2-${item.id}`} number={item.amount} />,
          item.paymentMethod === 1 ? 'Efectivo' : 'Deposito',
        ]}
      />
    </>
  );
}

export function SimplePaymentsTable ({ payments }) {
  return <PaginatedTable items={payments} titles={[
    'ID',
    'Método',
    'Cantidad'
  ]}
    format={(item) => [
      item.id,
      item.paymentMethod === 1 ? 'Efectivo' : 'Deposito',
      <Money key={`item2-${item.id}`} number={item.amount} />
    ]}
  />
}
