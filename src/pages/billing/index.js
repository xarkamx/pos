import { useState } from 'react';
import { Chip, TablePagination } from '@mui/material';
import { Money } from '../../components/Formats/FormatNumbers';
import { CustomTable } from '../../components/tables/Table';
import { taxSystem } from '../../config/constants';
import { localeDate } from '../../core/helpers';
import { useBillingList } from '../../hooks/useBilling';
import { DebounceInput } from '../../components/Inputs/DebounceInput';
import { BillingButton } from '../orders/billingButton';
import { DownloadBillButton, SendEmail } from '../../sections/@dashboard/billing/downloadBillButton';



const statusText = {
  "valid": "Valido",
  "invalid": "Invalido",
  "canceled": "Cancelado"
}

const methodText = {
  "PUE": "Pago en una sola exhibición",
  "PPD": "Pago en parcialidades o diferido"
}
export function BillingList () {
  const { billing, search, cancel } = useBillingList()
  const [rowsPerPage, setRowsPerPage] = useState(10);
  return (
    <>
      <DebounceInput label="Buscar" variant="outlined" fullWidth onChange={(ev) => {
        search({ q: ev.target.value })
      }} />
      <CustomTable
        titles={['Folio', 'Fecha', 'Cliente', 'Regimen Fiscal', 'RFC', 'Total', 'Estado', 'Metodo', 'Acciones']}
        pageComponent={<TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(ev) => {
            setRowsPerPage(ev.target.value);
            search({ page: 1, limit: ev.target.value })
          }}
          component="div"
          count={billing?.total_results || 0}
          rowsPerPage={rowsPerPage}
          page={billing?.page || 0}
          onPageChange={(ev, pageNumber) => {
            search({ page: pageNumber })
          }}
        />}
        content={billing?.data}
        format={(item) => [
          item.folio_number,
          localeDate(item.created_at),
          item.customer.legal_name,
          taxSystem[item.customer.tax_system],
          item.customer.tax_id,
          <Money number={item.total} key={item.id} />,
          <Chip
            key={`chip-${item.id}-status`}
            label={statusText[item.status]}
            color={item.status === 'valid' ? 'success' : 'error'}
            sx={{
              color: 'white',
              fontWeight: 'bold',
            }}
          />,
          methodText[item.payment_method],
          <div key='actions' style={
            {
              display: 'flex',
              justifyContent: 'center',
              flexFlow: 'column'
            }
          }>{item.status === 'valid' ? <BillingButton billingId={item.id} orderId={item.folio_number} onBilling={() => {
            cancel(item.id)
          }} /> : ''}

            {item.status === 'valid' ? <DownloadBillButton billingId={item.id} /> : ''}
            {item.status === 'valid' ? <SendEmail billingId={item.id} /> : ''}
          </div>
        ]}
      />
    </>
  )
}
