import { Grid } from '@mui/material';
import { usePayments } from '../hooks/usePayments';
import { TotalResume } from '../sections/@dashboard/payments/PaymentsResume';

import PaymentTable from '../sections/@dashboard/payments/PaymentsTable';
import { QuickPaymentForm } from '../sections/@dashboard/payments/QuickPaymentForm';

export default function PaymentPages () {
  const { payments, addPayment, deletePayment } = usePayments();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TotalResume payments={payments} />
      </Grid>
      <Grid item xs={4}>
        <QuickPaymentForm onSubmit={addPayment} />
      </Grid>
      <Grid item xs={8}>
        <PaymentTable payments={payments} onDeletePayment={deletePayment} />
      </Grid>
    </Grid>
  );
}

