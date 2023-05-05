import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { DeleteSmallButton } from '../../../components/Buttons/IconButons';
import { DebounceInput } from '../../../components/Inputs/DebounceInput';
import { CustomTable } from '../../../components/tables/Table';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function ProductList ({ products = [], onDeleteProduct, onUpdateProduct }) {
  const [search, setSearch] = useState('');
  const filteredProducts = products.filter((product) => {
    const searchValues = search.split(' ');
    return searchValues.some((value) => product.label.toLowerCase().includes(value.toLowerCase()));
  });
  return (
    <>
      <TextField fullWidth label="Buscar" value={search} onChange={(ev) => setSearch(ev.target.value)} />
      <CustomTable
        content={filteredProducts}
        titles={['', 'Id', 'Nombre', 'Precio']}
        format={(product) => (
          [
            <DeleteSmallButton onClick={() => {
              onDeleteProduct(product.id);
            }} key={`del-${product.id}`} />,
            product.id,
            <DebounceInput
              fullWidth value={product.label} key={`name-${product.id}`} onChange={(ev) => {
                if (!ev.target.value) return;
                onUpdateProduct({ id: product.id, name: ev.target.value });
              }} />,
            <DebounceInput
              value={product.price} key={`val-${product.id}`} onChange={(ev) => {
                if (!ev.target.value) return;
                onUpdateProduct({ id: product.id, price: ev.target.value });
              }} />,
          ]
        )}
      />
    </>
  );
}


