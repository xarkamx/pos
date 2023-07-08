
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { PAYMENT_TYPE } from '../../../config/constants'

export function PaymentMethodSelect ({ paymentMethod, onChange, ...props }) {
  const paymentMethods = PAYMENT_TYPE.map((item) => ({ label: item.descripcion, value: item.codigo }))
  const val = paymentMethods.find((item) => parseInt(item.value, 10) === parseInt(paymentMethod, 10))
  return (<Autocomplete
    fullWidth

    renderInput={(params) => <TextField {...params} label="Metodo de pago" />}
    onChange={(ev, value) => {
      onChange(value)
    }}
    value={val || null}
    defaultValue={paymentMethod}
    options={paymentMethods}
    getOptionLabel={(option) =>
      option.label
    }
    {...props}
  />)
}
export function PaymentFlowSelect ({ flow, onChange }) {
  return (<FormControl fullWidth>
    <InputLabel id="payment-method-label">Entrada o salida</InputLabel>
    <Select value={flow}
      labelId="payment-method-label"
      id="payment-method-select" fullWidth
      onChange={onChange}
    >
      <MenuItem value='inflow'>Entrada</MenuItem>
      <MenuItem value='outflow'>Salida</MenuItem>
    </Select>
  </FormControl>)
}

export function PaymentTypeSelect ({ paymentType, onChange }) {
  return (<FormControl fullWidth>
    <InputLabel id="payment-type-label">Tipo de pago</InputLabel>
    <Select value={paymentType}
      labelId="payment-type-label"
      id="payment-type-select" fullWidth
      onChange={onChange}
    >
      <MenuItem value='sale'>Venta</MenuItem>
      <MenuItem value='tax'>Impuesto</MenuItem>
      <MenuItem value='service'>Servicio</MenuItem>
      <MenuItem value='rent'>Renta</MenuItem>
      <MenuItem value='refund'>
        Devolucion
      </MenuItem>
      <MenuItem value='other'>Otro</MenuItem>

    </Select>
  </FormControl>)
}