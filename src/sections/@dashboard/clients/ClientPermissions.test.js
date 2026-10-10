/* eslint-env jest */
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { ClientReadOnlyDetails } from './ClientReadOnlyDetails';
import { ClientsTable } from './ClientsTable';
import { useClientPermissions } from '../../../hooks/useClientPermissions';
import { useAuth } from '../../../hooks/useAuth';

jest.mock('../../../hooks/useAuth', () => ({ useAuth: jest.fn() }));
let container;
let root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

function PermissionProbe() {
  const { canEditClients } = useClientPermissions();
  return <span>{canEditClients ? 'editable' : 'readonly'}</span>;
}
it.each([
  [['cashier'], 'readonly'],
  [['admin'], 'editable'],
  [['cashier', 'admin'], 'editable'],
  [[], 'readonly'],
])('uses explicit admin privilege for roles %j', (roles, expected) => {
  useAuth.mockReturnValue({ access: { roles } });
  act(() => root.render(<PermissionProbe />));
  expect(container.textContent).toBe(expected);
});
it('shows fiscal/contact details without editable controls', () => {
  act(() => root.render(<ClientReadOnlyDetails name="Cliente Demo" rfc="EKU9003173C9" email="demo@example.test" phones={['555123']} postalCode="44100" taxSystem="601" />));
  expect(container.textContent).toContain('Cliente Demo');
  expect(container.textContent).toContain('EKU9003173C9');
  expect(container.querySelectorAll('input,select,textarea')).toHaveLength(0);
});
it.each([false, true])('renders client table editing controls only with an update callback (%s)', editable => {
  act(() => root.render(<MemoryRouter><ClientsTable clients={[{ id: 7, name: 'Cliente', rfc: 'EKU9003173C9', postal_code: '44100' }]} onUpdateClient={editable ? jest.fn() : undefined} /></MemoryRouter>));
  expect(container.querySelectorAll('input[type="text"]')).toHaveLength(editable ? 3 : 1);
  expect(container.querySelector('[aria-label="Ver cliente"]')).not.toBeNull();
});
