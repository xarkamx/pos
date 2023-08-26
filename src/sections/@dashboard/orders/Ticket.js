import React from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { useClient } from '../../../hooks/useClients';
import { ConditionalWall } from '../../../components/FilterWall/ConditionalWall';
import { numberPadStart, localeDate } from '../../../core/helpers';

function TicketProduct ({ name, qty, amount }) {
  return (
    <tr style={{
      fontSize: '0.6rem',
      borderBottom: '1px solid #aaa',

    }}>
      <td >
        {qty}
      </td>
      <td
        style={{
          textAlign: 'left'
        }}
      >{name}</td>
      <td
        style={{
          textAlign: 'right'
        }}
      ><Money number={amount} /></td>
    </tr>
  );
}

function ClientTicket ({ clientName, clientRfc, orders, latestPurchase, totalDebt }) {
  return (
    <div style={{
      fontSize: '0.5rem',
      fontWeight: 'bold',
    }}>
      <h4>Detalles del cliente</h4>
      <h5>{`${clientName} (${clientRfc || 'XAXX010101000'})`}</h5>
      <ul style={{
        listStyle: 'none',
      }}>
        <li>Compras realizadas: {orders}</li>
        <li>Ultima compra: {localeDate(latestPurchase)}</li>
        <li>Adeudo a la fecha: <Money number={totalDebt} /></li>
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
  const { clientResume, client } = useClient(clientId);
  const sectionStyle = {
    marginTop: '.5rem',

    padding: '0 2%'
  }
  return (
    <div ref={ref} style={{
      height: '100%',
      textAlign: 'justify',
      fontSize: '0.7rem',
      fontFamily: 'monospace',
      color: '#000',
    }}>
      <div style={{
        textAlign: 'center',
        alignItems: 'center',
      }}>

        <h3>Hojalateria Gutierrez</h3>

        <h3>NOTA DE VENTA: {numberPadStart(2, orderId)}</h3>
      </div>
      <div style={sectionStyle}>
        <i>
          <h4>Fecha: {localeDate(new Date())}</h4>
        </i>
        <p>{client?.name}</p>
        <h4>Productos</h4>
        <hr />
        <table style={{
          width: '100%',
        }}>
          <tbody>
            {products.map((product) => (
              <TicketProduct
                key={product.id}
                name={product.name}
                qty={product.quantity}
                price={product.price}
                amount={product.amount}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div style={
        {
          ...sectionStyle,
          // pageBreakBefore: products.length > 5 ? 'always' : 'auto'
        }}>
        <h4 style={{
          fontSize: '1rem',
        }}>Resumen</h4>
        <DetailsTag label={'subtotal'} value={subtotal} />
        <DetailsTag label={'descuento'} value={discount} />
        <DetailsTag label={'total'} value={total} />
        <ConditionalWall condition={payment < total}>
          <DetailsTag label={'pagado parcial'} value={payment} />
        </ConditionalWall>
      </div>

      <ConditionalWall condition={clientResume?.clientName}>
        <div style={sectionStyle}>
          <ClientTicket
            clientName={clientResume?.clientName}
            clientRfc={clientResume?.rfc}
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
      borderBottom: '.1rem solid #ccc',
      fontSize: '0.5rem',
      fontWeight: 'bold',
    }}>
      <span>{label}</span>
      <span><Money number={value} /></span>
    </div>
  );
}