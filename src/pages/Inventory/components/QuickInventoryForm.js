import { useState } from 'react'
import { Autocomplete, Button, ListItem, TextField } from '@mui/material'
import { QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer'
import { useCState } from '../../../hooks/useHooks'
import { BasicProductSearch } from '../../../sections/@dashboard/products/ProductSearchInput'


export function QuickInventoryForm ({
  onSubmit
}) {
  const [inventoryData, setInventoryData] = useCState({})
  return <QuickFormContainer title={'Registro de inventario'} onSubmit={() => {
    onSubmit({
      id: inventoryData.external_id,
      type: 'product',
      qty: inventoryData.qty
    })
  }}>

    <SelectProduct
      onChange={(ev) => {
        setInventoryData({ external_id: ev.id })
      }}
    />

    <QuickFormInput label='Cantidad'
      fullWidth
      type='number'
      onChange={(ev) => {
        setInventoryData({ qty: ev.target.value })
      }}
    />

    <ListItem>
      <Button type='submit' variant='contained' fullWidth>Registrar</Button>
    </ListItem>
  </QuickFormContainer>
}

export function SelectType ({ onChange }) {
  const [type, setType] = useState('');
  return <ListItem>
    <Autocomplete
      label='Tipo'
      value={type}
      isOptionEqualToValue={(option, value) => option.value === value}
      onChange={(ev, val) => {
        setType(val);
        onChange(val);
      }}
      fullWidth
      options={[
        { label: 'Producto', value: 'product' },
        { label: 'Material', value: 'material' },
        { label: 'Maquinaria', value: 'machine' },
      ]}
      renderInput={(params) => <TextField {...params} label='Tipo' />}
    />
  </ListItem>
}

export function SelectProduct ({ onChange }) {
  return <ListItem>
    <BasicProductSearch onChange={onChange} />
  </ListItem>
}