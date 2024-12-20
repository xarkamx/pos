import { useState } from 'react';
import ExtensionIcon from '@mui/icons-material/Extension';
import { Box, Card, Modal, ListItem, Button } from '@mui/material';
import { usePopUp } from '../../../context/PopUpContext';
import { QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { useCState } from '../../../hooks/useHooks';
import { PaymentMethodSelect } from '../payments/SelectPaymentMethod';
import { OrderTransaction } from '../../../utils/transactions/orderTransaction';




export function AddComplementButton ({ billingId, total, onAccept }) {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <Button startIcon={<ExtensionIcon />} color={'warning'} onClick={async (ev) => {
        ev.stopPropagation();
        setToggle(true);
      }}>Complemento</Button>

      <ComplementModalForm
        total={total}
        open={toggle} onClose={() => {
          setToggle(false);
        }} onAccept={onAccept} billingId={billingId} />
    </>
  )
}


export function ComplementModalForm ({ billingId, total, open, onClose, onAccept }) {
  const { popUpAlert } = usePopUp();
  const [loading, setLoading] = useState(false);
  const [complementForm, setComplementForm] = useCState({
    paymentMethod: '01',
    amount: total,
    date: new Date().toISOString().split('T')[0]
  });
  return (

    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
      }}>
        <Card sx={{
          p: 3,
        }}>
          <QuickFormContainer
            title='Agregar complemento'
            onSubmit={async (ev) => {
              ev.preventDefault();
              setLoading(true);
              const service = new OrderTransaction();
              try {
                const resp = await service.addComplement(billingId, {
                  paymentForm: complementForm.paymentMethod,
                  amount: complementForm.amount,
                  paymentDate: complementForm.date
                });
                if (resp.ok) {
                  popUpAlert("success", "Complemento agregado correctamente");
                  onAccept?.();
                }
              } catch (e) {
                popUpAlert("error", "Ocurrio un error al agregar el complemento");
              }
              finally {
                onClose();
                setLoading(false);
              }

            }}

          >
            <ListItem>
              <PaymentMethodSelect paymentMethod={complementForm.paymentMethod} onChange={(value) => {
                setComplementForm({ paymentMethod: value.value });
              }} />
            </ListItem>
            <QuickFormInput fullWidth
              label='Fecha de pago'
              type='date' value={complementForm.date} onChange={(ev) => {
                setComplementForm({ date: ev.target.value });
              }} />
            <Button variant="contained" disabled={loading} sx={{ mt: 2 }} fullWidth type='submit'>
              {
                loading ? "Cargando..." : "Agregar"
              }
            </Button>
          </QuickFormContainer>
        </Card>
      </Box>

    </Modal>
  )
}