import { Grid } from '@mui/material';

import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../sections/@dashboard/products';
import { ProductQuickForm } from '../sections/@dashboard/products/ProductQuickForm';
import { PrintCatalog } from '../sections/@dashboard/prints/catalog';

export default function ProductsPage () {
  const { products, data, del, add, update } = useProducts();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <ProductQuickForm onSubmit={add} />
      </Grid>
      <Grid item xs={12} md={8}>
        <PrintCatalog products={data} />
        <ProductList products={products} onDeleteProduct={del} onUpdateProduct={update} />
      </Grid>
    </Grid>
  );
}

