import { Grid } from '@mui/material';
import { QuickInventoryForm } from './components/QuickInventoryForm';
import { useInventory } from './hooks/useInventory';
import { InventoryTable } from './components/InventoryTable';
import { kValues, monthsSince } from '../../core/helpers';
import { refillRatio } from './components/utils';
import { CustomTable } from '../../components/tables/Table';

export function InventoryPage () {
  const { add, items } = useInventory();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <QuickInventoryForm onSubmit={add} />
        <RequiredMaterials items={items} />
      </Grid>
      <Grid item xs={12} md={8}>
        <InventoryTable items={items} />
      </Grid>
    </Grid>
  );
};

function RequiredMaterials ({ items }) {
  const required = Object.values(requiredMaterialsList(items));
  required.sort((b, a) => {
    if (a.required > b.required) return 1;
    if (a.required < b.required) return -1;
    return 0;
  });
  return (
    <CustomTable content={required} titles={['Material', 'Requerido']} format={(item) => [
      item.name,
      kValues(item.required)]} />
  );
}

function requiredMaterialsList (items) {
  const filtered = filterMaterials(items);
  return filtered.reduce((acc, item) => {
    item.materials.forEach((material) => {
      const { materialId, name, required } = material;
      if (acc[materialId]) {
        acc[materialId].required += required;
      } else {
        acc[materialId] = {
          materialId,
          name,
          required,
        };
      }
    });
    return acc;
  }, {});
}
function filterMaterials (items) {
  const months = monthsSince(new Date('2023-03-01'));
  const filtered = items?.map((item) => {
    const mediamPerMonth = Math.ceil(item.soldUnits / months);
    item.refill = refillRatio(item.inStock, mediamPerMonth);
    item.mediamPerMonth = mediamPerMonth;
    const total = (item.inStock / (item.refill / 100)) - item.inStock;
    item.materials = item.materials.map((material) => {
      const required = Math.ceil(material.quantity * total) * 1.30;
      return {
        ...material,
        required,
      };
    });
    return item;
  }).filter((item) => item.refill < 100 && item.mediamPerMonth > 0);
  return filtered ?? [];
}

