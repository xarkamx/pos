
import { Autocomplete, ListItem, ListItemText, TextField } from '@mui/material';
import { useClients, useMiddlemanClients } from '../../../hooks/useClients';

// propTypes
export function ClientsSearchInput ({ onSubmit }) {
  const { clients } = useClients();
  const options = (clients || []).map((client) => ({
    id: client.id,
    label: client.name,
    name: client.name,
    phone: client.phone,
    email: client.email,
    rfc: client.rfc,
  }));

  return (<Autocomplete
    disablePortal
    fullWidth
    id="combo-box-search-product"
    options={options}
    renderOption={RenderedListItem}
    isOptionEqualToValue={(option, value) => option.id === value.id}
    onChange={(ev, nv) => {
      if (!nv?.id) return;
      onSubmit(nv)
    }}
    renderInput={(params) => <TextField {...params} label="Clientes" />} />)
}

function RenderedListItem (props, option) {
  return <ListItem {...props} sx={
    {
      '&:hover': {
        backgroundColor: 'lightgray',
      },
      cursor: 'pointer',
    }
  }>
    <ListItemText primary={option.name} secondary={option.rfc} />
  </ListItem>
}

export function MiddlemanClientsSearchInput ({ onSubmit }) {
  const { clients } = useMiddlemanClients();
  const options = (clients || []).map((client) => ({
    id: client.id,
    label: client.name,
    name: client.name,
    phone: client.phone,
    email: client.email,
    rfc: client.rfc,
  }));
  return (<Autocomplete
    disablePortal
    fullWidth
    id="combo-box-search-product"
    options={options || []}
    renderOption={RenderedListItem}
    isOptionEqualToValue={(option, value) => option.id === value.id}
    onChange={(ev, nv) => {
      if (!nv?.id) return;
      onSubmit(nv)
    }}
    renderInput={(params) => <TextField {...params} label="Clientes" />} />)

}