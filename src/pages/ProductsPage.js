import { Grid } from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../sections/@dashboard/products';
import { ProductQuickForm } from '../sections/@dashboard/products/ProductQuickForm';

export default function ProductsPage () {
  const { products, del, add, update } = useProducts();
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <ProductQuickForm onSubmit={add} />
      </Grid>
      <Grid item xs={8}>
        <ProductList products={products} onDeleteProduct={del} onUpdateProduct={update} />
      </Grid>
    </Grid>
  );
}

