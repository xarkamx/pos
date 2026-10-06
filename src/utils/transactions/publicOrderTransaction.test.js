/* eslint-env jest */
import { downloadPublicInvoices, getPublicOrder } from './publicOrderTransaction';

jest.mock('../../config', () => ({ config: { apis: { bos: 'https://api.example.test/' } } }));
const uuid = 'bd4e6519-6154-44b1-805d-b67539df0405';
const originalFetch = global.fetch;
beforeEach(() => { global.fetch = jest.fn(); });
afterEach(() => { global.fetch = originalFetch; localStorage.clear(); jest.restoreAllMocks(); });

it('reads details without credentials or an authorization header even when logged in', async () => {
  localStorage.setItem('accessToken', JSON.stringify({ jwt: 'secret' }));
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ customer: { name: 'Cliente' } }) });
  await expect(getPublicOrder(uuid)).resolves.toEqual({ customer: { name: 'Cliente' } });
  expect(global.fetch).toHaveBeenCalledWith(`https://api.example.test/public/orders/${uuid}`, {
    method: 'GET', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: undefined,
  });
});
it('rejects an invalid link without contacting BOS', async () => {
  await expect(getPublicOrder('42')).rejects.toThrow('no es válido');
  expect(global.fetch).not.toHaveBeenCalled();
});
it('shows the BOS error rather than downloading JSON as a ZIP', async () => {
  global.fetch.mockResolvedValue({ ok: false, json: async () => ({ message: 'La orden no está marcada como pagada' }) });
  await expect(downloadPublicInvoices(uuid)).rejects.toThrow('no está marcada como pagada');
});
it('downloads and releases the ZIP object URL', async () => {
  jest.useFakeTimers();
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = jest.fn(() => 'blob:invoices');
  URL.revokeObjectURL = jest.fn();
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  global.fetch.mockResolvedValue({ ok: true, blob: async () => new Blob(['ZIP']) });
  try {
    await downloadPublicInvoices(uuid);
    expect(click.mock.instances[0].download).toBe(`facturas-${uuid}.zip`);
    expect(document.querySelector('a[download]')).toBeNull();
    jest.runOnlyPendingTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:invoices');
  } finally {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
    jest.useRealTimers();
  }
});
