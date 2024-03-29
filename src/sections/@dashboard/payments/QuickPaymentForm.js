import { Card, List, ListItem, TextField, Button, Typography } from '@mui/material';
import { useCState } from '../../../hooks/useHooks';
import { ClientsSearchInput } from '../clients/SelectClient';
import { PaymentFlowSelect, PaymentMethodSelect, PaymentTypeSelect } from './SelectPaymentMethod';



export function QuickPaymentForm ({ onSubmit }) {
  const defaultPayment = {
    clientId: 0,
    amount: 0,
    paymentMethod: 1,
    flow: 'inflow',
    paymentType: 'sale',
    description: '',
  }
  const [payment, setPayment] = useCState(defaultPayment)
  const clear = () => {
    setPayment(defaultPayment)
  }
  return <form onSubmit={(ev) => {
    ev.preventDefault()
    onSubmit(payment)
    clear()
  }}>
    <Card sx={{
      padding: 2,
    }}>
      <Typography variant="h4">Formulario de pago rapido</Typography>
      <List>
        <ListItem>
          <ClientsSearchInput onSubmit={(client) => {
            setPayment({ clientId: client.id })
          }} />
        </ListItem>
        <ListItem>
          <TextField label='Cantidad' type='number' inputProps={
            {
              min: 0.01,
              step: 0.01,
            }
          } fullWidth value={payment.amount} onChange={(ev) => {
            setPayment({ amount: ev.target.value })
          }} />
        </ListItem>
        <ListItem>
          <PaymentMethodSelect paymentMethod={payment.paymentMethod} onChange={(ev) => {
            setPayment({ paymentMethod: ev.value })
          }} />
        </ListItem>
        <ListItem>
          <PaymentFlowSelect flow={payment.flow} onChange={(ev) => {
            setPayment({ flow: ev.target.value })
          }} />
        </ListItem>
        <ListItem>
          <TextField label='Descripcion' fullWidth value={payment.description} onChange={(ev) => {
            setPayment({ description: ev.target.value })
          }} />
        </ListItem>
        <ListItem>
          <PaymentTypeSelect paymentType={payment.paymentType} onChange={(ev) => {
            setPayment({ paymentType: ev.target.value })
          }} />
        </ListItem>
        <ListItem>
          <Button fullWidth type='submit' variant='outlined' >
            Registrar Pago
          </Button>
        </ListItem>
      </List>
    </Card>
  </form>
}