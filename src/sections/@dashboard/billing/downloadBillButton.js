

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import GradingIcon from '@mui/icons-material/Grading';
import { Button } from '@mui/material';
import { OrderTransaction } from '../../../utils/transactions/orderTransaction';
import { usePopUp } from '../../../context/PopUpContext';

export function DownloadBillButton ({ billingId }) {
  const [loading, setLoading] = useState(false);
  const { popUpAlert } = usePopUp();
  return (
    <Button disabled={loading || !billingId} startIcon={<SimCardDownloadIcon />} onClick={async (ev) => {
      ev.stopPropagation();
      setLoading(true);
      try {
        await new OrderTransaction().downloadBill(billingId);
      } catch (error) {
        popUpAlert('error', 'No se pudo descargar la factura. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    }}>{loading ? 'Descargando...' : 'Descargar'}</Button>
  )
}

export function SendEmail ({ billingId }) {
  const { popUpAlert } = usePopUp();
  const [loading, setLoading] = useState(false);
  return (
    <Button startIcon={<AlternateEmailIcon />} color={'success'} disabled={loading} onClick={async (ev) => {
      ev.stopPropagation();
      setLoading(true);
      const service = new OrderTransaction();
      const resp = await service.sendEmail(billingId);
      if (resp.ok)
        popUpAlert("success", "Correo enviado correctamente");
      setLoading(false);
    }}>{loading ? "Cargando..." : "Enviar"}</Button>
  )
}

export function SeeOrdersButton ({ billingId }) {
  const navigate = useNavigate();
  return (
    <Button startIcon={<GradingIcon />} onClick={(ev) => {
      ev.stopPropagation();
      navigate(`/dashboard/facturas/${billingId}/ordenes`)
    }}>Ver Ordenes</Button>
  )
}
