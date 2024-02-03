import { median, numberToMoney } from '../../../core/helpers';

import AppWebChart from '../app/AppWebsiteVisits';

export function PaymentChart ({ payments }) {
  if (!payments) {
    return null;
  }
  const groupedPayments = groupPaymentsPerMonth(payments);
  const dates = groupedPayments.map((group) => group.createdAt);

  const balance = getBalance(groupedPayments)
  const inflow = getPaymentsTotal(groupedPayments, 'inflow');
  const outflow = getPaymentsTotal(groupedPayments, 'outflow');
  return (<AppWebChart
    title="Pagos"
    chartLabels={dates}
    chartData={[
      {
        name: `Entradas (${numberToMoney(median(inflow))})`,
        type: 'area',
        fill: 'gradient',
        color: '#4caf50',
        data: inflow,
      },
      {
        name: `Salidas (${numberToMoney(median(outflow))})`,
        type: 'area',
        fill: 'gradient',
        color: '#f44336',
        data: outflow,
      },
      {
        name: 'Total',
        type: 'line',
        fill: 'solid',
        color: '#f57c00',
        data: getTotal(balance),
      },
      {
        name: `Balance (${numberToMoney(median(balance))})`,
        type: 'line',
        fill: 'solid',
        color: '#90caf9',
        data: balance,
      },
    ]}
  />)
}


function groupPaymentsPerMonth (payments) {
  payments = payments.map((payment) => {
    const date = new Date(payment.createdAt);
    return { ...payment, createdAt: `${date.getFullYear()}/${date.getMonth() + 1}/01` }
  })
  return payments.reduce((acc, payment) => {
    const index = acc.findIndex((group) => group.createdAt === payment.createdAt);
    if (index === -1) {
      acc.push({ createdAt: payment.createdAt, payments: [payment] });
    } else {
      acc[index].payments.push(payment);
    }
    return acc;
  }, []);
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