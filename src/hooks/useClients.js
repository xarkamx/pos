
import { useState } from 'react';
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

export function useClient (id) {
  const { popUpAlert } = usePopUp();
  const [paymentDetails, setPaymentDetails] = useState({
    date: new Date(),
    amount: 0,
    method: 'Efectivo',
    printable: false
  });
  const query = useQuery(['clientResume', id], () => new ClientsTransaction().getClientResume(id));
  const client = useQuery(['client', id], () => new ClientsTransaction().getClient(id));
  const clientPayments = useQuery(['clientPayments', id], () => new ClientsTransaction().getClientPayments(id));
  const clientDebts = useQuery(['clientDebts', id], () => new ClientsTransaction().getClientDebts(id));
  const payClientDebt = useMutation((content) => new ClientsTransaction()
    .payClientDebt(id, content.amount, content.method), {
    onSuccess: (resp) => {
      query.refetch();
      popUpAlert('success', 'Pago realizado correctamente');
      setPaymentDetails({ ...resp, printable: true });
      return resp;
    },
    onError: (error) => {
      popUpAlert('error', error.message);

    }
  });
  const setClient = useMutation((content) => new ClientsTransaction()
    .updateClient(content.id, content.client), {
    onSuccess: () => {
      client.refetch();
    },
    onError: (error) => {
      popUpAlert('error', error.message);
    }
  });

  return {
    clientResume: query?.data || {},
    clientDebt: clientDebts?.data || {},
    payClientDebt: payClientDebt.mutate,
    client: client?.data,
    setClient: setClient.mutate,
    clientPayments: clientPayments?.data || [],
    paymentDetails,
    setPaymentDetails
  }
}