import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, Slide, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { PaymentMethodSelect } from '../payments/SelectPaymentMethod';

const Transition = React.forwardRef((props, ref) => (<Slide direction="up" ref={ref} {...props} />));

export function PaymentModal ({ amount, max = Infinity, clientId, onPay, open, onClose }) {
  const [payment, setPayment] = useState(amount)
  const [paymentMethod, setPaymentMethod] = useState(1)
  const [currentClientId, setClientId] = useState(clientId)
  const clear = () => {
    setPayment(amount)
    setPaymentMethod(1)
    setClientId(clientId)
  }
  useEffect(() => {
    setPayment(amount);
    setClientId(clientId);

  }, [amount, clientId])
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
            <TextField label="Cliente" value={clientId} onChange={(ev) => {
              setClientId(ev.target.value)
            }} />
          </ListItem>
          <ListItem>
            <TextField label="Monto" inputProps={{
              min: 1,
              max,
            }} value={payment}
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