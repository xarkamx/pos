import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { LoginTransaction } from '../../../utils/transactions/loginTransaction';
import { useAuth } from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function LoginForm () {
  const navigate = useNavigate();
  const { setPassword, setEmail, onSubmit } = useLogin();
  const [showPassword, setShowPassword] = useState(false);



  return (
    <form onSubmit={(ev) => {
      ev.preventDefault();
      onSubmit();
      navigate('/dashboard', { replace: true });
    }}>
      <Stack spacing={3}>
        <TextField name="email" label="Correo" onChange={(ev) => {
          setEmail(ev.target.value);
        }} />

        <TextField
          name="password"
          label="Password"
          onChange={(ev) => {
            setPassword(ev.target.value);
          }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>


      <LoadingButton fullWidth sx={{
        margin: '16px 0'
      }} size="large" type="submit" variant="contained" >
        Login
      </LoadingButton>
    </form>
  );
}

function useLogin () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  const onSubmit = async () => {
    const basService = new LoginTransaction();
    auth.setAccess(await basService.login(email, password));
  };

  return { setPassword, setEmail, onSubmit };
};