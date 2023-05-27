import { useMutation, useQuery } from 'react-query';
import { UsersTransactions } from '../utils/transactions/usersTransaction';

export function useUsers () {
  const transaction = new UsersTransactions();
  const userList = useQuery('users', () => transaction.getUsers());
  const addUser = useMutation((user) => transaction.addUser(user), {
    onSuccess: () => {
      userList.refetch();
    },
  });
  const updateUser = useMutation((user) => transaction.updateUser(user), {
    onSuccess: () => {
      userList.refetch();
    },
  });

  return {
    userList,
    addUser: addUser.mutate,
    updateUser,
  }
}