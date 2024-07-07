
import { Container, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet-async';
import { usePopUp } from '../context/PopUpContext';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';
import { StatusModal } from '../components/CustomModal/StatusModal';
import { ClientActivationForm } from '../sections/auth/login/ClientActivationForm';

export default function ClientCredentials () {

  const mdUp = useResponsive('up', 'md');
  const { popUp, open, toggle } = usePopUp();
  return (
    <>
      <Helmet>
        <title> Registro | HG </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hola, Bienvenido de nuevo
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <ClientActivationForm />
            <StatusModal {...popUp} open={open} onClose={() => {
              toggle();
            }} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}


const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));