import { Card } from '@mui/material';
import './BasicCard.css';



export function BasicCard ({ title, children, ...props }) {
  return (
    <Card className='basicCard' {...props}>
      <h2>{title}</h2>
      <div>{children}</div>
    </Card>
  );
}