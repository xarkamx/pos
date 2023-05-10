import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { usePopUp } from '../../../context/PopUpContext';
import { useCState } from '../../../hooks/useHooks';
import { useValidate } from '../../../hooks/useValidate';

export function ProductQuickForm ({ onSubmit }) {
  const { popUpAlert } = usePopUp();
  const [product, setProducts] = useCState({
    name: '',
    price: 0
  })
  const { validate, errors } = useValidate({
    type: 'object',
    required: ['name', 'price'],
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        errorMessage: 'El nombre debe tener al menos 3 caracteres',
      },
      price: {
        type: 'number',
        minimum: 0,
        errorMessage: 'El precio debe ser mayor a 0'
      }
    }
  })
  return (
    <QuickFormContainer title='Registra Producto' onSubmit={() => {
      if (!validate(product)) {
        popUpAlert('error', errors.name || errors.price);
        return;
      }
      onSubmit(product)
      setProducts({ name: '', price: 0 })
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