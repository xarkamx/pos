import { Button, ListItem } from '@mui/material';
import { QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { useCState } from '../../../hooks/useHooks';
import { TaxSystem } from './TaxSystemInput';

export function QuickClientForm ({ onSubmit }) {
  const defaultContent = {
    rfc: 'XAXX010101000',
    name: '',
    email: '',
    phones: '',
    postal_code: '',
    tax_system: '612'
  }
  const [clientData, setClientData] = useCState(defaultContent)
  return (
    <QuickFormContainer title={'Registro de clientes'} onSubmit={(ev) => {
      onSubmit(clientData)
      ev.target.reset()
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
          setClientData({ tax_system: val.value })
        }}
      />
      <ListItem>
        <Button type='submit' variant='contained' fullWidth>Registrar</Button>
      </ListItem>
    </QuickFormContainer>)
}


