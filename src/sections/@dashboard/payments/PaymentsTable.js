import { Card, TablePagination } from '@mui/material';
import { useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { SearchDatesInputs } from '../../../components/Inputs/SearchDateInput';
import { CustomTable } from '../../../components/tables/Table';
import { between, localeDate } from '../../../core/helpers';
import { useCState } from '../../../hooks/useHooks';
import { usePayments } from '../../../hooks/usePayments';

export default function PaymentTable ({ payments }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useCState(null);
  let pays = payments?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];
  if (search) {
    const to = new Date(search.to).getTime();
    const from = new Date(search.from).getTime();
    pays = pays.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return between(createdAt, from || 0, to || Infinity);
    });
  }
  const itemsCount = search ? pays.length : payments?.length || 0;
  return (
    <Card
      sx={{
        padding: '1rem',
      }}
    >
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
        titles={['ID', 'Fecha', 'Referencia', 'Flujo', 'Descripcion', 'Tipo de pago', 'Pago', 'Método']}
        content={pays}
        format={(item) => [
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
    </Card>
  );
}
