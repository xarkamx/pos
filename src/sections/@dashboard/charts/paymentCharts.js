import { getDatesByWeekNumber, getNumberOfWeekOfYear } from '../../../core/helpers';

import AppWebChart from '../app/AppWebsiteVisits';

export function PaymentChart ({ payments }) {
  if (!payments) {
    return null;
  }
  const groupedPayments = groupPaymentsPerWeek(payments);
  const dates = groupedPayments.map((group) => group.week.toISOString());
  const balance = getBalance(groupedPayments)

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
        name: 'Total',
        type: 'line',
        fill: 'solid',
        color: '#f57c00',
        data: getTotal(balance),
      },
      {
        name: 'Balance',
        type: 'line',
        fill: 'solid',
        color: '#90caf9',
        data: balance,
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
  })).sort((a, b) => a.week - b.week);
}

function getPaymentsTotal (groupedPayments, flow) {
  return groupedPayments.map((group) => group.payments
    .filter(payment => (payment.flow === flow || flow === 'all'))
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

function getTotal (balance) {
  const total = [];
  balance.forEach((amount, index) => {
    if (index === 0) {
      total.push(amount);
    } else {
      total.push(total[index - 1] + amount);
    }
  });
  return total
}