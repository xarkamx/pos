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
import { StackChart } from '../sections/@dashboard/charts/paymentCharts';
import { ConditionalWall } from '../components/FilterWall/ConditionalWall';
import { SiapaCards } from '../sections/@dashboard/siapa/SiapaCards';

// ----------------------------------------------------------------------

export default function DashboardAppPage () {
  const { products, summary, debtors } = useStats();
  const navigate = useNavigate();
  const { payments } = usePayments();
  return (
    <>
      <Helmet>
        <title> Dashboard | HG </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hola!
        </Typography>

        <Grid container spacing={3}>
          <ConditionalWall condition={!summary.isLoading} or={
            <div>
              <Typography variant='h2'>
                Cargando...
              </Typography>
            </div>
          }>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Clientes" total={summary.data?.clients} icon={'ant-design:user'} onClick={() => {
                navigate('/dashboard/clientes')
              }} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                onClick={() => {
                  navigate('/dashboard/ordenes?filter=paid')
                }}
                title="Ingresos" total={<Money number={summary.data?.earnings} />} color="success" icon={'ant-design:dollar'} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                onClick={() => {
                  navigate('/dashboard/ordenes')
                }}
                title="Notas" total={summary.data?.orders} color="warning" icon={'ant-design:file-done'} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                onClick={() => {
                  navigate('/dashboard/productos')
                }}
                title="Productos" total={summary.data?.products} color="error" icon={'ant-design:shopping-cart'} />
            </Grid>
          </ConditionalWall>
          <Grid item xs={12} md={6} lg={8}>
            <StackChart payments={payments} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ConditionalWall condition={!debtors.isLoading} >
              <AppConversionRates
                title="Deudores"
                subheader="Deudas al dia de hoy"
                chartData={debtors.data?.map((item) => ({ label: item.name, value: item.debt, href: `/dashboard/clientes/${item.clientId}` }))}
              />
            </ConditionalWall>
          </Grid>

          <SiapaCards />
          <Grid item xs={12} md={6}  >
            <ConditionalWall condition={!products.isLoading} >
              <AppConversionRates
                title="Productos mas vendidos"
                subheader=""
                chartData={products.data?.map((item) => ({ label: item.name, value: item.qty }))}
              />
            </ConditionalWall>
          </Grid>
          <Grid item xs={12} md={6} >
            <ConditionalWall condition={!products.isLoading} >
              <AppConversionRates
                title="Productos con mas ingresos"
                subheader=""
                chartData={products.data?.map((item) => ({ label: item.name, value: item.total }))}
              />
            </ConditionalWall>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
