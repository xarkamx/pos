/* eslint-env jest */
import { OrderTransaction } from './orderTransaction';

jest.mock('../../config', () => ({ config: { apis: { bos: 'https://api.example.test' } } }));

describe('Order invoice requests and downloads', () => {
  let click;
  const originalFetch = global.fetch;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('accessToken', JSON.stringify({ jwt: 'test-token' }));
    global.fetch = jest.fn();
    URL.createObjectURL = jest.fn(() => 'blob:invoice');
    URL.revokeObjectURL = jest.fn();
    click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    localStorage.clear();
    global.fetch = originalFetch;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('loads invoices for the requested order with authentication', async () => {
    const invoices = [{ id: 7, external_id: 'invoice-123', folio: 'A-10' }];
    global.fetch.mockResolvedValue({ status: 200, json: async () => invoices });
    await expect(new OrderTransaction().getBillsByOrder(42)).resolves.toEqual(invoices);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.test/orders/42/billing', {
      method: 'get', headers: { Authorization: 'Bearer test-token' },
    });
  });

  it('downloads a named ZIP using the external invoice ID and cleans up the URL', async () => {
    const blob = new Blob(['zip'], { type: 'application/zip' });
    global.fetch.mockResolvedValue({ ok: true, blob: async () => blob });
    await new OrderTransaction().downloadBill('invoice-123');
    expect(global.fetch.mock.calls[0][0]).toBe('https://api.example.test/billing/invoice-123/download');
    expect(click.mock.instances[0].download).toBe('factura-invoice-123.zip');
    expect(click.mock.instances[0].href).toBe('blob:invoice');
    expect(document.querySelector('a[download]')).toBeNull();
    jest.runOnlyPendingTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:invoice');
  });

  it('does not download an HTTP error response as an invoice', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 403 });
    await expect(new OrderTransaction().downloadBill('invoice-123')).rejects.toThrow();
    expect(click).not.toHaveBeenCalled();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});
