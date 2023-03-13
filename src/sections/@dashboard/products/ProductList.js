import { IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { DeleteSmallButton } from '../../../components/Buttons/IconButons';
import { Money } from '../../../components/Formats/FormatNumbers';
import Iconify from '../../../components/iconify/Iconify';
import { PaginatedTable } from '../../../components/tables/paginatedTable';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function ProductList ({ products = [], onDeleteProduct }) {
  const [search, setSearch] = useState('');
  const filteredProducts = products.filter((product) => {
    const searchValues = search.split(' ');
    return searchValues.some((value) => product.label.toLowerCase().includes(value.toLowerCase()));
  });
  console.log(filteredProducts)
  return (
    <>
      <TextField fullWidth label="Buscar" value={search} onChange={(ev) => setSearch(ev.target.value)} />
      <PaginatedTable
        items={filteredProducts}
        titles={['', 'Id', 'Nombre', 'Precio']}
        format={(product) => (
          [
            <DeleteSmallButton onClick={() => {
              onDeleteProduct(product.id);
            }} key={`del-${product.id}`} />,
            product.id,
            product.label,
            <Money number={product.price} key={
              `money-${product.id}`
            } />,
          ]
        )}
      />
    </>
  );
}


