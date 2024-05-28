
import { Autocomplete, Button, Grid, ListItem, ListItemText, TextField } from '@mui/material';

import { useState } from 'react';
import { useCState } from '../../../hooks/useHooks';
import { useProducts } from '../../../hooks/useProducts';
import { Money } from '../../../components/Formats/FormatNumbers';

// propTypes
export function ProductSearchInput ({ onSubmit }) {
  const products = useProducts();
  let textInput = null;
  const [product, setProduct] = useCState({ quantity: 1 })
  const options = products.products || [];
  // order options by name
  const sortOpt = [...options].sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  })
  return <form onSubmit={(ev) => {
    ev.preventDefault();
    if (!product.id) return;
    onSubmit?.({ ...product, amount: product.quantity * product.price });
    setProduct({ quantity: 1, id: null, name: null, price: null })
    textInput.focus();
  }}>
    <div style={{
      padding: '10px 0',
    }}>
      <Grid container spacing={3}>

        <Grid item sm={2} xs={12}>
          <TextField label="Cantidad" fullWidth type='number'
            onFocus={(ev) => {
              ev.target.select();
            }}
            autoFocus inputRef={input => {
              textInput = input;
            }}
            InputProps={{
              inputProps: {
                min: 1
              }
            }}
            onChange={(ev) => {
              const qty = parseFloat(ev.target.value)
              setProduct({
                ...product,
                quantity: qty
              })
            }}
            value={product.quantity}
          />
        </Grid>
        <Grid item sm={8} xs={12}>
          <Autocomplete
            value={product.name || ''}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            disablePortal
            id="combo-box-search-product"
            options={sortOpt}
            renderOption={RenderedListItem}
            onChange={(ev, nv) => {
              if (!nv?.id) return;
              setProduct({
                id: nv?.id,
                name: nv?.label,
                price: nv?.price,
              })
            }}
            renderInput={(params) => <TextField {...params} label="Productos" />} />
        </Grid>
        <Grid item sm={2} xs={12} style={
          {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
        }>
          <Button variant="text" type='submit' style={{
            backgroundColor: '#3f51b5',
            color: 'white',
            height: '100%',
            width: '100%',
          }}>Agregar</Button>
        </Grid>
      </Grid>
    </div>
  </form>
}

export function BasicProductSearch ({ onChange }) {
  const [product, setProduct] = useState({})
  const products = useProducts();
  const options = products.products || [];
  return <Autocomplete
    value={product.label || ''}
    disablePortal
    options={options}
    fullWidth
    onChange={(ev, nv) => {
      if (!nv?.id) return;
      setProduct(nv);
      onChange?.(nv);
    }}
    renderInput={(params) => <TextField {...params} autoFocus label="Productos" />} />
}

function RenderedListItem (props, option) {
  return <ListItem {...props} sx={
    {
      '&:hover': {
        backgroundColor: 'lightgray',
      },
      cursor: 'pointer',
      color: option.quantity >= 1 ? 'black' : 'red',
    }
  }>
    <ListItemText primary={option.label} secondary={<Money number={`${option.price}`} />} />
    <ListItemText secondary={option.quantity} />
  </ListItem>
}