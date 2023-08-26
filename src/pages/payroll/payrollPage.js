import { Grid } from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import { PayrollForm } from './payrollForm';
import { PayrollTransaction } from '../../utils/transactions/payrollTransaction';
import { PayrollTable } from './payrollTable';
import { usePopUp } from '../../context/PopUpContext';

export function PayrollView () {
  const { payroll, setPayroll, pay } = usePayroll();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <PayrollForm onSubmit={setPayroll} />
      </Grid>
      <Grid item xs={12} md={6} lg={9}>
        <PayrollTable items={payroll} onPay={pay} />
      </Grid>
    </Grid>
  )
}

function usePayroll () {
  const transaction = new PayrollTransaction();
  const { popUpAlert } = usePopUp();
  const payroll = useQuery('payroll', async () => transaction.getPayroll())
  const setPayroll = useMutation((employee) => transaction.create({
    ...employee,
    status: 'active'
  }), {
    onSuccess: () => {

      popUpAlert('success', 'Se ha agregado un nuevo empleado')
      payroll.refetch();
    }
  })
  const pay = useMutation((payment) => transaction.pay(payment), {
    onSuccess: () => {
      popUpAlert('success', 'Se ha pagado la nomina')
    }
  })
  return {
    payroll: payroll.data || [],
    setPayroll: setPayroll.mutate,
    pay: pay.mutate
  };
}