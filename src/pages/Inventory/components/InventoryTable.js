import { Box, Card, CardHeader, IconButton, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { CustomTable } from '../../../components/tables/Table';
import { kValues, monthsSince } from '../../../core/helpers';
import { refillRatio } from './utils';
import { useCState } from '../../../hooks/useHooks';

export function InventoryTable ({ items = [] }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useCState({ key: '% de almacen', dir: 'asc' });
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [open, setOpen] = useState(false);
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

  filtered.sort(sortByTitle(sort.key, sort.dir, months));
  return (
    <>
      <TextField label="Buscar" variant="outlined" fullWidth onChange={(event) => {
        setSearch(event.target.value)
      }} />
      <CustomTable
        content={filtered}
        onTitleClick={(value, dir) => {
          console.log("Sorting by", value, dir);
          setSort({ key: value, dir });
        }}
        onClick={(item) => {
          setOpen(true);
          setMaterial(item);
        }}
        titles={['Id', 'Nombre', 'Cantidad', '% de almacen', 'Precio', 'Ventas/Mes', 'Proyección Mensual', 'Proyeccion de Stock', 'Acciones']}
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
            <Money number={items.unitPrice * items.inStock} key={`projection-${items.id}`} />,
            <IconButton key={`nav-${items.id}`} onClick={() => {
              navigate(`/dashboard/productos/${items.id}`);
            }}>
              <EditIcon />
            </IconButton>

          ]
        }}
      />
      <MaterialModal open={open}
        product={material}
        requiredUnits={material?.requiredUnits}
        handleClose={() => {
          setOpen(false);
          setMaterial(null);
        }} />
    </>
  )
}

function MaterialModal ({ open, handleClose, product }) {
  if (!product) return null;
  const months = monthsSince(new Date('2023-03-01'));
  let requiredProducts = (Math.ceil(product.soldUnits / months) * 2) - product.inStock;
  if (requiredProducts < 0) requiredProducts = 0;
  let groupedItems = product.materials?.reduce((acc, item) => {
    if (!acc[item.materialId]) {
      acc[item.materialId] = item;
      return acc;
    }
    acc[item.materialId] = {
      ...item,
      quantity: acc[item.materialId]?.quantity + item.quantity || item.quantity
    }
    return acc;
  }, {});
  groupedItems = Object.values(groupedItems);
  return (
    <Modal open={Boolean(open)} onClose={handleClose}>
      <Box>
        <Card sx={{
          p: 3,
        }}>
          <CardHeader title="Lista de materiales" />
          <CustomTable
            titles={['Material', 'Cantidad Por Unidad', 'Unidad', 'Material Requerido']}
            content={groupedItems}
            format={(item) => [
              item.name,
              item.unit,
              item.quantity,
              kValues(requiredProducts * item.quantity)
            ]} />
        </Card>
      </Box>

    </Modal>
  );
}

function sortByTitle (key, dir, months) {
  const processAsc = {
    'Id': (a, b) => a.id - b.id,
    'Nombre': (a, b) => a.name.localeCompare(b.name),
    'Cantidad': (a, b) => a.inStock - b.inStock,
    '% de almacen': (a, b) => refillRatio(a.inStock ?? 0, Math.ceil(a.soldUnits ?? 0 / months)) - refillRatio(b.inStock ?? 0, Math.ceil(b.soldUnits ?? 0 / months)),
    'Precio': (a, b) => a.unitPrice - b.unitPrice,
    'Ventas/Mes': (a, b) => Math.ceil(a.soldUnits / months) - Math.ceil(b.soldUnits / months),
    'Proyección Mensual': (a, b) => (a.unitPrice * Math.ceil(a.soldUnits / months)) - (b.unitPrice * Math.ceil(b.soldUnits / months)),
    'Proyeccion de Stock': (a, b) => (a.unitPrice * a.inStock) - (b.unitPrice * b.inStock),
  }

  const processDesc = {
    'Id': (a, b) => b.id - a.id,
    'Nombre': (a, b) => b.name.localeCompare(a.name),
    'Cantidad': (a, b) => b.inStock - a.inStock,
    '% de almacen': (a, b) => refillRatio(b.inStock ?? 0, Math.ceil(b.soldUnits ?? 0 / months)) - refillRatio(a.inStock ?? 0, Math.ceil(a.soldUnits ?? 0 / months)),
    'Precio': (a, b) => b.unitPrice - a.unitPrice,
    'Ventas/Mes': (a, b) => Math.ceil(b.soldUnits / months) - Math.ceil(a.soldUnits / months),
    'Proyección Mensual': (a, b) => (b.unitPrice * Math.ceil(b.soldUnits / months)) - (a.unitPrice * Math.ceil(a.soldUnits / months)),
    'Proyeccion de Stock': (a, b) => (b.unitPrice * b.inStock) - (a.unitPrice * a.inStock),
  };
  return dir === 'asc' ? processAsc[key] : processDesc[key];
}

// function refilSort(a,b) {
//   const aRatio = refillRatio(a.inStock ?? 0, Math.ceil(a.soldUnits ?? 0 / months))
//   const bRatio = refillRatio(b.inStock ?? 0, Math.ceil(b.soldUnits ?? 0 / months))
//   if (aRatio > bRatio) return 1;
//   if (aRatio < bRatio) return -1;
// }