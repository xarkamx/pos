import { useQuery } from 'react-query';
import { Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { AppWidgetSummary } from '../../sections/@dashboard/app';
import { ProductsTransaction } from '../../utils/transactions/productsTransaction';
import { CustomTable } from '../../components/tables/Table';
import { Money } from '../../components/Formats/FormatNumbers';
import { CreatedSinceToolTip } from '../../components/label/Label';
import { numberToMoney, reverseIva } from '../../core/helpers';
import { SmartGrid } from '../../components/Containers/SmartGrid';



export function SingleProductPage () {
  const { productId } = useParams();
  const { details, isLoading } = useProductInfo(productId);

  if (isLoading) return <h1>Cargando...</h1>
  const { sales, customers, orders, product } = details;
  return <SmartGrid container spacing={2}>
    <SmartGrid title='General' item xs={12}>
      <ProductHeader
        name={product.name}
        unitPrice={product.price}
        description={product.description}
        image={product.image}
        qty={sales.totalSold}
        total={sales.totalIncome} />
    </SmartGrid>
    <SmartGrid title='Ordenes' item xs={12} sm={6} >
      <OrdersTableList orders={orders} />
    </SmartGrid>
    <SmartGrid item title='Clientes' xs={12} sm={6} >
      <ClientTableList clients={customers} />
    </SmartGrid>
  </SmartGrid>
}


function ProductHeader ({ qty, total, name, unitPrice, description, image }) {
  return <Grid container>
    <Grid item xs={12} md={3}>
      <img src={image} alt={name} style={{ width: '300px' }} />
    </Grid>
    <Grid item xs={12} md={9}>
      <h1>{name}</h1>
      <p>{description}</p>
    </Grid>
    <Grid item xs={12} sm={4}>
      <AppWidgetSummary title="Precio Unitario" total={numberToMoney(unitPrice)} icon={'ant-design:dollar'} color="info" />
    </Grid>
    <Grid item xs={12} sm={4}>
      <AppWidgetSummary title="Vendidos" total={qty} icon={'ant-design:shopping-cart'} color="success" />
    </Grid>
    <Grid item xs={12} sm={4}>
      <AppWidgetSummary title="Ingresos" total={numberToMoney(total)} icon={'ant-design:dollar'} color="warning" />
    </Grid>
  </Grid>

}
function useProductInfo (productId) {
  const service = new ProductsTransaction();
  const resp = useQuery('product', async () => service.getProductInfo(productId));

  return { details: resp.data, isLoading: resp.isLoading };
}

function ClientTableList ({ clients }) {
  const navigation = useNavigate();
  return <CustomTable
    titles={['Nombre', 'RFC', 'Adquiridos', 'Total']}
    content={clients}
    onClick={(item) => {
      if (!item.clientId) return
      navigation(`/dashboard/clientes/${item.clientId}`);
    }}
    format={(item) => [
      item.clientName ?? 'Publico general',
      item.rfc ?? 'N/A',
      item.totalSold,
      <Money number={item.totalIncome} key={`cli-amount-${item.id}`} />
    ]}
  />
}

function OrdersTableList ({ orders }) {
  const navigation = useNavigate();
  return <CustomTable
    titles={['Folio', 'Fecha', 'Cantidad', 'Total', 'IVA']}
    content={orders}
    onClick={(item) => {
      navigation(`/dashboard/ordenes/${item.orderId}`);
    }}
    format={(item) => [
      item.orderId,
      <CreatedSinceToolTip key={`item1-${item.orderId}`} date={item.createdAt} />,
      item.totalSold,
      <Money number={item.totalIncome} key={`order-amount-${item.orderId}`} />,
      <Money number={reverseIva(item.totalIncome)} key={`order-iva-${item.orderId}`} />

    ]}
  />
}