import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Alert, Box, Button, CircularProgress, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { downloadPublicInvoices, getPublicOrder } from '../utils/transactions/publicOrderTransaction';

export default function PublicOrderInvoicesPage() {
  const { uuid } = useParams();
  // A new UUID gets its own state; no previous customer's details can remain visible.
  return <PublicInvoiceContent key={uuid} uuid={uuid} />;
}

export function PublicInvoiceContent({ uuid }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reload, setReload] = useState(0);
  const downloadingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getPublicOrder(uuid, controller.signal).then(setData).catch((err) => {
      if (!controller.signal.aborted) setError(err.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [uuid, reload]);

  const download = async () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    setDownloading(true);
    setDownloadError('');
    setSuccess(false);
    try {
      await downloadPublicInvoices(uuid);
      setSuccess(true);
    } catch (err) {
      setDownloadError(err.message);
    } finally {
      downloadingRef.current = false;
      setDownloading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 8 } }}>
      <Helmet>
        <title>Factura de tu orden</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">Facturación</Typography>
            <Typography variant="h4" component="h1">Factura de tu orden</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Consulta tus datos fiscales y descarga tus comprobantes.</Typography>
          </Box>
          {loading && <Box role="status"><CircularProgress size={24} aria-label="Cargando orden" /></Box>}
          {!loading && error && <><Alert severity="error">{error}</Alert><Button onClick={() => setReload((value) => value + 1)}>Reintentar consulta</Button></>}
          {!loading && !error && data && <>
            <Typography>Orden #{data.order.id} · {({ paid: 'Pagada', pending: 'Pendiente de pago', requested: 'Solicitada', cancelled: 'Cancelada' })[data.order.status] || 'Estado no disponible'}</Typography>
            <Divider />
            <Box component="section" aria-label="Datos del cliente">
              <Typography variant="h6" component="h2" gutterBottom>Datos del cliente</Typography>
              <Box component="dl" sx={{ m: 0, '& dt': { color: 'text.secondary', mt: 2 }, '& dd': { m: 0, overflowWrap: 'anywhere' } }}>
                {[
                  ['Nombre o razón social', data.customer.name], ['RFC', data.customer.rfc],
                  ['Código postal fiscal', data.customer.postalCode], ['Régimen fiscal', data.customer.taxSystem],
                ].map(([label, value]) => <Box key={label}><Typography component="dt" variant="body2">{label}</Typography><Typography component="dd">{value || 'No registrado'}</Typography></Box>)}
              </Box>
            </Box>
            <Alert severity="info">Si la orden aún no está facturada, al descargar se validará que esté pagada y que sus datos fiscales sean válidos para emitirla. Si ya tiene facturas, se descargarán las existentes.</Alert>
            {downloadError && <Alert severity="error">{downloadError}</Alert>}
            {success && <Alert severity="success">La descarga del ZIP se ha iniciado.</Alert>}
            <Button variant="contained" size="large" disabled={downloading} onClick={download}>
              {downloading ? 'Preparando facturas…' : 'Descargar facturas (ZIP)'}
            </Button>
            <Typography variant="body2" color="text.secondary">El ZIP incluye PDF y XML. Si tus datos no son correctos, contacta al negocio antes de solicitar la factura.</Typography>
          </>}
        </Stack>
      </Paper>
    </Container>
  );
}
