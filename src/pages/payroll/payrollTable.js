

import { useEffect, useState } from 'react';

import { Button } from '@mui/material';
import { QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { CustomTable } from '../../components/tables/Table';

export function PayrollTable ({ items = [], onPay }) {
  const [payroll, setPayroll] = useState(items)
  const onLoad = () => {
    if (payroll.length === 0 || items.length !== payroll.length) setPayroll(items)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onLoad, [items])

  return (<>
    <Button
      variant='contained'
      fullWidth
      onClick={() => {
        onPay(payroll)
      }}>
      Pagar
    </Button>
    <CustomTable
      titles={['Nombre', 'Por dia', 'Dias Trabajados', 'Total']}
      content={payroll}
      format={(item) => [
        item.name,
        item.salaryPerDay,
        <>
          <QuickFormInput fullWidth label="Dias Trabajados"
            max={6}
            type='number'
            onFocus={(ev) => ev.target.select()}
            value={item.daysWorked || 6}
            onChange={(ev) => {
              let days = ev.target.value
              if (days > 6) days = 6
              setPayroll(payroll.map(pay => pay.id === item.id ? { ...pay, daysWorked: days } : pay))
            }} />
        </>,
        Math.ceil(item.salaryPerDay * item.daysWorked) || Math.ceil(item.salaryPerDay * 6)
      ]}
    />
  </>
  )
}