
import { useEffect, useState } from 'react';
import { Button, Card, Grid } from '@mui/material';
import { QuickFormContainer, QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { usePopUp } from '../../context/PopUpContext';
import { UsersTransactions } from '../../utils/transactions/usersTransaction';

export function MyAccount () {
  return <Grid container>

    <Grid item xs={12}>
      <Card >
        <NewPasswordForm />
      </Card>
    </Grid>
  </Grid>
};


export function NewPasswordForm () {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const { popUpAlert } = usePopUp();
  useEffect(() => {
    if (password !== confirmPassword) {
      setError(true);
      return;
    }
    setError(false);

  }, [password, confirmPassword]);
  return <QuickFormContainer title={'Cambiar contraseña'} onSubmit={async () => {
    if (error) return popUpAlert('error', 'Las contraseñas no coinciden');
    const service = new UsersTransactions();
    const response = await service.changeMyPassword(password);
    if (!response) return popUpAlert('error', 'Ocurrió un error al cambiar la contraseña')
    if (response.error) return popUpAlert('error', response.error);
    if (response.code === 200)
      popUpAlert('success', 'Contraseña cambiada correctamente');
    return true;
  }}>
    <QuickFormInput
      helperText={error ? 'Las contraseñas no coinciden' : ''}
      label='Nueva contraseña'
      fullWidth
      value={password}
      type='password'
      inputProps={
        {
          minLength: 6,
        }
      }
      onChange={(ev) => {
        setPassword(ev.target.value);
      }}
    />
    <QuickFormInput
      error={error}
      helperText={
        error ? 'Las contraseñas no coinciden' : ''
      }
      label='Confirmar contraseña'
      fullWidth type='password'
      value={confirmPassword}
      onChange={
        (ev) => {
          setConfirmPassword(ev.target.value);
        }
      }
    />
    <Button fullWidth type='submit'>Cambiar contraseña</Button>
  </QuickFormContainer>
}