
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { useCState } from '../../../hooks/useHooks';
import { useProducts } from '../../../hooks/useProducts';

// propTypes
export function ProductSearchInput ({ onSubmit }) {
  const products = useProducts();
  let textInput = null;
  const [product, setProduct] = useCState({ quantity: 1 })
  const options = products.products || [];

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
        <Grid item xs={8}>
          <Autocomplete
            value={product.name || ''}
            disablePortal
            id="combo-box-search-product"
            options={options}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(ev, nv) => {
              if (!nv?.id) return;
              setProduct({
                id: nv?.id,
                name: nv?.label,
                price: nv?.price,
              })
            }}
            renderInput={(params) => <TextField {...params} autoFocus inputRef={input => {
              textInput = input;
            }} label="Productos" />} />
        </Grid>
        <Grid item xs={2}>
          <TextField label="Cantidad" type='number'
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
        <Grid item xs={2} style={
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