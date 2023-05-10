import { Button, ListItem, Select } from '@mui/material';
import { QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { useCState } from '../../../hooks/useHooks';
import { useValidate } from '../../../hooks/useValidate';

export function QuickUsersForm ({ onSubmit }) {
  const [userData, setUserData] = useCState({
    name: '',
    email: '',
    password: '',
  })
  const { validate } = useValidate({
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3 },
      email: { type: 'string' },
      password: { type: 'string', minLength: 6 },
    },
  })
  return (
    <QuickFormContainer title='Registro de empleados' onSubmit={() => {
      if (validate(userData)) onSubmit(userData)
    }}>
      <QuickFormInput label='Nombre' required fullWidth onChange={(ev) => {
        setUserData({ name: ev.target.value })
      }} />
      <QuickFormInput label='Email' type='email' fullWidth required onChange={(ev) => (setUserData({ email: ev.target.value }))} />
      <QuickFormInput label='Contraseña' type='password' required fullWidth onChange={(ev) => (setUserData({ password: ev.target.value }))} />
      <ListItem>
        <Select fullWidth>
          <option value=''>Seleccione un rol</option>
          <option value='cashier'>Cajero</option>
          <option value='storer'>Almacenista</option>
        </Select>
      </ListItem>
      <ListItem>
        <Button type='submit' variant='contained' fullWidth>Registrar</Button>
      </ListItem>
    </QuickFormContainer>
  )
}