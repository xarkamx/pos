
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { IconButton, TextField } from '@mui/material';
import { PaginatedTable } from '../../../components/tables/paginatedTable';
import { DebounceInput } from '../../../components/Inputs/DebounceInput';

export function ClientsTable ({ clients = [], onUpdateClient }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate()
  const filtered = clients.map((client) => ({
    ...client,
    phones: Array.isArray(client.phones) ? client.phones : [client.phones]
  })).filter((client) => {
    const { id, name, rfc, email, phones } = client;
    const query = search.toLowerCase();
    return (
      id.toString().includes(query) ||
      name.toLowerCase().includes(query) ||
      rfc.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      phones.join(',').toLowerCase().includes(query)
    );
  })
  return (
    <>
      <TextField label="Buscar" variant="outlined" fullWidth onChange={(event) => {
        setSearch(event.target.value)
      }} />
      <PaginatedTable
        items={filtered}
        titles={['Id', 'Nombre', 'RFC', 'Teléfonos', 'Email', 'Facturable', 'Codigo Postal', 'Acciones']}
        format={(client) => ([
          client.id,
          <DebounceInput key={`name-${client.id}`} label="Nombre" variant="standard" value={client.name}
            onChange={(ev) => {
              onUpdateClient({ id: client.id, client: { name: ev.target.value.toUpperCase() } })
            }}
          />,
          <DebounceInput key={`rfc-${client.id}`} label="RFC" variant="standard" value={client.rfc}
            onChange={(ev) => {
              onUpdateClient({ id: client.id, client: { rfc: ev.target.value.toUpperCase() } })
            }}
          />,
          client.phones.join(', ') || 'N/A',
          <a href={`mailto:${client.email}`} key={`mail-${client.id}`}>
            {client.email}
          </a>,
          client.legal,
          <DebounceInput key={`rfc-${client.id}`} label="Codigo Postal" variant="standard" value={client.postal_code}
            onChange={(ev) => {
              onUpdateClient({ id: client.id, client: { postal_code: ev.target.value.toUpperCase() } })
            }}
          />,
          <IconButton key={`edit-${client.id}`} onClick={() => {
            navigate(`/dashboard/clientes/${client.id}`)
          }} >
            <EditIcon />
          </IconButton>
        ])}
      />
    </>
  )
}