import { Grid } from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../sections/@dashboard/products';

export default function ProductsPage () {
  const { products } = useProducts();
  return (
    <Grid container spacing={2}>

      <Grid item xs={12}>
        <ProductList products={products} />
      </Grid>
    </Grid>
  );
}

