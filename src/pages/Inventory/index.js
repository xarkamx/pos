import { Grid } from '@mui/material';
import { QuickInventoryForm } from './components/QuickInventoryForm';
import { useInventory } from './hooks/useInventory';
import { InventoryTable } from './components/InventoryTable';

export function InventoryPage () {
  const { add, items } = useInventory();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <QuickInventoryForm onSubmit={add} />
      </Grid>
      <Grid item xs={12} md={8}>
        <InventoryTable items={items} />
      </Grid>
    </Grid>
  );
};