import { useState } from 'react';
import { Button } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RemoveIcon from '@mui/icons-material/Remove';
import { DangerModal } from '../../components/CustomModal/ConfirmModal';

export function BillingButton ({ billingId, orderId, onBilling }) {
  const [open, setOpen] = useState(false);
  const btnMessage = billingId ? 'Cancelar' : 'Facturar';
  const modalMessage = billingId ? 'Para cancelar la factura ingresa el folio de la misma en el siguiente campo' : 'Para facturar la nota ingresa el folio de la misma en el siguiente campo';
  const color = billingId ? 'error' : 'info'
  const placeHolder = 'Folio de Nota';
  const icon = billingId ? <RemoveIcon /> : <ReceiptLongIcon />;
  return <>
    <Button startIcon={icon} color={color}
      fullWidth
      onClick={() => {
        setOpen(true);
      }}>{btnMessage}</Button>
    <DangerModal
      open={open}
      message={modalMessage}
      placeholder={placeHolder}
      icon={ReceiptLongIcon}
      onClose={() => {
        setOpen(false);
      }}
      condition={(input) => parseInt(input, 10) === parseInt(orderId, 10)} color={color} onConfirm={() => {
        onBilling(orderId, billingId);
        setOpen(false);
      }} />
  </>

}