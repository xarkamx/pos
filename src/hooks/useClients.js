
import { useMutation, useQuery } from 'react-query';
import { ClientsTransaction } from '../utils/transactions/clientsTransaction';

export function useClients () {
  const query = useQuery('clients', () => new ClientsTransaction().getClients());
  const mutation = useMutation((client) => new ClientsTransaction().addClient(client), {
    onSuccess: () => {
      query.refetch();
    }
  });
  return { clients: query.data, addClient: mutation.mutate }
}

export function useClientResume (id) {
  const query = useQuery(['clientResume', id], () => new ClientsTransaction().getClientResume(id));
  return { clientResume: query.data }
}