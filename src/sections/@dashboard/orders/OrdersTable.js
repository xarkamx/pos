
import EditIcon from '@mui/icons-material/Edit';
import { Chip, IconButton } from '@mui/material';
import { Money } from '../../../components/Formats/FormatNumbers';
import { between, localeDate } from '../../../core/helpers';
import { CustomTable } from '../../../components/tables/Table';
import { useCState, useHistory } from '../../../hooks/useHooks';
import { SearchDatesInputs } from '../../../components/Inputs/SearchDateInput';


export function OrdersTable ({ orders, onStatusClick }) {
  const history = useHistory();
  const [search, setSearch] = useCState(null);
  const color = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'info';
    }
  }
  let ords = orders;
  if (search) {
    const to = new Date(search.to).getTime();
    const from = new Date(search.from).getTime();
    ords = ords.filter((item) => {
      const createdAt = new Date(item.createdAt).getTime();
      return between(createdAt, from || 0, to || Infinity)
    });
  }
  return (
    <>
      <SearchDatesInputs onChange={(dates) => {
        setSearch(dates);
      }} />
      <CustomTable
        titles={['ID', 'Fecha', 'Total', 'Pago', 'Estatus']}
        content={ords}
        onClick={(item) => {
          history(`/dashboard/ordenes/${item.id}`)
        }}
        format={(item) => [
          item.id,
          localeDate(item.createdAt),
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

export function RequestedOrderTable ({ orders, onEdit, onDelete }) {
  const navigate = useHistory();
  return (
    <CustomTable
      titles={['ID', 'cliente', 'Fecha', 'Total', 'Pago', 'Acciones']}
      content={orders}
      onClick={onEdit}
      onDelete={onDelete}
      format={(item) => [
        item.id,
        item.clientName ?? 'Publico General',
        localeDate(item.createdAt),
        <Money key={`item3-${item.id}`} number={item.total} />,
        <Money key={`item1-${item.id}`} number={item.partialPayment} />,
        <IconButton key={`edit-${item.id}`} onClick={() => {
          navigate(`/dashboard/caja?order=${item.id}`)
        }} >
          <EditIcon />
        </IconButton>
      ]}
    />
  )
}