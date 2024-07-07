import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { usePopUp } from '../../../context/PopUpContext';
import { useAuth } from '../../../hooks/useAuth';
import { useCState } from '../../../hooks/useHooks';
import { useValidate } from '../../../hooks/useValidate';
import { LoginTransaction } from '../../../utils/transactions/loginTransaction';
import { UsersTransactions } from '../../../utils/transactions/usersTransaction';

export function ClientActivationForm () {
  const { client, setClient, onSubmit, loading } = useClientActivation();
  return <QuickFormContainer title="Activa tu cuenta!" onSubmit={onSubmit}>
    <QuickFormInput label="Correo"
      type="email"
      fullWidth value={client.email} required onChange={(ev) => {
        setClient({ email: ev.target.value })
      }} />
    <QuickFormInput label="Password" type="password" fullWidth required value={client.password} onChange={(ev) => {
      setClient({ password: ev.target.value })
    }} />
    <QuickFormInput label="Confirmar Password" type="password" fullWidth required value={client.confirmPassword} onChange={(ev) => {
      setClient({ confirmPassword: ev.target.value })
    }} />
    <QuickFormButton
      type="submit"
      disabled={loading}
      variant="contained"
      fullWidth
    >{loading ? 'Cargando...' : 'Activar'}</QuickFormButton>
  </QuickFormContainer>
}

function useClientActivation () {
  const { popUpAlert } = usePopUp();
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useCState({
    email: '',
    password: '',
    confirmPassword: '',
    errors: {}
  });

  const navigate = useNavigate();
  const auth = useAuth();

  const { validate, errors } = useValidate({
    type: 'object',
    required: ['email', 'password', 'confirmPassword'],
    properties: {
      password: {
        type: 'string',
        minLength: 3,
        errorMessage: 'La contraseña debe tener al menos 3 caracteres',
      },
      confirmPassword: {
        type: 'string',
        minLength: 3,
        errorMessage: 'La contraseña debe tener al menos 3 caracteres',
      },
      email: {
        type: 'string',
        errorMessage: 'El correo no es válido',
      }
    }
  })

  const onSubmit = async () => {
    setLoading(true);
    if (client.password !== client.confirmPassword) {
      popUpAlert('error', 'Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    if (!validate(client)) {

      popUpAlert('error', errors.email || errors.password || errors.confirmPassword);
      setClient({ errors });
      setLoading(false);
      return;
    }

    const service = new UsersTransactions();
    try {
      await service.activateClient(client);
      popUpAlert('success', 'Cliente activado correctamente', async () => {
        const login = new LoginTransaction();
        const token = await login.login(client.email, client.password);
        console.log(token);
        auth.setAccess(token);
        navigate('/');
      });
    }
    catch (e) {
      popUpAlert('error', codeMessages[`${e.obj.statusCode}`] || 'Error desconocido');
      setLoading(false);
    }
  }


  return { client, setClient, onSubmit, loading }
}

const codeMessages = {
  "400": "Cliente ya activado",
  "404": "Solicita apoyo en hojalateriagutierrez@gmail.com",
  "500": "Hubo un error en el servidor, intenta más tarde"
}