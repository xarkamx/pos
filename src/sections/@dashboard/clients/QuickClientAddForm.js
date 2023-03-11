import { Button, ListItem } from '@mui/material';
import { QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { useCState } from '../../../hooks/useHooks';

export function QuickClientForm ({ onSubmit }) {
  const [clientData, setClientData] = useCState({
    rfc: 'XAXX010101000',
    name: '',
    email: '',
    phones: '',
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
          setClientData({ phones: ev.target.value })
        }}
      />
      <ListItem>
        <Button type='submit' variant='contained' fullWidth>Registrar</Button>
      </ListItem>
    </QuickFormContainer>)
}


