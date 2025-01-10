

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton } from '@mui/material';
import { QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { CustomTable } from '../../components/tables/Table';

export function PayrollTable ({ items = [], onPay }) {
  const [payroll, setPayroll] = useState(items)
  const navigate = useNavigate()
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
      titles={['Nombre', 'Por dia', 'Dias Trabajados', 'Total', 'Acciones']}
      content={payroll}
      format={(item) => [
        item.name,
        item.salaryPerDay,
        <QuickFormInput
          key={`days-worked-${item.id}`}
          fullWidth label="Dias Trabajados"
          max={6}
          type='number'
          onFocus={(ev) => ev.target.select()}
          value={item.workWeek}
          onChange={(ev) => {
            let days = ev.target.value
            if (days > 6) days = 6
            setPayroll(payroll.map(pay => pay.id === item.id ? { ...pay, workWeek: days } : pay))
          }} />,
        Math.ceil(item.salaryPerDay * item.workWeek) || Math.ceil(item.salaryPerDay * 6),
        <IconButton onClick={() => {
          navigate(`/dashboard/empleados/${item.id}`)
        }} key={`employee-edit-${item.id}`}>
          <EditIcon />
        </IconButton>
      ]}
    />
  </>
  )
}