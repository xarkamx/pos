
import { useState } from 'react';
import { Box, Button, Card, Modal, TextField, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Iconify from '../iconify/Iconify';

export function DangerModal ({ onConfirm, condition, open, message, onClose }) {
  const [confirm, setConfirm] = useState(0);
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
      }}>
        <Card sx={{
          p: 3,
          justifyContent: 'center',
        }} >
          <Iconify>
            <DeleteForeverIcon sx={{
              margin: '0 auto',
              display: 'block',
              fontSize: 50,
            }} color='error' fontSize='large' />
          </Iconify>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            {message}
          </Typography>
          <TextField variant="outlined" fullWidth label="Confirmacion" type="text" onChange={(ev) => {
            setConfirm(condition(ev.target.value))
          }} />
          <Button variant="contained" color='error' sx={{ mt: 2 }} disabled={!confirm} fullWidth onClick={onConfirm}>
            Aceptar
          </Button>
        </Card>
      </Box>
    </Modal>
  )
}