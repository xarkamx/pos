import { Button, TextField } from '@mui/material';
import { CustomTable } from '../../../components/tables/Table';

export function UsersTable ({ users = [] }) {
  return (<>
    <TextField label="Buscar" variant="outlined" fullWidth />
    <CustomTable
      titles={['Nombre', 'Correo', 'Acciones']}
      content={users}
      format={(user) => [
        user.name,
        user.email,
        <>
          <Button variant='contained' color='primary' size='small' onClick={() => { }}>Editar</Button>
        </>
      ]}
    />
  </>
  )
}