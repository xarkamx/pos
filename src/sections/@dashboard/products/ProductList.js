
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { DeleteSmallButton } from '../../../components/Buttons/IconButons';
import { DebounceInput } from '../../../components/Inputs/DebounceInput';
import { CustomTable } from '../../../components/tables/Table';
import { usePopUp } from '../../../context/PopUpContext';


// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function ProductList ({ products = [], onDeleteProduct, onUpdateProduct }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const filteredProducts = products.filter((product) => {
    const searchValues = search.split(' ');
    return searchValues.some((value) => product.label?.toLowerCase().includes(value.toLowerCase()));
  });
  const { popUpAlert } = usePopUp();
  return (
    <>

      <TextField fullWidth label="Buscar" value={search} onChange={(ev) => setSearch(ev.target.value)} />
      <CustomTable
        content={filteredProducts}
        titles={['Id', 'Nombre', 'Precio', 'Acciones']}
        format={(product) => (
          [

            product.id,
            <DebounceInput
              fullWidth value={product.label} key={`name-${product.id}`} onChange={(ev) => {
                if (!ev.target.value) return;
                onUpdateProduct({ id: product.id, name: ev.target.value });
              }} />,
            <PriceForm
              value={product.price} key={`val-${product.id}`} onChange={async (value) => {
                if (!value) return;
                await onUpdateProduct({ id: product.id, price: value });
                popUpAlert('success', 'Precio actualizado');
              }} />,
            <>
              <DeleteSmallButton onClick={() => {
                onDeleteProduct(product.id);
              }} key={`del-${product.id}`} />

              <IconButton onClick={() => {
                navigate(`/dashboard/productos/${product.id}`);
              }}>
                <EditIcon />
              </IconButton>
            </>
          ]
        )}
      />
    </>
  );
}

function PriceForm ({ value, onChange }) {
  const [val, setVal] = useState(value);
  return (
    <form
      style={{
        display: 'flex',
        gap: '5px',
      }}
      onSubmit={(ev) => {
        ev.preventDefault();
        onChange(val);
      }}
      className='priceForm'>
      <TextField
        fullWidth
        variant='standard'
        value={val}
        onChange={(ev) => {
          if (!ev.target.value) return;
          setVal(ev.target.value);
        }}
      />
      <IconButton type='submit'>
        <CheckIcon />
      </IconButton>
    </form>
  );
}

