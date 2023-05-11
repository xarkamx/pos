
import { useState } from 'react';
import { TextField } from '@mui/material';
import { CustomTable } from '../../../components/tables/Table';

export function UsersTable ({ users = [] }) {
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
        <>

        </>
      ]}
    />
  </>
  )
}