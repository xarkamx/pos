
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Button } from '@mui/material';
import { OrderTransaction } from '../../../utils/transactions/orderTransaction';

export function DownloadBillButton ({ billingId }) {
  return (
    <Button startIcon={<SimCardDownloadIcon />} onClick={() => {
      const service = new OrderTransaction();
      service.downloadBill(billingId);
    }}>Descargar</Button>
  )
}

export function SendEmail ({ billingId }) {
  return (
    <Button startIcon={<AlternateEmailIcon />} color={'success'} onClick={() => {
      const service = new OrderTransaction();
      service.sendEmail(billingId);
    }}>Enviar</Button>
  )
}