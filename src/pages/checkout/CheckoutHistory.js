
import { Button } from '@mui/material';
import { useState } from 'react';
import { CustomTable } from '../../components/tables/Table';
import { useHistory } from '../../hooks/useHooks';

export function CheckoutHistory () {
  const [orders, setOrders] = useState(getAllCheckOutItems());
  const history = useHistory();
  return (
    <div>
      <h1>Historial</h1>
      <CustomTable
        titles={['ID', 'cliente', 'fecha', 'Total', 'Pago', 'Cantidad de productos', 'Acciones']}
        content={orders}

        format={(item) => [
          item.id,
          item.clientId ?? 'Publico General',
          new Date(parseInt(item.id.split('-')[1], 10)).toLocaleDateString(),
          item.total,
          item.payment,
          item.products.length,
          <><Button onClick={() => history(`/dashboard/caja`, {
            localId: item.id
          })}>Ver</Button>
            <Button
              variant='contained'
              color='error'
              onClick={() => {
                localStorage.removeItem(item.id);
                setOrders(getAllCheckOutItems());
              }}>Eliminar</Button>
          </>
        ]}
      />
    </div>
  );
}

function getAllCheckOutItems () {
  const items = { ...localStorage };
  return Object.keys(items).filter((key) => key.includes('checkout-')).map((key) => {
    const { products, total, subtotal, discount, clientId, payment } = JSON.parse(items[key]);
    return {
      id: key,
      products,
      total,
      subtotal,
      discount,
      clientId,
      payment
    }
  })
}