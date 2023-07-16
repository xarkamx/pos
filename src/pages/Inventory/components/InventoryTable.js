import { TextField } from '@mui/material';
import { useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { CustomTable } from '../../../components/tables/Table';

export function InventoryTable ({ items = [] }) {
  const [search, setSearch] = useState('');
  const filtered = items.filter((item) => {
    const { id, price, quantity } = item;
    const query = search.toLowerCase();
    if (!id) return false;
    return (
      id?.toString().includes(query) ||
      price.toString().toLowerCase().includes(query) ||
      quantity.toString().includes(query)
    );
  })
  return (
    <>
      <TextField label="Buscar" variant="outlined" fullWidth onChange={(event) => {
        setSearch(event.target.value)
      }} />
      <CustomTable
        content={filtered}
        titles={['Id', 'Nombre', 'Cantidad', 'Precio', 'Proyección']}
        format={(items) => ([
          items.id,
          items.name,
          <span key={`qty-${items.id}`} style={{
            color: items.quantity < 0 ? 'red' : 'green'
          }}>{items.quantity}</span>,
          <Money number={items.price} key={`price-${items.id}`} />,
          <Money number={items.price * items.quantity} key={`projection-${items.id}`} />

        ])}
      />
    </>
  )
}