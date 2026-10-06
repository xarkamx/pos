import { Alert, Box, Button, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { CustomTable } from '../../../components/tables/Table';
import { localeDate } from '../../../core/helpers';
import { OrderTransaction } from '../../../utils/transactions/orderTransaction';
import { DownloadBillButton } from './downloadBillButton';

const invoiceTypes = { I: 'Ingreso', P: 'Complemento de pago', E: 'Egreso' };
const invoiceStatuses = { Accepted: 'Aceptada', canceled: 'Cancelada', pending: 'Pendiente' };

export function OrderInvoicesTable({ orderId }) {
  const { data: invoices = [], isLoading, isError, refetch } = useQuery(
    ['orderInvoices', orderId],
    () => new OrderTransaction().getBillsByOrder(orderId),
    { enabled: Boolean(orderId) }
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Facturas de la orden {orderId}</Typography>
      {isLoading && <Typography role="status">Cargando facturas...</Typography>}
      {isError && (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Reintentar</Button>}>
          No se pudieron cargar las facturas de esta orden.
        </Alert>
      )}
      {!isLoading && !isError && invoices.length === 0 && (
        <Alert severity="info">Esta orden no tiene facturas asociadas.</Alert>
      )}
      {!isLoading && !isError && invoices.length > 0 && (
        <CustomTable
          titles={['Folio', 'Fecha', 'Tipo', 'Estado registrado', 'Acciones']}
          content={invoices}
          format={(invoice) => [
            invoice.folio || invoice.external_id || invoice.id,
            invoice.created_at ? localeDate(invoice.created_at) : '—',
            invoiceTypes[invoice.type] || invoice.type || '—',
            invoiceStatuses[invoice.status] || invoice.status || '—',
            <DownloadBillButton key={invoice.id} billingId={invoice.external_id} />,
          ]}
        />
      )}
    </Box>
  );
}
