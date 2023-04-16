
import { useMutation, useQuery } from 'react-query';
import { ClientsTransaction } from '../utils/transactions/clientsTransaction';
import { usePopUp } from '../context/PopUpContext';

export function useClients () {
  const { popUpAlert } = usePopUp();
  const query = useQuery('clients', () => new ClientsTransaction().getClients());
  const mutation = useMutation((client) => new ClientsTransaction().addClient(client), {
    onSuccess: () => {
      popUpAlert('success', 'Cliente agregado correctamente');
      query.refetch();
    }
  });

  const updateMutation = useMutation((content) => new ClientsTransaction()
    .updateClient(content.id, content.client), {
    onSuccess: () => {
      query.refetch();
    }
  });
  return { clients: query.data, addClient: mutation.mutate, updateClient: updateMutation.mutate }
}

export function useClientResume (id) {
  const query = useQuery(['clientResume', id], () => new ClientsTransaction().getClientResume(id));
  return { clientResume: id ? query.data : undefined }
}