import { Button, IconButton } from '@mui/material';

import { Link } from 'react-router-dom';
import Iconify from '../iconify/Iconify';

export function DeleteSmallButton ({ onClick }) {
  return (
    <IconButton onClick={onClick} className='delete-button'>
      <Iconify icon="eva:close-fill" sx={{ color: 'red' }} />
    </IconButton>);
}

export function NavButton ({ to, children }) {
  return (
    <a
      href={to}
    >
      <Button variant='contained' color='primary'>
        {children}
      </Button>
    </a>
  );
}