import { QuickFormContainer } from '../../../components/Containers/QuickFormContainer';
import { taxSystem } from '../../../config/constants';

export function ClientReadOnlyDetails({ rfc, name, email, phones, postalCode, taxSystem: regime }) {
  const fields = {
    Nombre: name,
    RFC: rfc,
    Email: email,
    Teléfono: Array.isArray(phones) ? phones.join(', ') : phones,
    'Código Postal': postalCode,
    'Régimen Fiscal': taxSystem[regime] || regime,
  };
  return <QuickFormContainer title="Cliente">
    <dl>{Object.entries(fields).map(([label, value]) => <div key={label}>
      <dt>{label}</dt><dd>{value || '—'}</dd>
    </div>)}</dl>
  </QuickFormContainer>;
}
