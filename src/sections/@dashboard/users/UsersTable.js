import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { CustomTable } from '../../../components/tables/Table';

export function UsersTable ({ users = [], onDelete }) {
  const [search, setSearch] = useState('')
  if (search) {
    users = users.filter(user => {
      const searcheable = `${user.name} ${user.email}`
      return searcheable.toLowerCase().includes(search.toLowerCase())
    })
  }
  return (<>
    <TextField label="Buscar" variant="outlined" fullWidth onChange={(ev) => {
      setSearch(ev.target.value)
    }} />
    <CustomTable
      titles={['Nombre', 'Correo', 'Acciones']}
      content={users}
      format={(user) => [
        user.name,
        user.email,
        <Button
          key={`edit-${user.id}`}
          startIcon={< DeleteIcon />}
          color='error'
          variant="text" onClick={async () => {
            await onDelete(user.id)
          }}>Eliminar</Button>
      ]}
    />
  </>
  )
}