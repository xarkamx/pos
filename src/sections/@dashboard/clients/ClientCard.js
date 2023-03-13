import { Card, CardContent, CardHeader, List, ListItem, Button, ListItemText } from '@mui/material';
import { ConditionalWall } from '../../../components/FilterWall/ConditionalWall';


export function ClientCard ({
  rfc,
  name,
  phones,
  email,
}) {

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
              <Button variant='contained' fullWidth color='primary'>Detalles</Button>
            </ListItem>
          </ConditionalWall>

        </List>
      </CardContent>

    </Card>
  )
}

function PhonesList ({ phones = [] }) {
  if (!phones || phones.length === 0) return null;
  return (
    <>
      {phones.map((phone) => (
        <a href={`tel:${phone}`} key={phone}>{phone}</a>
      ))}
    </>
  );
}