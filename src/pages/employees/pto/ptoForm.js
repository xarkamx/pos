import { FormControl, InputLabel, ListItem, MenuItem, Select } from '@mui/material'
import { validInputDate, addDays } from 'afio/src/core/helpers'
import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer'
import { useCState } from '../../../hooks/useHooks'
import { usePopUp } from '../../../context/PopUpContext'


export function PTOForm ({ onSubmit }) {
  const { popUpAlert } = usePopUp()
  const [pto, setPTO] = useCState({
    type: '',
    startDate: validInputDate(new Date()),
    endDate: validInputDate(addDays(new Date(), 1))
  })
  return (
    <QuickFormContainer
      title='PTO' onSubmit={async () => {
        if (validatePto(pto.startDate, pto.endDate)) {
          await onSubmit(pto)
        } else {
          popUpAlert('error', 'La fecha de fin debe ser mayor a la de inicio y durar al menos 1 día')
        }
      }}>
      <ListItem>
        <PTOTypeSelect
          type={pto.type}
          onChange={(ev) => {
            setPTO({ type: ev })
          }}
        />
      </ListItem>
      <QuickFormInput
        value={pto.startDate}
        fullWidth label="Fecha de Inicio" type='date' onChange={(ev) => {
          setPTO({ startDate: ev.target.value })
        }} />
      <QuickFormInput
        value={pto.endDate}
        fullWidth label="Fecha de Fin" type='date' onChange={(ev) => {
          setPTO({ endDate: ev.target.value })
        }} />
      <QuickFormButton
        variant='contained'
        fullWidth
        type='submit'>Agregar PTO</QuickFormButton>
    </QuickFormContainer>
  )
}


function validatePto (startDate, endDate) {
  // must be more than 1 day
  const sd = new Date(startDate).getTime()
  const ed = new Date(endDate).getTime()
  return [
    sd < ed,
    ed - sd > 86400000
  ].every(Boolean)
}

function PTOTypeSelect ({ type, onChange }) {
  return (<FormControl
    style={{
      marginBottom: '1rem'
    }}
    fullWidth>
    <InputLabel id="payment-type-label">Tipo</InputLabel>
    <Select value={type}
      labelId="payment-type-label"
      id="payment-type-select" fullWidth
      onChange={(ev) => {
        onChange(ev.target.value)
      }}
    >
      <MenuItem value='vacation'>Vacaciones</MenuItem>
      <MenuItem value='sick'>Enfermedad</MenuItem>
    </Select>
  </FormControl>)
}