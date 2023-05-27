import { Autocomplete, Button, ListItem } from '@mui/material';
import { QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { useCState } from '../../../hooks/useHooks';
import { taxSystem } from '../../../config/constants';

export function QuickClientForm ({ onSubmit }) {
  const [clientData, setClientData] = useCState({
    rfc: 'XAXX010101000',
    name: '',
    email: '',
    phones: '',
    postal_code: '',
    tax_system: { value: '612' }
  })
  return (
    <QuickFormContainer title={'Registro de clientes'} onSubmit={() => {
      onSubmit(clientData)
    }}>
      <QuickFormInput label='RFC'
        fullWidth
        pattern={'[A-Z]{4}[0-9]{6}[A-Z0-9]{3}'}
        onChange={(ev) => {
          setClientData({ rfc: ev.target.value.toUpperCase() })
        }}
      />
      <QuickFormInput label='Nombre' fullWidth
        onChange={(ev) => {
          setClientData({ name: ev.target.value.toUpperCase() })
        }}
      />
      <QuickFormInput label='Email' fullWidth
        onChange={(ev) => {
          setClientData({ email: ev.target.value.toLowerCase() })
        }}
      />
      <QuickFormInput label='Telefonos' fullWidth
        pattern={'[0-9]{10}(,[0-9]{10})*'}
        onChange={(ev) => {
          const phones = ev.target.value.split(',').map((phone) => phone.trim())
          setClientData({ phones: JSON.stringify(phones) })
        }}
      />
      <QuickFormInput label='Codigo Postal' fullWidth
        pattern={'[0-9]{5}'}
        onChange={(ev) => {
          setClientData({ postal_code: ev.target.value })
        }}
      />
      <TaxSystem
        onChange={(val) => {
          setClientData({ tax_system: val })
        }}
      />
      <ListItem>
        <Button type='submit' variant='contained' fullWidth>Registrar</Button>
      </ListItem>
    </QuickFormContainer>)
}


function TaxSystem ({ onChange }) {
  const [value, setValue] = useCState({ label: 'Personas Físicas con Actividades Empresariales y Profesionales', value: '612' })
  const ts = Object.keys(taxSystem)
  return <Autocomplete
    options={ts.map(k => ({ label: taxSystem[k], value: k }))}
    label='Regimen Fiscal'
    fullWidth
    isOptionEqualToValue={(option, value) => option.value === value.value}
    value={value}
    onChange={(ev, value) => {
      setValue(value)
      onChange(value)
    }}
    renderInput={(params) => <QuickFormInput {...params} label='Regimen Fiscal' fullWidth />}
  />
}