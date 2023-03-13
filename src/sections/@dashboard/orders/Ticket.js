import React from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { localeDate } from '../../../core/helpers';
import { useClientResume } from '../../../hooks/useClients';

function TicketProduct ({ name, qty, amount }) {
  return (
    <tr>
      <td>
        {qty}
      </td>
      <td
        style={{
          paddingRight: '3rem',
        }}>{name}</td>
      <td><Money number={amount} /></td>
    </tr>
  );
}

function ClientTicket ({ orders, latestPurchase, totalDebt }) {
  return (
    <div>
      <h4>Detalles del cliente</h4>
      <ul>
        <li>Compras realizadas: {orders}</li>
        <li>Ultima compra: {localeDate(latestPurchase)}</li>
        <li>Adeudo a la fecha: <Money number={totalDebt} /></li>
        <li>Notas pendientes de pago: {totalDebt}</li>
      </ul>
      <h5>
        Para cualquier duda o aclaración, favor de comunicarse al 3336383996
      </h5>
      No pierdas tu ticket, es tu comprobante de compra
    </div>
  );
}


export const Ticket = React.forwardRef((props, ref) => {
  const { products, orderId, subtotal, discount, total, clientId } = props;
  const { clientResume } = useClientResume(clientId);
  return (
    <div ref={ref} style={{
      padding: '2rem',
    }}>
      <div>
        <h1>Herrajeria Gutierrez</h1>
        <h2>Orden: {orderId}</h2>
      </div>
      <div>
        <h2>Productos</h2>
        <table>
          <tbody>
            {products.map((product) => (
              <TicketProduct
                key={product.id}
                name={product.name}
                qty={product.quantity}
                amount={product.amount}
              />
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <div>
        <h2>Resumen</h2>
        <div>
          subtotal: <Money number={subtotal} />
        </div>
        <div>
          descuento: <Money number={discount} />
        </div>
        <div>
          total: <Money number={total} />
        </div>
      </div>
      <hr />
      <div>
        <h2>Gracias por su compra</h2>
        <ClientTicket
          orders={clientResume?.orders}
          latestPurchase={clientResume?.latestPurchase}
          totalDebt={clientResume?.totalDebt}
        />
      </div>
    </div>
  );
});

