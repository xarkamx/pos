import { TextField } from '@mui/material';
import { useState } from 'react';
import { PaginatedTable } from '../../../components/tables/paginatedTable';
import { Money } from '../../../components/Formats/FormatNumbers';

export function InventoryTable ({ items = [] }) {
  const [search, setSearch] = useState('');

  const filtered = items.filter((item) => {
    const { id, externalId, price, quantity } = item;
    const query = search.toLowerCase();
    return (
      id.toString().includes(query) ||
      externalId.toLowerCase().includes(query) ||
      price.toLowerCase().includes(query) ||
      quantity.toString().includes(query)
    );
  })
  return (
    <>
      <TextField label="Buscar" variant="outlined" fullWidth onChange={(event) => {
        setSearch(event.target.value)
      }} />
      <PaginatedTable
        items={filtered}
        titles={['Id', 'Nombre', 'Cantidad', 'Precio', 'Proyección']}
        format={(items) => ([
          items.id,
          items.name,
          items.quantity,
          <Money number={items.price} key={`price-${items.id}`} />,
          <Money number={items.price * items.quantity} key={`projection-${items.id}`} />

        ])}
      />
    </>
  )
}