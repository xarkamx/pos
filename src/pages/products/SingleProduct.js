
import { useState } from 'react';

import GridViewIcon from '@mui/icons-material/GridView';
import SellIcon from '@mui/icons-material/Sell';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useQuery } from 'react-query';
import { Button, Grid, List } from '@mui/material';
import { useParams } from 'react-router-dom';
import { AppWidgetSummary } from '../../sections/@dashboard/app';
import { ProductsTransaction } from '../../utils/transactions/productsTransaction';
import { CustomTable } from '../../components/tables/Table';
import { Money } from '../../components/Formats/FormatNumbers';
import { CreatedSinceToolTip } from '../../components/label/Label';
import { numberToMoney, reverseIva } from '../../core/helpers';
import { SmartGrid } from '../../components/Containers/SmartGrid';
import { useNav } from '../../hooks/useNav';
import { BasicMaterialSearch } from '../materials/components/MaterialSelector';
import { useProductsRecipe } from '../materials/hooks/useMaterial';
import { QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { useCState } from '../../hooks/useHooks';



export function SingleProductPage () {
  const { productId } = useParams();
  const { details, isLoading, inventory } = useProductInfo(productId);
  const navigate = useNav();
  if (isLoading) return <h1>Cargando...</h1>
  const { sales, customers, orders, product } = details;
  if (!product) { navigate('/dashboard/productos'); return <h1>Cargando...</h1> }
  return <SmartGrid container spacing={2}>
    <SmartGrid title='General' icon={<GridViewIcon />} item xs={12}>
      <ProductHeader
        name={product.name}
        unitPrice={product.price}
        description={product.description}
        image={product.image}
        qty={sales.totalSold}
        total={sales.totalIncome} />
    </SmartGrid>
    <SmartGrid title='Ordenes' icon={<SellIcon />} item xs={12} sm={6} >
      <h2>Ordenes</h2>
      <OrdersTableList orders={orders} />
    </SmartGrid>
    <SmartGrid item title='Clientes' icon={<PeopleOutlineIcon />} xs={12} sm={6} >
      <h2>Clientes</h2>
      <ClientTableList clients={customers} />


    </SmartGrid>
    <SmartGrid item title='Inventario' icon={<InventoryIcon />} xs={6} >
      <h2>Inventario</h2>
      <InventoryTable inventory={inventory} />
    </SmartGrid>
    <SmartGrid item title='Materiales' icon={<AssignmentIcon />} xs={6} >
      <MaterialsPerProduct productId={productId} />
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
  const inventoryReq = useQuery('inventory', async () => service.getProductHistory(productId));

  return { details: resp.data, isLoading: resp.isLoading, inventory: inventoryReq.data };
}

function ClientTableList ({ clients }) {
  const navigation = useNav();
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
  const navigation = useNav();
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

function MaterialsPerProduct ({ productId }) {
  const { materials, addProduct } = useProductsRecipe(productId);
  return <Grid container spacing={2}>
    <Grid item xs={12}>
      <AddMaterialToProduct onSubmit={
        (materialId, quantity) => {
          addProduct(materialId, productId, quantity);
        }
      } />
    </Grid>
    <Grid item xs={12} >
      <CustomTable titles={['Id', 'Nombre', 'Cantidad', 'Unidad']} content={materials} format={(item) => [
        item.id,
        item.name,
        item.unit,
        item.requiredQuantity
      ]} />
    </Grid>
  </Grid>
}

function AddMaterialToProduct ({ onSubmit }) {

  const loading = false
  const [material, setMaterial] = useState({
    id: null,
    name: null,
    unit: 'g',
  });
  const [materialForm, setMaterialForm] = useCState({
    quantity: 1,
    materialId: null
  });
  return <form title='Agregar Material'
    onSubmit={(ev) => {
      ev.preventDefault();
      onSubmit?.(materialForm.materialId, materialForm.quantity);
    }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <List>
          <BasicMaterialSearch onChange={(material) => {
            setMaterial({
              id: material.id,
              name: material.label,
              unit: material.extras.unit,
            });
            setMaterialForm({
              materialId: material.id
            })
          }} />
        </List>
      </Grid>
      <Grid item xs={4}>
        <QuickFormInput label={`Cantidad en ${material.unit}`} value={setMaterialForm.quantity} onChange={(ev) => {
          setMaterialForm({
            quantity: parseFloat(ev.target.value)
          })
        }} />
      </Grid>
      <Grid item xs={4}>
        <Button variant="text" type='submit'
          disabled={loading}
          style={{
            backgroundColor: !loading ? '#3f51b5' : '#f50057',
            color: 'white',
            height: '100%',
            width: '100%',
          }}>{!loading ? 'Agregar' : 'Espera...'}</Button>
      </Grid>
    </Grid>
  </form>
}

function InventoryTable ({ inventory }) {
  return <CustomTable
    titles={['Cantidad', 'Descripcion', 'Fecha']}
    content={inventory}
    format={(item) => [
      item.quantity,
      dictionary[item.description],
      <CreatedSinceToolTip key={`date-${item.id}`} date={item.createdAt} />
    ]}
  />
}

const dictionary = {
  'purchase': 'Compra',
  'inventory': 'Inventario',
}