import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Slide, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { ClientsSearchInput } from '../clients/SelectClient';
import { PaymentMethodSelect } from '../payments/SelectPaymentMethod';
import { QuickFormContainer } from '../../../components/Containers/QuickFormContainer';


const Transition = React.forwardRef((props, ref) => (<Slide direction="up" ref={ref} {...props} />));

export function PaymentModal ({ amount, max = Infinity, clientId, onPay, open, onClose }) {
  const [payment, setPayment] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState(1)
  const [currentClientId, setClientId] = useState(clientId)
  const clear = () => {
    setPayment(amount ?? 0)
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
    onClose={() => {
      onClose()
      clear()
    }}
    aria-describedby="alert-dialog-slide-description"
  >
    <form onSubmit={(ev) => {
      ev.preventDefault()
      onPay(currentClientId, payment, paymentMethod)
      clear()
    }}
      style={{ minWidth: 300 }}
    >
      <DialogTitle>
        Monto a pagar
      </DialogTitle>

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
            <TextField label="Monto" type='number'

              fullWidth inputProps={{
                min: 0.1,
                max,
                step: 0.01
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
              setPaymentMethod(ev.value)
            }} />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose()
          clear()
        }} type='reset' color='error'>Cerrar</Button>
        <Button type='submit'>Pagar</Button>
      </DialogActions>
    </form>
  </Dialog>
}

export function MinifyPaymentModal ({
  max = Infinity,
  onClose,
  open,
  onSubmit,

}) {

  const [payment, setPayment] = useState(0)
  return <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={() => { }} aria-describedby="alert-dialog-slide-description">
    <QuickFormContainer title='Monto a pagar' onSubmit={() => {
      onSubmit(payment)
      setPayment(0)
    }}>
      <DialogContent>

        <Typography variant="subtitle1" sx={{ mb: 1 }} color='darkseagreen'>
          Deuda Total: <Money number={max} />
        </Typography>
        <List>
          <ListItem>
            <TextField label="Monto" type='number'

              fullWidth inputProps={{
                min: 0.1,
                max,
                step: 0.01
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
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setPayment(0)
          onClose()
        }} type='reset' color='error'>Cerrar</Button>
        <Button type='submit'>Pagar</Button>
      </DialogActions>
    </QuickFormContainer>
  </Dialog>
}