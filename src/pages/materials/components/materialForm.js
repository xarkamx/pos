import { useEffect, useState } from 'react'
import { ListItem, MenuItem, TextField } from '@mui/material'
import { useCState } from '../../../hooks/useHooks'
import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer'

export function MaterialForm ({ onSubmit, name = '', unit = 'g', description = '', price = 0 }) {
  const [loading, setLoading] = useState(false)

  const [material, setMaterial] = useCState({
    name,
    unit,
    description,
    price
  })
  useEffect(() => {
    setMaterial({ name, unit, description, price })
  }, [name, unit, description, price, setMaterial])


  return <QuickFormContainer sx={{
    padding: '1rem',
    gap: '1rem',
    maxWidth: '80%',
    with: '600px',
    margin: 'auto',
  }} title='Material' onSubmit={() => {
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
    <QuickFormInput fullWidth label='Descripcion' value={material.description} onChange={(ev) => {
      setMaterial({ description: ev.target.value })
    }} />
    <QuickFormInput
      fullWidth
      label='Precio'
      type='number'
      value={material.price}
      inputProps={{ step: 0.001, min: 0 }}
      onChange={(ev) => {
        setMaterial({ price: ev.target.value })
      }} />

    <QuickFormButton
      disabled={loading}
      type='submit'
      variant='contained'
      color='primary'
      fullWidth
    >Guardar</QuickFormButton>
  </QuickFormContainer>
}