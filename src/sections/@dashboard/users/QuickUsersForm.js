import { Autocomplete, Button, ListItem } from '@mui/material';
import { QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { useCState } from '../../../hooks/useHooks';
import { useValidate } from '../../../hooks/useValidate';

export function QuickUsersForm ({ onSubmit }) {
  const [userData, setUserData] = useCState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
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
      <RoleSelector value={
        userData.role
      } onChange={(role) => (setUserData({ role }))} />
      <ListItem>
        <Button type='submit' variant='contained' fullWidth>Registrar</Button>
      </ListItem>
    </QuickFormContainer>
  )
}

function RoleSelector ({ onChange, value }) {
  const roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Cajero', value: 'cashier' },
    { label: 'Almacenista', value: 'storer' },
  ]
  return (
    <Autocomplete
      value={value}
      fullWidth options={roles} onChange={(ev, item) => {
        onChange(item.value)
      }}
      renderInput={(params) => (
        <QuickFormInput {...params} label='Rol' required />
      )}
    />
  )
}