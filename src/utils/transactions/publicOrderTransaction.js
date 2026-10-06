import { config } from '../../config';

export const isPublicOrderUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || '');

async function request(uuid, suffix = '', signal) {
  if (!isPublicOrderUuid(uuid)) throw new Error('El enlace de la orden no es válido.');
  const response = await fetch(`${config.apis.bos.replace(/\/$/, '')}/public/orders/${uuid}${suffix}`, {
    method: 'GET', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'No se pudo consultar la orden. Intenta nuevamente.');
  }
  return response;
}

export async function getPublicOrder(uuid, signal) {
  return (await request(uuid, '', signal)).json();
}

export async function downloadPublicInvoices(uuid) {
  const response = await request(uuid, '/invoices.zip');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `facturas-${uuid}.zip`;
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
