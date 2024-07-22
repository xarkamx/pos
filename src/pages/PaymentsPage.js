import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import { usePayments } from '../hooks/usePayments';

import PaymentTable from '../sections/@dashboard/payments/PaymentsTable';
import { QuickPaymentForm } from '../sections/@dashboard/payments/QuickPaymentForm';
import { StackChart } from '../sections/@dashboard/charts/paymentCharts';
import { SmartGrid } from '../components/Containers/SmartGrid';

export default function PaymentPages () {
  const { payments, addPayment, deletePayment } = usePayments();
  return (
    <SmartGrid container spacing={2}>
      <SmartGrid item xs={12} title='Pagos' md={8}>
        <PaymentTable payments={payments} onDeletePayment={deletePayment} />
      </SmartGrid>
      <SmartGrid item title='Registro de pago' icon={<AddIcon />} xs={12} md={4}>
        <QuickPaymentForm onSubmit={addPayment} />
      </SmartGrid>
      <SmartGrid title='Grafica' icon={<BarChartIcon />} item xs={12}>
        <StackChart payments={payments} height='600' />
      </SmartGrid>
    </SmartGrid>
  );
}

