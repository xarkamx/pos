import { useNavigate, useParams } from 'react-router-dom'
import { Grid } from '@mui/material'
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AddIcon from '@mui/icons-material/Add';
import { SmartGrid } from '../../components/Containers/SmartGrid'
import { PayrollForm } from '../payroll/payrollForm'
import { useEmployee } from './hooks/useEmployee'
import { BasicCard } from '../../components/Cards/BasicCard'
import { Money } from '../../components/Formats/FormatNumbers'
import { CustomTable } from '../../components/tables/Table'
import { localeDate } from '../../core/helpers'

export function EmployeeView () {
  const { employeeId } = useParams()
  const { employee, updateEmployee, info } = useEmployee(employeeId)
  return (
    <SmartGrid container spacing={
      3
    }>


      <SmartGrid
        item
        title='Agregar'
        icon={<AddIcon />}
        md={6} lg={3}>

        <PayrollForm
          btnText='Actualizar Empleado'
          onSubmit={updateEmployee}
          employee={employee} />
      </SmartGrid>

      <SmartGrid
        title='Detalles'
        icon={<AutoStoriesIcon />}
        item
        xs={12} md={6} lg={8}>
        <DetailsGrid {...info} />
      </SmartGrid>
    </SmartGrid>
  )
}

function DetailsGrid ({
  weeklySalary,
  ptoLimit,
  usedPtoDays,
  totalIncome,
  payments = []
}) {
  const navigate = useNavigate()
  return <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={6} xl={3}>
      <BasicCard title='Salario Semanal'>
        <Money number={weeklySalary} />
      </BasicCard>
    </Grid>
    <Grid item xs={12} md={6} lg={6} xl={3}>
      <BasicCard title='PTOS'
        style={{ cursor: 'pointer', color: '#fff', backgroundColor: '#aaF' }}
        onClick={() => {
          navigate('pto')
        }}>
        {ptoLimit}
      </BasicCard>
    </Grid>
    <Grid item xs={12} md={6} lg={6} xl={3}>
      <BasicCard title='PTO Usados'>
        {usedPtoDays}
      </BasicCard>
    </Grid>
    <Grid item xs={12} md={6} lg={6} xl={3}>
      <BasicCard title='Ingresos totales'>
        <Money number={totalIncome} />
      </BasicCard>
    </Grid>
    <Grid item xs={12}>
      <EmployeePayments payments={payments} />
    </Grid>
  </Grid>
}

function EmployeePayments ({ payments }) {
  return <CustomTable
    titles={['Fecha', 'Monto']}
    content={payments}
    format={(payment) => [
      localeDate(payment.created_at),
      <Money number={payment.amount} key={`
      amount-${payment.id}
        `} />
    ]}
  />
}
