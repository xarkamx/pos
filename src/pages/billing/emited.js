import { useState } from 'react';
import { Card, Chip, FormControl, Grid, InputLabel, MenuItem, Select, TablePagination } from '@mui/material';
import { Money } from '../../components/Formats/FormatNumbers';
import { CustomTable } from '../../components/tables/Table';
import { taxSystem } from '../../config/constants';
import { between, getEndOfDay, getFirstDayOfMonth, localeDate } from '../../core/helpers';
import { useBillingList } from '../../hooks/useBilling';
import { DebounceInput } from '../../components/Inputs/DebounceInput';
import { BillingButton } from '../orders/billingButton';
import { DownloadBillButton, SendEmail } from '../../sections/@dashboard/billing/downloadBillButton';
import { AddComplementButton } from '../../sections/@dashboard/billing/complementModal';
import { SearchDatesInputs } from '../../components/Inputs/SearchDateInput';
import { useCState } from '../../hooks/useHooks';



const statusText = {
  "valid": "Valido",
  "invalid": "Invalido",
  "canceled": "Cancelado",
  "pending": "Pendiente"
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
        search({
          q: ev.target.value,

        })
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
          <ActionsContainer item={item} onCancel={cancel} key={`actions-${item.id}`} />
        ]}
      />
    </>
  )
}

export function ReceivedBillingList () {

  const { metadata } = useBillingList()
  const [search, setSearch] = useCState({

    from: getFirstDayOfMonth(new Date()),
    to: getEndOfDay(new Date()),
    type: 'I'
  });

  const to = new Date(search.to).getTime();
  const from = new Date(search.from).getTime();
  const filteredData = metadata?.filter((item) => {
    const createdAt = new Date(item.sat_certification_date).getTime();
    return between(createdAt, from || 0, to || Infinity) && item.voucher_effect === search.type
  }) || [];


  return (
    <>

      <AmountResume payments={filteredData?.map(item => ({
        amount: item.amount,
        status: item.status,
        flow: item.voucher_effect === 'I' ? 'inflow' : 'outflow',
        total: 0
      }))} />
      <VoucherTypeSelect onChange={(type) => {
        setSearch({ type })
      }} />
      <SearchDatesInputs
        dfrom={search.from}
        onChange={(dates) => {
          setSearch({
            from: dates.from,
            to: dates.to,
          });
        }} />

      <CustomTable
        titles={['Folio', 'Fecha', 'Emisor', 'RFC', 'Total', 'Tipo', 'Estado']}
        content={filteredData}
        format={(item) => [
          item.uuid,
          item.sat_certification_date,
          item.issuer_name,
          item.issuer_rfc,
          <Money number={item.amount} key={item.uuid} />,
          item.voucher_effect,
          <Chip
            sx={{
              backgroundColor: item.status === '1' ? 'green' : 'red',
              color: 'white',
            }}
            key={`chip-${item.uuid}-status`}
            label={item.status === '1' ? 'Valido' : 'Invalido'}
          />

        ]}
      />
    </>
  )
}


function ActionsContainer ({ item, onCancel }) {
  return <div style={
    {
      display: 'flex',
      justifyContent: 'center',
      flexFlow: 'column'
    }
  }>{item.status === 'valid' ? <BillingButton billingId={item.id} orderId={item.folio_number} onBilling={() => {
    onCancel(item.id)
  }} /> : ''}

    {item.status === 'valid' ? <DownloadBillButton billingId={item.id} /> : ''}
    {item.status === 'valid' ? <SendEmail billingId={item.id} /> : ''}
    {item.payment_form === '99' && item.status === 'valid' ? <AddComplementButton total={item.total} billingId={item.id} /> : ''}
  </div>
}

function VoucherTypeSelect ({ type, onChange }) {
  return (<FormControl
    style={{
      marginBottom: '1rem'
    }}
    fullWidth>
    <InputLabel id="payment-type-label">Tipo</InputLabel>
    <Select value={type}
      labelId="payment-type-label"
      id="payment-type-select" fullWidth
      onChange={(ev) => {
        onChange(ev.target.value)
      }}
    >
      <MenuItem value={'I'}>Ingreso</MenuItem>
      <MenuItem value={'E'}>Egreso</MenuItem>
      <MenuItem value={'T'}>Traslado</MenuItem>
      <MenuItem value={'N'}>Nomina</MenuItem>
      <MenuItem value={'P'}>Pago</MenuItem>

    </Select>
  </FormControl>)
}


function AmountResume ({ payments }) {
  const resume = resumePayments(payments);
  return <Grid container spacing={1}>
    <Grid item xs={12} >
      <Card sx={{ backgroundColor: '#ccc', color: 'white', textAlign: 'center', height: "200px", margin: "auto" }} >
        <h3>Pagados</h3>
        <Money number={resume.inflow} />
      </Card>
    </Grid>
  </Grid>
}

function resumePayments (payments) {
  return payments?.reduce((acc, item) => {
    let amount = item.flow === 'inflow' ? item.amount : -item.amount;
    if (item.status !== '1') amount = 0;
    acc.total += amount;
    acc[item.flow] += amount;
    return acc;
  }, {
    total: 0,
    inflow: 0,
    outflow: 0,
  });
}