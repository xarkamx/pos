import { QRCodeSVG } from 'qrcode.react';
import { isPublicOrderUuid } from '../../../utils/transactions/publicOrderTransaction';

export function InvoiceQr({ publicUuid }) {
  if (!isPublicOrderUuid(publicUuid)) return null;
  // Use the public POS page, never the API endpoint that can issue an invoice.
  const url = new URL(`/facturas/${publicUuid}`, window.location.origin).href;
  return (
    <div style={{ textAlign: 'center', marginTop: '1rem', breakInside: 'avoid', pageBreakInside: 'avoid', color: '#000' }}>
      <p style={{ fontWeight: 'bold' }}>Escanea para obtener tu factura</p>
      <a href={url} aria-label="Abrir facturas de la orden" style={{ color: '#000' }}>
        <QRCodeSVG value={url} size={180} level="M" marginSize={4} bgColor="#fff" fgColor="#000"
          title="Factura de la orden" style={{ width: '42mm', height: '42mm', maxWidth: '100%' }} />
      </a>
      <p style={{ fontSize: '0.6rem' }}>Descarga tus comprobantes PDF y XML</p>
    </div>
  );
}
