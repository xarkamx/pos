/* eslint-env jest */
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { PublicInvoiceContent } from './PublicOrderInvoicesPage';
import { downloadPublicInvoices, getPublicOrder } from '../utils/transactions/publicOrderTransaction';

jest.mock('../utils/transactions/publicOrderTransaction', () => ({ getPublicOrder: jest.fn(), downloadPublicInvoices: jest.fn() }));
let container;
let root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  jest.resetAllMocks();
});
afterEach(() => { act(() => root.unmount()); container.remove(); });
async function renderPage() {
  await act(async () => { root.render(<HelmetProvider><PublicInvoiceContent uuid="test-uuid" /></HelmetProvider>); });
}
it('displays fiscal data and issues/downloads only on a button click', async () => {
  getPublicOrder.mockResolvedValue({ order: { id: 42, status: 'paid' }, customer: { name: 'Cliente Demo', rfc: 'EKU9003173C9', postalCode: '44100', taxSystem: '601' } });
  downloadPublicInvoices.mockResolvedValue();
  await renderPage();
  expect(container.textContent).toContain('Cliente Demo');
  expect(container.textContent).toContain('EKU9003173C9');
  expect(downloadPublicInvoices).not.toHaveBeenCalled();
  await act(async () => { container.querySelector('button').click(); });
  expect(downloadPublicInvoices).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain('La descarga del ZIP se ha iniciado');
});
it('shows lookup failures without displaying a download button', async () => {
  getPublicOrder.mockRejectedValue(new Error('Orden no encontrada'));
  await renderPage();
  expect(container.textContent).toContain('Orden no encontrada');
  expect(container.textContent).not.toContain('Descargar facturas');
});
it('displays invoice errors and permits another attempt', async () => {
  getPublicOrder.mockResolvedValue({ order: { id: 42, status: 'pending' }, customer: {} });
  downloadPublicInvoices.mockRejectedValue(new Error('La orden no está marcada como pagada'));
  await renderPage();
  await act(async () => { container.querySelector('button').click(); });
  expect(container.textContent).toContain('La orden no está marcada como pagada');
  expect(container.querySelector('button').disabled).toBe(false);
});
