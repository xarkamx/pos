import { TextField } from '@mui/material';
import { useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { CustomTable } from '../../../components/tables/Table';
import { monthsSince } from '../../../core/helpers';

export function InventoryTable ({ items = [] }) {
  const [search, setSearch] = useState('');
  const months = monthsSince(new Date('2023-03-01'));
  const filtered = items.filter((item) => {
    const { id, price, quantity } = item;
    const query = search.toLowerCase();
    if (!id) return false;
    return (
      id?.toString().includes(query) ||
      price?.toString().toLowerCase().includes(query) ||
      quantity?.toString().includes(query)
    );
  })
  return (
    <>
      <TextField label="Buscar" variant="outlined" fullWidth onChange={(event) => {
        setSearch(event.target.value)
      }} />
      <CustomTable
        content={filtered}
        titles={['Id', 'Nombre', 'Cantidad', 'Precio', 'Ventas/Mes', 'Proyección']}
        format={(items) => ([
          items.id,
          items.name,
          <span key={`qty-${items.id}`} style={{
            color: items.inStock <= 0 || refillRatio(items.inStock, Math.ceil(items.soldUnits / months)) < 80 ? 'red' : 'green'
          }}>{items.inStock}</span>,
          <Money number={items.unitPrice} key={`price-${items.id}`} />,
          Math.ceil(items.soldUnits / months),
          <Money number={items.unitPrice * items.inStock} key={`projection-${items.id}`} />

        ])}
      />
    </>
  )
}

function refillRatio (qty, sold) {
  return (qty / (sold * 2)) * 100;
}