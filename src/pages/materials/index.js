
import { useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, IconButton, ListItem, MenuItem, TextField } from '@mui/material';
import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { SmartGrid } from '../../components/Containers/SmartGrid';
import { CustomTable } from '../../components/tables/Table';
import { BasicProductSearch } from '../../sections/@dashboard/products/ProductSearchInput';
import { useMaterial, useMaterialProducts } from './hooks/useMaterial';
import { useCState } from '../../hooks/useHooks';

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
  const { childProducts, materialDetails, addProduct, delProduct } = useMaterialProducts(materialId)
  return <SmartGrid container spacing={2}>
    <SmartGrid title='Productos' item xs={12} >
      <ProductListForm material={materialDetails}
        onDelete={delProduct}
        onSubmit={addProduct}
        childProducts={
          childProducts
        } />
    </SmartGrid>
  </SmartGrid>

}

function MaterialForm ({ onSubmit }) {
  const [loading, setLoading] = useState(false)

  const [material, setMaterial] = useCState({
    name: '',
    unit: 'g',
  })


  return <QuickFormContainer title='Insumos' onSubmit={() => {
    setLoading(true)
    onSubmit(material)
    setLoading(false)
  }}>
    <QuickFormInput fullWidth label='Nombre' value={material.name} onChange={(ev) => {
      setMaterial({ name: ev.target.value })
    }} />
    <ListItem>
      <TextField fullWidth label='Unidad' select value={material.unit} onChange={(ev) => {
        setMaterial({ unit: ev.target.value })
      }}>
        <MenuItem value='kg'>Kilogramos</MenuItem >
        <MenuItem value='g'>Gramos</MenuItem >
        <MenuItem value='u'>Unidad</MenuItem >
      </TextField>
    </ListItem>
    <QuickFormButton
      disabled={loading}
      type='submit'
      variant='contained'
      color='primary'
      fullWidth
    >Guardar</QuickFormButton>
  </QuickFormContainer>
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
          titles={['Producto', 'Cantidad', 'Unidad', 'Acciones']}
          content={childProducts}
          format={(item) => [item.productName, item.requiredQuantity, item.unit, <IconButton
            color='error'
            key={`del-${item.id}`}
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              await onDelete(material.id, item.id)
              setLoading(false)
            }} >
            <DeleteIcon />
          </IconButton>]}
        />
      </Grid>
    </Grid>
  </QuickFormContainer>
}

const dictionary = {
  g: 'Gramos',
  kg: 'Kilogramos',
}