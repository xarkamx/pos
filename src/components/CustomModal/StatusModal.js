import { Box, Card, Modal, Typography, Button } from '@mui/material';

import Iconify from '../iconify/Iconify';

export function StatusModal ({ status, message, open, onClose, onAccept }) {
  return (
    <Modal open={Boolean(open)} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
      }}>
        <Card sx={{
          p: 3,
        }}>
          <Iconify
            icon={status === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'}
            color={status === 'success' ? 'green' : 'red'}
            width={50}
            sx={{
              fontSize: 100,
              display: 'block',
              margin: 'auto',
            }}
          />
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            {message}
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} fullWidth onClick={(e) => {
            onClose(e);
            onAccept?.(e);
          }}>
            Aceptar
          </Button>
        </Card>
      </Box>

    </Modal>
  )
}
