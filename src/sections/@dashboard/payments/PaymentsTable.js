import { TextField } from '@mui/material';
import { useState } from 'react';
import { DeleteSmallButton } from '../../../components/Buttons/IconButons';
import { Money } from '../../../components/Formats/FormatNumbers';
import { SearchDatesInputs } from '../../../components/Inputs/SearchDateInput';
import { PaginatedTable } from '../../../components/tables/paginatedTable';
import { CustomTable } from '../../../components/tables/Table';
import { between, getEndOfDay, getLastMonday } from '../../../core/helpers';
import { useCState } from '../../../hooks/useHooks';
import { TotalResume } from './PaymentsResume';
import { paymentType } from '../../../utils/formats';
import { PaymentMethodSelect } from './SelectPaymentMethod';
import { CreatedSinceToolTip } from '../../../components/label/Label';

export default function PaymentTable ({ payments, onDeletePayment }) {
  const [search, setSearch] = useCState({ from: getLastMonday(new Date()), to: getEndOfDay(new Date()) });
  const [query, setQuery] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);
  let pays = payments || [];
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

  if (filterBy) {
    pays = pays.filter((item) => item.flow === filterBy);
  }

  if (paymentMethod) {
    pays = pays.filter((item) => (
      parseInt(item.paymentMethod, 10) === parseInt(paymentMethod.value, 10)
    ));
  }

  return (
    <>

      <TotalResume payments={pays} onClick={(flow) => {
        setFilterBy(flow);
      }} />
      <TextField fullWidth label="Buscar" sx={{
        marginBottom: '1rem'
      }} onChange={(ev) => {
        setQuery(ev.target.value);
      }} />
      <PaymentMethodSelect value={
        paymentMethod
      } onChange={(val) => {
        setPaymentMethod(val);
      }} sx={
        { marginBottom: '1rem ' }
      } />
      <SearchDatesInputs
        dfrom={search.from}
        onChange={(dates) => {
          setSearch(dates);
        }}
      />
      <CustomTable
        titles={['', 'ID', 'Fecha', 'Referencia', 'Flujo', 'Descripcion', 'Tipo de pago', 'Pago', 'Método']}
        content={pays}
        format={(item) => [
          <DeleteSmallButton key={`del-${item.id}`} onClick={() => {
            onDeletePayment(item.id);
          }} />,
          item.id,
          <CreatedSinceToolTip date={item.createdAt} key={`date-${item.id}`} />,
          item.externalId,
          item.flow === 'inflow' ? 'Entrada' : 'Salida',
          item.description,
          item.paymentType,
          <Money key={`item2-${item.id}`} number={item.amount} />,
          paymentType(item.paymentMethod),
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


