import { TextField } from '@mui/material';
import { useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { CustomTable } from '../../../components/tables/Table';
import { monthsSince } from '../../../core/helpers';

export function InventoryTable ({ items = [] }) {
  const [search, setSearch] = useState('');
  const months = monthsSince(new Date('2023-03-01'));
  const filtered = items.filter((item) => {
    const { id, price, quantity, name } = item;
    const query = search.toLowerCase();
    if (!id) return false;
    return (
      id?.toString().includes(query) ||
      name?.toLowerCase().includes(query) ||
      price?.toString().toLowerCase().includes(query) ||
      quantity?.toString().includes(query)
    );
  }).filter((item) => item.soldUnits > 0);

  filtered.sort((a, b) => {
    const aRatio = refillRatio(a.inStock ?? 0, Math.ceil(a.soldUnits ?? 0 / months))
    const bRatio = refillRatio(b.inStock ?? 0, Math.ceil(b.soldUnits ?? 0 / months))
    if (aRatio > bRatio) return 1;
    if (aRatio < bRatio) return -1;
    return 0;
  })
  return (
    <>
      <TextField label="Buscar" variant="outlined" fullWidth onChange={(event) => {
        setSearch(event.target.value)
      }} />
      <CustomTable
        content={filtered}
        titles={['Id', 'Nombre', 'Cantidad', '% de almacen', 'Precio', 'Ventas/Mes', 'Proyección Mensual', 'Proyeccion de Stock']}
        format={(items) => {

          const perMonth = Math.ceil(items.soldUnits / months);
          const refill = refillRatio(items.inStock, perMonth);
          return [
            items.id,
            items.name,
            <span key={`qty-${items.id}`}>{items.inStock}</span>,
            <span key={`refill-${items.id}`} style={{
              color: refill < 80 ? 'red' : 'green'
            }}>{refill.toFixed(2)}%</span>,
            <Money number={items.unitPrice} key={`price-${items.id}`} />,
            perMonth,
            <Money number={items.unitPrice * perMonth} key={`projectionMonth-${items.id}`} />,
            <Money number={items.unitPrice * items.inStock} key={`projection-${items.id}`} />

          ]
        }}
      />
    </>
  )
}

function refillRatio (qty, sold) {
  sold = sold || 0;
  if (sold === 0) return 0;
  qty = qty || 0;
  return (qty / (sold * 2)) * 100;
}