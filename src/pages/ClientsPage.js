import { Grid } from '@mui/material';
import { useClients } from '../hooks/useClients';
import { ClientsTable } from '../sections/@dashboard/clients/ClientsTable';
import { QuickClientForm } from '../sections/@dashboard/clients/QuickClientAddForm';


export default function ClientsPage () {
  const { clients, addClient, updateClient } = useClients();
  return (
    <Grid container spacing={2}>
      <Grid item sm={12} md={4}>
        <QuickClientForm onSubmit={addClient} />
      </Grid>
      <Grid item sm={12} md={8}>
        <ClientsTable clients={clients} onUpdateClient={updateClient} />
      </Grid>

    </Grid>
  );
}

