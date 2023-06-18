import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';
// sections
import {
  AppWidgetSummary,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { useStats } from '../hooks/useStats';
import { Money } from '../components/Formats/FormatNumbers';
import { usePayments } from '../hooks/usePayments';
import { PaymentChart } from '../sections/@dashboard/charts/paymentCharts';

// ----------------------------------------------------------------------

export default function DashboardAppPage () {
  const { products, summary, debtors } = useStats();
  const navigate = useNavigate();
  const { payments } = usePayments();
  if (summary.isLoading) return null;
  if (products.isLoading) return null;
  if (debtors.isLoading) return null;
  if (!payments) return null;
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Clientes" total={summary.data.clients} icon={'ant-design:user'} onClick={() => {
              navigate('/dashboard/clientes')
            }} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              onClick={() => {
                navigate('/dashboard/ordenes?filter=paid')
              }}
              title="Ingresos" total={<Money number={summary.data.earnings} />} color="success" icon={'ant-design:dollar'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              onClick={() => {
                navigate('/dashboard/ordenes')
              }}
              title="Notas" total={summary.data.orders} color="warning" icon={'ant-design:file-done'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              onClick={() => {
                navigate('/dashboard/productos')
              }}
              title="Productos" total={summary.data.products} color="error" icon={'ant-design:shopping-cart'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <PaymentChart payments={payments} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid> */}
          <Grid item xs={12} md={6} lg={4}>
            <AppConversionRates
              title="Deudores"
              subheader="Deudas al dia de hoy"
              chartData={debtors.data.map((item) => ({ label: item.name, value: item.debt, href: `/dashboard/clientes/${item.clientId}` }))}
            />
          </Grid>
          <Grid item xs={12} md={6}  >
            <AppConversionRates
              title="Productos mas vendidos"
              subheader=""
              chartData={products.data.map((item) => ({ label: item.name, value: item.qty }))}
            />
          </Grid>
          <Grid item xs={12} md={6} >
            <AppConversionRates
              title="Productos con mas ingresos"
              subheader=""
              chartData={products.data.map((item) => ({ label: item.name, value: item.total }))}
            />
          </Grid>



          {/* 
          <Grid item xs={12} md={6}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
