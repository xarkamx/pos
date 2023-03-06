import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export function PaymentMethodSelect ({ paymentMethod, onChange }) {
  return (<FormControl fullWidth>
    <InputLabel id="payment-method-label">Tipo de pago</InputLabel>
    <Select value={paymentMethod}
      labelId="payment-method-label"
      id="payment-method-select" fullWidth
      onChange={onChange}
    >
      <MenuItem value='1'>Efectivo</MenuItem>
      <MenuItem value='2'>Deposito</MenuItem>
    </Select>
  </FormControl>)
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