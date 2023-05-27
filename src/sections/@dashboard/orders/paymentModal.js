import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Slide, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { ClientsSearchInput } from '../clients/SelectClient';
import { PaymentMethodSelect } from '../payments/SelectPaymentMethod';

const Transition = React.forwardRef((props, ref) => (<Slide direction="up" ref={ref} {...props} />));

export function PaymentModal ({ amount, max = Infinity, clientId, onPay, open, onClose }) {
  const [payment, setPayment] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState(1)
  const [currentClientId, setClientId] = useState(clientId)
  const clear = () => {
    setPayment(amount)
    setPaymentMethod(1)
    setClientId(clientId)
  }
  useEffect(() => {
    setClientId(clientId);

  }, [clientId])
  if (Number.isNaN(max)) max = Infinity
  return <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={onClose}
    aria-describedby="alert-dialog-slide-description"
  >
    <form onSubmit={(ev) => {
      ev.preventDefault()
      onPay(currentClientId, payment, paymentMethod)
    }}>
      <DialogTitle>Cuanto desea pagar?</DialogTitle>

      <DialogContent>
        <Typography variant="subtitle1" sx={{ mb: 1 }} color='darkseagreen'>
          Deuda Total: <Money number={max} />
        </Typography>
        <List>
          <ListItem>
            <ClientsSearchInput
              onSubmit={(client) => {
                setClientId(client.id)
              }}
            />
          </ListItem>
          <ListItem>
            <TextField label="Monto" inputProps={{
              min: 1,
              max,
            }} value={payment}
              onFocus={(ev) => {
                ev.target.select()
              }}
              onChange={(ev) => {
                let { value } = ev.target
                if (value > max) {
                  value = max
                }
                setPayment(value)
              }}
            />
          </ListItem>
          <ListItem>
            <PaymentMethodSelect paymentMethod={paymentMethod} onChange={(ev) => {
              setPaymentMethod(ev.target.value)
            }} />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose()
          clear()
        }} type='reset'>Cerrar</Button>
        <Button onClick={onClose} type='submit'>Pagar</Button>
      </DialogActions>
    </form>
  </Dialog>
}