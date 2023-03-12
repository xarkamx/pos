import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { useCState } from '../../../hooks/useHooks';

export function ProductQuickForm ({ onSubmit }) {
  const [product, setProducts] = useCState({
    name: '',
    price: 0
  })
  return (
    <QuickFormContainer title='Registra Producto' onSubmit={() => {
      console.log(product)
      onSubmit(product)
    }}>
      <QuickFormInput label='Nombre' fullWidth
        pattern='[a-zA-Z0-9 #"\/]{3,250}'
        value={product.name}
        onChange={(ev) => {
          setProducts({ name: ev.target.value.toUpperCase() })
        }}
      />
      <QuickFormInput label='Precio' fullWidth inputProps={{
        type: 'number',
        min: 0,
        step: 0.01
      }}
        value={product.price}
        onChange={(ev) => {
          setProducts({ price: ev.target.value })
        }}
      />
      <QuickFormButton
        type='submit'
        variant='contained'
        fullWidth
      >Registrar</QuickFormButton>
    </QuickFormContainer>
  )
}