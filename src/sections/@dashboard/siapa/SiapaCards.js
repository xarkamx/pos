import { Button, Card, CardContent, CardHeader, Grid, List, ListItem, ListItemText } from '@mui/material';

import { NavLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { SiapaTransaction } from '../../../utils/transactions/SiapaTransaction';


export function SiapaCards () {
  const siapa = useSiapa();
  return <Grid container spacing={2}>
    {siapa?.map((item) => (
      <Grid item xs={12} key={siapa.paymentUrl} md={4}>
        <SiapaCard {...item} />
      </Grid>
    )
    )}
  </Grid>
}

function SiapaCard ({ total, dueDate, status, paymentUrl }) {
  return <Card>
    <CardHeader title={'Siapa'} sx={{
      backgroundColor: status[0].status === 'Pagado' ? '#70cbcb' : 'lightgray',
      color: "white",
      backgroundImage: 'url(/assets/images/siapa.gif)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right bottom',
      backgroundSize: 'contain',
      padding: '1rem'
    }} />
    <CardContent>
      <List>
        <ListItem>
          <ListItemText primary={'Total'} secondary={total} />
        </ListItem>
        <ListItem>
          <ListItemText primary={'Fecha'} secondary={dueDate} />
        </ListItem>
        <ListItem>
          <ListItemText primary={'Estado'} secondary={status[0].status} />
        </ListItem>
        <NavLink to={paymentUrl}>
          <Button fullWidth variant="contained" color="primary">Pagar</Button>
        </NavLink>
      </List>
    </CardContent>
  </Card>
}


function useSiapa () {
  const siapa = new SiapaTransaction();
  const billing = useQuery(['siapa'], async () => siapa.getSiapaBills())
  return billing.data;

}