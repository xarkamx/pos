
import { useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, IconButton, TextField } from '@mui/material';
import { QuickFormContainer } from '../../components/Containers/QuickFormContainer';
import { SmartGrid, SmartTab } from '../../components/Containers/SmartGrid';
import { CustomTable } from '../../components/tables/Table';
import { BasicProductSearch } from '../../sections/@dashboard/products/ProductSearchInput';
import { useMaterial, useMaterialProducts } from './hooks/useMaterial';
import { useCState } from '../../hooks/useHooks';
import { MaterialForm } from './components/materialForm';
import { Money } from '../../components/Formats/FormatNumbers';
import { CreatedSinceToolTip } from '../../components/label/Label';
import { kValues } from '../../core/helpers';

export function MaterialsPage () {
  const { materials, addMaterial } = useMaterial()
  return (
    <SmartGrid container spacing={2}>
      <SmartGrid title='Agregar Material' item xs={12} md={4} >
        <MaterialForm onSubmit={addMaterial} />
      </SmartGrid>
      <SmartGrid title='Lista de materiales' item xs={12} md={8} >
        <MaterialTable materials={materials} />
      </SmartGrid>
    </SmartGrid>
  )
}

export function MaterialOverview () {
  const { materialId } = useParams()
  const { childProducts, materialDetails, addProduct, updateMaterial, delProduct } = useMaterialProducts(materialId)
  return <SmartTab container spacing={2}>
    <SmartTab title='Detalles' item xs={4} >
      <MaterialForm {...materialDetails} onSubmit={(values) => {
        updateMaterial(materialId, values)
      }} />
    </SmartTab>

    <SmartTab
      title='Inventario'
      icon={<InventoryIcon />}
      item xs={8} >
      <CustomTable titles={['Fecha', 'Cantidad']} content={materialDetails.inventory} format={(i) => [
        <CreatedSinceToolTip date={i.createdAt} key={`${i.id}-date`} />,
        kValues(i.quantity),
      ]} />
    </SmartTab>
    <SmartTab
      title='Productos'
      icon={<DashboardIcon />}
      item xs={12} >
      <ProductListForm material={materialDetails}
        onDelete={delProduct}
        onSubmit={addProduct}
        childProducts={
          childProducts
        } />
    </SmartTab>
  </SmartTab>

}


export function MaterialTable ({ materials }) {
  const navigate = useNavigate()
  return <CustomTable
    titles={['Id', 'Nombre', 'Unidad', 'Acciones']}
    content={materials}
    format={(item) => [
      item.id,
      item.name,
      item.unit,

      <IconButton key={`edit-${item.id}`} onClick={() => {
        navigate(`/dashboard/insumos/${item.id}`)
      }} >
        <RemoveRedEyeIcon />
      </IconButton>
    ]}
  />
}

function ProductListForm ({
  material,
  childProducts,
  onSubmit,
  onDelete,
}) {
  const materialType = material?.unit || 'g'
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useCState({
    productId: null,
    quantity: '',
  })
  return <QuickFormContainer title={
    `Insumo: ${material?.name || 'No seleccionado'}`
  } sx={{
    display: 'flex',
    flexFlow: 'column wrap',
    gap: '1rem',
    justifyContent: 'center',
  }}
    onSubmit={async () => {
      setLoading(true)
      await onSubmit(material.id, product.productId, product.quantity)
      setLoading(false)
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <BasicProductSearch onChange={(ev) => {
          setProduct({ productId: ev?.id })
        }} />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField fullWidth label={dictionary[materialType]}
          type='number'
          value={product.quantity}
          onChange={(ev) => {
            setProduct({ quantity: ev.target.value })
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Button variant="text" type='submit'
          disabled={loading}
          style={{
            backgroundColor: !loading ? '#3f51b5' : '#f50057',
            color: 'white',
            height: '100%',
            width: '100%',
          }}>{!loading ? 'Agregar' : 'Espera...'}</Button>
      </Grid>
      <Grid item xs={12}>
        <CustomTable
          titles={['Producto', 'Cantidad', 'Unidad', 'Precio', 'Acciones']}
          content={childProducts}
          format={(item) => {
            const amount = item.requiredQuantity * material.price
            return [
              item.productName,
              item.requiredQuantity,
              item.unit,
              <Money number={amount} key={`${item.id}-amount`} />, <IconButton
                color='error'
                key={`del-${item.id}`}
                disabled={loading}
                onClick={async () => {
                  setLoading(true)
                  await onDelete(material.id, item.id)
                  setLoading(false)
                }} >
                <DeleteIcon />
              </IconButton>]
          }}
        />
      </Grid>
    </Grid>
  </QuickFormContainer>
}

const dictionary = {
  g: 'Gramos',
  kg: 'Kilogramos',
}