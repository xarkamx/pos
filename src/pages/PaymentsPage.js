import { Grid } from '@mui/material';
import { usePayments } from '../hooks/usePayments';

import PaymentTable from '../sections/@dashboard/payments/PaymentsTable';
import { QuickPaymentForm } from '../sections/@dashboard/payments/QuickPaymentForm';
import { PaymentChart } from '../sections/@dashboard/charts/paymentCharts';

export default function PaymentPages () {
  const { payments, addPayment, deletePayment } = usePayments();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PaymentChart payments={payments} />
      </Grid>
      <Grid item xs={12} md={4}>
        <QuickPaymentForm onSubmit={addPayment} />
      </Grid>
      <Grid item xs={12} md={8}>
        <PaymentTable payments={payments} onDeletePayment={deletePayment} />
      </Grid>
    </Grid>
  );
}

