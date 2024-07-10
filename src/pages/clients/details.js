
import { useMutation, useQuery } from 'react-query';
import { Grid } from '@mui/material';
import { NewPasswordForm } from '../users/me';
import { ClientBasicForm, ClientCards } from './client';
import { ClientsTransaction } from '../../utils/transactions/clientsTransaction';
import { ConditionalWall } from '../../components/FilterWall/ConditionalWall';

export function ClientDetails () {
  const { details, myResume, updateDetails } = useClientMyDetails();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ClientCards {...myResume} />
      </Grid>
      <Grid item xs={6}>
        <ConditionalWall condition={details}>
          <ClientBasicForm
            rfc={details.rfc}
            name={details.name}
            email={details.email}
            phones={details.phones}
            legal={details.legal}
            postalCode={details.postal_code}
            taxSystem={details.tax_system}
            onItemChange={(details) => {
              updateDetails(details);
            }}
          />
        </ConditionalWall>
      </Grid>
      <Grid item xs={6}>
        <NewPasswordForm />
      </Grid>
    </Grid>
  );
}

function useClientMyDetails () {
  const service = new ClientsTransaction();
  const details = useQuery('myDetails', async () => service.getMyDetails());

  const myResume = useQuery('myResume', async () => service.getMyResume());

  const updateDetails = useMutation((content) => service.updateMyDetails(content));
  return {
    details: details.data || false,
    myResume: myResume.data || false,
    updateDetails: updateDetails.mutate
  };
}