import { getDatesByWeekNumber, getNumberOfWeekOfYear } from '../../../core/helpers';

import AppWebChart from '../app/AppWebsiteVisits';

export function PaymentChart ({ payments }) {
  const groupedPayments = groupPaymentsPerWeek(payments);
  const dates = groupedPayments.map((group) => group.week.toISOString());

  return (<AppWebChart
    title="Pagos"
    chartLabels={dates}
    chartData={[
      {
        name: 'Entradas',
        type: 'area',
        fill: 'gradient',
        color: '#4caf50',
        data: getPaymentsTotal(groupedPayments, 'inflow'),
      },
      {
        name: 'Salidas',
        type: 'area',
        fill: 'gradient',
        color: '#f44336',
        data: getPaymentsTotal(groupedPayments, 'outflow'),
      },
      {
        name: 'Balance',
        type: 'line',
        fill: 'solid',
        color: '#90caf9',
        data: getBalance(groupedPayments),
      },
    ]}
  />)
}


function groupPaymentsPerWeek (payments) {
  const grouped = payments.reduce((acc, payment) => {
    const date = new Date(payment.createdAt);
    const week = getNumberOfWeekOfYear(date);

    const year = date.getFullYear();
    const key = `${week}/${year}`
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(payment);
    return acc;
  }, {});
  return Object.keys(grouped).map((key) => ({
    week: getDatesByWeekNumber(key.split('/')[0]).firstDayOfWeek,
    payments: grouped[key],
  }));
}

function getPaymentsTotal (groupedPayments, flow) {
  return groupedPayments.map((group) => group.payments
    .filter(payment => (payment.flow === flow))
    .reduce((acc, payment) => {
      const amount = payment.flow === 'inflow' ? payment.amount : -payment.amount;
      return acc + amount
    }, 0));
}

function getBalance (groupedPayments) {
  return groupedPayments.map((group) => group.payments
    .reduce((acc, payment) => {
      const amount = payment.flow === 'inflow' ? payment.amount : -payment.amount;
      return acc + amount
    }, 0));
}