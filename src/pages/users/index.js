import { Grid } from '@mui/material';
import { UsersTable } from '../../sections/@dashboard/users/UsersTable';
import { useUsers } from '../../hooks/useUsers';
import { QuickUsersForm } from '../../sections/@dashboard/users/QuickUsersForm';

export function UsersPage () {
  const { userList, addUser, deleteUser } = useUsers()
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <QuickUsersForm onSubmit={addUser} />
      </Grid>
      <Grid item xs={12} md={8}>
        <UsersTable users={userList.data} onDelete={deleteUser} />
      </Grid>
    </Grid>
  )
}