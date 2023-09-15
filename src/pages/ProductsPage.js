import { Grid } from '@mui/material';

import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../sections/@dashboard/products';
import { ProductQuickForm } from '../sections/@dashboard/products/ProductQuickForm';
import { NavButton } from '../components/Buttons/IconButons';

export default function ProductsPage () {
  const { products, del, add, update } = useProducts();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NavButton to='/dashboard/productos/procesos'>
          Galvanizado
        </NavButton>
      </Grid>
      <Grid item xs={12} md={4}>
        <ProductQuickForm onSubmit={add} />
      </Grid>
      <Grid item xs={12} md={8}>
        <ProductList products={products} onDeleteProduct={del} onUpdateProduct={update} />
      </Grid>
    </Grid>
  );
}

