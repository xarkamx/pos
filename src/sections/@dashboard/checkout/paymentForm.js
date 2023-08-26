import { Box, Button, Card, Grid, List, ListItem, Modal, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Money } from '../../../components/Formats/FormatNumbers'
import { PaymentMethodSelect } from '../payments/SelectPaymentMethod'
import { DiscountInput } from './itemsList'

export function PaymentForm ({ subtotal, total, clientId, send, onDiscount, submitable }) {
  const [paymentMethod, setPaymentMethod] = useState('01')
  return (
    <Card>
      <List>

        <ListItem>
          <Typography variant="subtitle1" sx={{ mb: 1 }} color='orange'>
            Subtotal: <Money number={subtotal} />
          </Typography>
        </ListItem>
        <ListItem>
          <DiscountInput onChange={(ev) => {
            onDiscount(ev.val)
          }} total={subtotal} />
        </ListItem>
        <hr />
        <ListItem>
          <Typography variant="subtitle1" sx={{ mb: 1 }} color='darkseagreen'>
            Total: <Money number={total} />
          </Typography>
        </ListItem>
        <ListItem>
          <PaymentMethodSelect paymentMethod={paymentMethod} onChange={(resp) => {
            setPaymentMethod(resp.value)
          }} />

        </ListItem>
        <ListItem>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PartialPaymentModal send={send} total={total} clientId={clientId} submitable={submitable} paymentMethod={paymentMethod} />
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </Card>
  )
}

function PartialPaymentModal ({ send, clientId, total, submitable, paymentMethod }) {
  const [open, setOpen] = useState(false)
  const [payment, setPayment] = useState(total)
  return (
    <>
      <Button variant="contained" disabled={!submitable} fullWidth color='success'
        sx={{
          color: 'white',
        }}
        onClick={() => {
          setOpen(true)
        }}>
        Pagar
      </Button>
      <Modal open={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',

        }}>
          <Card sx={{
            width: '100%',
            maxWidth: '500px',
            padding: '20px'
          }}>
            <form onSubmit={(ev) => {
              ev.preventDefault()
              const actualPayment = payment > total ? total : payment
              send(clientId, actualPayment, paymentMethod)
              setOpen(false)
            }}>
              <Typography variant="h4" sx={{ mb: 5 }}>
                Pagar <Money number={total} />
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    type='number'
                    inputProps={{
                      min: 0,
                      step: 0.01
                    }}
                    onFocus={(ev) => {
                      ev.target.select()
                    }}
                    value={payment}
                    label='Pago' sx={{ width: "100%" }} onChange={(ev) => {
                      setPayment(ev.target.value)
                    }} />
                  <Typography variant="h6" sx={{ color: 'darkgreen', textAlign: 'center' }}>
                    Cambio <Money number={payment - total} />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" fullWidth type='submit'>Pagar</Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Box>
      </Modal>
    </>
  )
};