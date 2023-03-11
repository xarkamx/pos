import { Grid } from '@mui/material';
import { useClients } from '../hooks/useClients';
import { ClientsTable } from '../sections/@dashboard/clients/ClientsTable';
import { QuickClientForm } from '../sections/@dashboard/clients/QuickClientAddForm';

export default function ClientsPage () {
  const { clients, addClient } = useClients();
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <QuickClientForm onSubmit={addClient} />
      </Grid>
      <Grid item xs={8}>
        <ClientsTable clients={clients} />
      </Grid>
    </Grid>
  );
}

