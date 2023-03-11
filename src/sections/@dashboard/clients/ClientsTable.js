import { PaginatedTable } from '../../../components/tables/paginatedTable';

export function ClientsTable ({ clients = [] }) {
  return (
    <PaginatedTable
      items={clients}
      titles={['Id', 'Nombre', 'RFC', 'Teléfonos', 'Email', 'Facturable']}
      format={(client) => ([
        client.id,
        client.name,
        client.rfc,
        client.phones.join(', ') || 'N/A',
        <a href={`mailto:${client.email}`} key={`mail-${client.id}`}>
          {client.email}
        </a>,
        client.legal,
      ])}
    />
  )
}