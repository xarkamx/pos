/* eslint-env jest */
import { renderToStaticMarkup } from 'react-dom/server';
import { QRCodeSVG } from 'qrcode.react';
import { InvoiceQr } from './InvoiceQr';
import { Ticket } from './Ticket';

jest.mock('../../../hooks/useClients', () => ({ useClient: () => ({ client: {}, clientResume: {} }) }));
const uuid = 'bd4e6519-6154-44b1-805d-b67539df0405';
it('encodes the public POS invoice URL with a print-safe quiet zone', () => {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(<InvoiceQr publicUuid={uuid} />);
  const url = `${window.location.origin}/facturas/${uuid}`;
  expect(container.querySelector('a').href).toBe(url);
  const expected = document.createElement('div');
  expected.innerHTML = renderToStaticMarkup(<QRCodeSVG value={url} size={180} level="M" marginSize={4} />);
  expect(container.querySelector('svg path:last-child').getAttribute('d')).toBe(expected.querySelector('svg path:last-child').getAttribute('d'));
  expect(container.querySelector('svg').getAttribute('viewBox')).toBe(expected.querySelector('svg').getAttribute('viewBox'));
  expect(container.querySelector('svg').style.width).toBe('42mm');
});
it.each([null, undefined, '', '42'])('omits QR when UUID is unavailable/invalid: %s', (publicUuid) => {
  expect(renderToStaticMarkup(<InvoiceQr publicUuid={publicUuid} />)).toBe('');
});
it('places the invoice QR at the end of the ticket', () => {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(<Ticket publicUuid={uuid} orderId={42} products={[]} subtotal={0} discount={0} total={0} payment={0} />);
  expect(container.firstElementChild.lastElementChild.querySelector('a').href).toBe(`${window.location.origin}/facturas/${uuid}`);
});
