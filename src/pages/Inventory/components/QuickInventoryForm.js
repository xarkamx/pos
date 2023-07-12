import { useState } from 'react'
import { Autocomplete, Button, ListItem, TextField } from '@mui/material'
import { QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer'
import { useCState } from '../../../hooks/useHooks'
import { BasicProductSearch } from '../../../sections/@dashboard/products/ProductSearchInput'
import { useValidate } from '../../../hooks/useValidate'
import { usePopUp } from '../../../context/PopUpContext'


export function QuickInventoryForm ({
  onSubmit
}) {
  const { popUpAlert } = usePopUp()
  const { validate, errors } = useValidate({
    type: 'object',
    required: ['external_id', 'qty'],
    properties: {
      external_id: {
        type: 'number',
        errorMessage: 'Debe seleccionar un producto',
      },
      qty: {
        type: 'number',
        errorMessage: 'Debe ser un numero valido',
      }
    }

  })
  const [inventoryData, setInventoryData] = useCState({})
  return <QuickFormContainer title={'Registro de inventario'} onSubmit={() => {
    if (!validate(inventoryData)) {
      popUpAlert('error', errors.external_id || errors.qty);
      return;
    }
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
        setInventoryData({ qty: parseInt(ev.target.value, 10) })
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