import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, List, ListItem, Button, ListItemText } from '@mui/material';
import { ConditionalWall } from '../../../components/FilterWall/ConditionalWall';



export function ClientCard ({
  id,
  rfc,
  name,
  phones,
  email,
}) {
  const navigate = useNavigate();
  return (
    <Card className='ClientCard'>
      <CardHeader title={name} />
      <CardContent>
        <List>
          <ListItemText primary='RFC' secondary={rfc || 'XAXX010101000'} />
          <ListItemText primary='Email' secondary={email || 'N/A'} />
          <PhonesList phones={phones} />
          <ConditionalWall condition={rfc}>
            <ListItem type='container'>
              <Button variant='contained' fullWidth color='primary' onClick={() => {
                navigate(`/dashboard/clientes/${id}`)
              }}>Detalles</Button>
            </ListItem>
          </ConditionalWall>

        </List>
      </CardContent>

    </Card>
  )
}

function PhonesList ({ phones = [] }) {
  if (!Array.isArray(phones)) phones = [phones];
  if (!phones || phones.length === 0) return null;
  return (
    <>
      {phones.map((phone) => (
        <a href={`tel:${phone}`} key={phone}>{phone}</a>
      ))}
    </>
  );
}