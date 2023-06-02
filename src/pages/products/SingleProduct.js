// import { useQuery } from 'react-query';

// import { useParams } from 'react-router-dom';
// import { median, numberToMoney, getDatesByWeekNumber, getNumberOfWeekOfYear } from '../../core/helpers';
// import { useStats } from '../../hooks/useStats';
// import AppWebChart from '../../sections/@dashboard/app/AppWebsiteVisits';
// import { InfoTransaction } from '../../utils/transactions/infoTransaction';

// export function SingleProductPage () {
//   const { productId } = useParams();
//   // const { items } = useItems(productId);
//   return <></>
//   //   return <>
//   // <AppWebChart
//   //     title="Producto"
//   //     chartLabels={dates}
//   //     chartData={[
//   //       {
//   //         name: `Entradas (${numberToMoney(median(inflow))})`,
//   //         type: 'area',
//   //         fill: 'gradient',
//   //         color: '#4caf50',
//   //         data: inflow,
//   //       },
//   //       {
//   //         name: `Salidas (${numberToMoney(median(outflow))})`,
//   //         type: 'area',
//   //         fill: 'gradient',
//   //         color: '#f44336',
//   //         data: outflow,
//   //       },
//   //       {
//   //         name: 'Total',
//   //         type: 'line',
//   //         fill: 'solid',
//   //         color: '#f57c00',
//   //         data: getTotal(balance),
//   //       },
//   //       {
//   //         name: `Balance (${numberToMoney(median(balance))})`,
//   //         type: 'line',
//   //         fill: 'solid',
//   //         color: '#90caf9',
//   //         data: balance,
//   //       },
//   //     ]}
//   //   /></>
// }


// function useItems (id) {
//   const service = new InfoTransaction();
//   const items = useQuery('items', () => service.getItemsList(id));
//   const { data } = items;
//   const currentWeek = getNumberOfWeekOfYear(new Date());
//   const totals = data?.reduce((acc, item) => {
//     acc.total += item.total;
//     acc.qty += item.qty;
//     return acc;
//   }, { total: 0, qty: 0 });
//   const dates = [];

//   const groupedItems = {};
//   data?.forEach(item => {
//     const date = new Date(item.createdAt);
//     const year = date.getFullYear();
//     const week = getNumberOfWeekOfYear(date);
//     groupedItems[`${week}/${year}`] = item;
//     dates.push(getDatesByWeekNumber(week).firstDayOfWeek);
//   });

//   return { totalEarned: totals?.total, totalQty: totals?.qty, groupedItems, dates };
// }


// function getTotalPerGroup (group, totals) {
//   const amount = group.reduce((acc, item) => {
//     acc.total += item.total;
//     acc.qty += item.qty;
//     return acc;
//   }, { total: 0, qty: 0 });
//   return {
//     ...amount,
//     qtyPercentage: (amount.qty / totals.qty) * 100,
//     totalPercentage: (amount.total / totals.total) * 100,
//   }
// }