import { IconButton } from '@mui/material';
import Iconify from '../iconify/Iconify';

export function DeleteSmallButton ({ onClick }) {
  return (
    <IconButton onClick={onClick} className='delete-button'>
      <Iconify icon="eva:close-fill" sx={{ color: 'red' }} />
    </IconButton>);
}