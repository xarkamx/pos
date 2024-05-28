import { useClients } from '../hooks/useClients';
import { ClientsTable } from '../sections/@dashboard/clients/ClientsTable';
import { QuickClientForm } from '../sections/@dashboard/clients/QuickClientAddForm';
import { SmartGrid } from '../components/Containers/SmartGrid';


export default function ClientsPage () {
  const { clients, addClient, updateClient } = useClients();
  return (
    <SmartGrid container >
      <SmartGrid title='Nuevo Cliente' item xs={12} md={4}>
        <QuickClientForm onSubmit={addClient} />
      </SmartGrid>
      <SmartGrid title='Clientes' item xs={12} md={8}>
        <ClientsTable clients={clients} onUpdateClient={updateClient} />
      </SmartGrid>

    </SmartGrid>
  );
}

