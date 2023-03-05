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