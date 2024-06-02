
import { BarChart } from '@mui/x-charts';
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
        type: 'bar',
        fill: 'gradient',
        color: '#4caf50',
        data: inflow,
      },
      {
        name: `Salidas (${numberToMoney(median(outflow))})`,
        type: 'bar',
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


export function StackChart ({ payments, ...props }) {
  if (!payments) {
    return null;
  }
  const inflows = setSeries(payments, 'inflow');
  const outflows = setSeries(payments, 'outflow');
  // reduce payments by month and year
  // add filters by flow, the options must be inflow, outflow, balance
  return <BarChart
    {...props}
    xAxis={[
      { data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], label: 'entradases', scaleType: 'band' }
    ]}
    series={
      [...inflows, ...outflows]
    }
  />
}


function setSeries (payments, flow = 'all') {
  const paymentsPerYear = groupPaymentsPerYear(payments);
  const series = Object.keys(paymentsPerYear).map((year) => {
    const payments = paymentsPerYear[year];
    const data = payments.map((group) => {
      return getPaymentsTotal(group, flow)
    });
    return { data, stack: 'ingresos', label: year }
  });
  return series;
}


function groupPaymentsPerMonth (payments) {
  return payments.reduce((acc, payment) => {
    const month = new Date(payment.createdAt).getMonth();
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(payment);
    return acc;
  }, []);
}

function getPaymentsTotal (groupedPayments, flow) {
  return groupedPayments.filter(payment => (payment.flow === flow || flow === 'all'))
    .reduce((acc, payment) => {
      const amount = payment.flow === 'inflow' ? payment.amount : -payment.amount;
      return acc + amount
    }, 0);
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


function groupPaymentsPerYear (payments) {
  const years = payments.map((payment) => new Date(payment.createdAt).getFullYear());
  const uniqueYears = [...new Set(years)];
  return uniqueYears.map((year) => {
    const paymentsOfYear = payments.filter((payment) => new Date(payment.createdAt).getFullYear() === year);
    return { year, payments: groupPaymentsPerMonth(paymentsOfYear) }
  }).reduce((acc, year) => {
    acc[year.year] = year.payments;
    return acc;
  }, {})
}


// [
//   { data: [3, 4, 1, 6, 5, 1, 4, 9, 10, 11, 11, 31], stack: 'entradas', label: '2023' },
//   { data: [4, 3, 1, 5, 8, 3, 4, 1, 6, 5, 1, 4,], stack: 'entradas', label: '2024' },
//   { data: [3, 4, 1, 6, 5, 1, 4, 9, 10, 11, 11, 31], stack: 'entradas', label: '2025' },
//   { data: [4, 3, 1, 5, 8, 3, 4, 1, 6, 5, 1, 4,], stack: 'entradas', label: '2026' },
//   { data: [-3, -4, -1, -6, -5, -1, -4, -9, -10, -11, -11, -31], stack: 'entradas', label: '2023' },
//   { data: [-4, -3, -1, -5, -8, -3, -4, -1, -6, -5, -1, -4,], stack: 'entradas', label: '2024' },
// ]