
import { useState } from 'react';
import { TextField } from '@mui/material';
import { CustomTable } from '../../components/tables/Table';
import { Money } from '../../components/Formats/FormatNumbers';
import { useProducts } from '../../hooks/useProducts';
import { PrintCatalog } from '../../sections/@dashboard/prints/catalog';


export default function MiddlemanProducts () {

  const { data } = useProducts();
  return (
    <>
      <h1>Productos</h1>
      <MiddlemanProductsList products={data} />
    </>
  );
}

function MiddlemanProductsList ({ products }) {
  const [search, setSearch] = useState('');
  const filtered = products?.filter((item) => {
    const { id, price, quantity, name } = item;
    const query = search.toLowerCase();
    if (!id) return false;
    return (
      id?.toString().includes(query) ||
      name?.toLowerCase().includes(query) ||
      price?.toString().toLowerCase().includes(query) ||
      quantity?.toString().includes(query)
    );
  })
  return <>
    <PrintCatalog css={{
      display: "none"
    }} products={
      filtered
    } />
    <TextField label="Buscar" variant="outlined" fullWidth onChange={(event) => {
      setSearch(event.target.value)
    }} />
    <CustomTable
      content={filtered}
      titles={['Imagen', 'Id', 'Nombre', 'Precio', 'Stock']}
      format={(product) => (
        [
          <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} key={`${product.id}-image`} />,
          product.id,
          product.name,
          <Money number={product.unitPrice} key={`${product.id}-price`} />,
          product.inStock
        ]
      )}
    />
  </>
}