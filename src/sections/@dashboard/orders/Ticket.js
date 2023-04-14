import React from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { useClientResume } from '../../../hooks/useClients';
import { ConditionalWall } from '../../../components/FilterWall/ConditionalWall';
import { numberPadStart, localeDate } from '../../../core/helpers';

function TicketProduct ({ name, qty, amount }) {
  return (
    <tr >
      <td style={{
        borderBottom: '1px solid #000',
      }}>
        {qty}
      </td>
      <td
        style={{
          paddingRight: '3rem',
          borderBottom: '1px solid #000',
        }}>{name}</td>
      <td style={{
        borderBottom: '1px solid #000',
      }}><Money number={amount} /></td>
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
  const { products, orderId, subtotal, discount, total, clientId, payment } = props;
  const { clientResume } = useClientResume(clientId);
  const sectionStyle = {
    marginTop: '2rem',
    borderRadius: '5px',
    border: '1px solid #000',
    padding: '1rem',
  }
  return (
    <div ref={ref} style={{
      padding: '2rem',
      border: '1px solid #000',
      borderRadius: '5px',
      height: '100%',
      textAlign: 'justify',
      fontSize: '0.8rem',
    }}>
      <div style={{
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <img src='/assets/logo.svg' alt='logo' style={{
          width: '80px',
        }} />
        <h3>NOTA: {numberPadStart(2, orderId)}</h3>
      </div>
      <div style={sectionStyle}>
        <h4>Productos</h4>
        <hr />
        <table style={{
          width: '100%'
        }}>
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
      <div style={sectionStyle}>
        <h4>Resumen</h4>
        <DetailsTag label={'subtotal'} value={subtotal} />
        <DetailsTag label={'descuento'} value={discount} />
        <DetailsTag label={'total'} value={total} />
        <ConditionalWall condition={payment < total}>
          <DetailsTag label={'pagado parcial'} value={payment} />
        </ConditionalWall>
      </div>

      <ConditionalWall condition={clientResume}>
        <div style={sectionStyle}>
          <ClientTicket
            orders={clientResume?.orders}
            latestPurchase={clientResume?.latestPurchase}
            totalDebt={clientResume?.totalDebt}
          />
        </div>
      </ConditionalWall>
    </div>
  );
});

function DetailsTag ({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: '1px solid #000',
    }}>
      <span>{label}</span>
      <span><Money number={value} /></span>
    </div>
  );
}