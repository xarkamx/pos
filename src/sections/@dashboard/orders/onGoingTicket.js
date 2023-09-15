import React from 'react';

export const CheckoutOngoingTicket = React.forwardRef((props, ref) => {
  const { products } = props;
  return <div ref={ref}>
    <p>Pedido en caja:</p>
    <table style={{
      width: '90%',
      textAlign: 'justify',
      fontSize: '.8rem',
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
})


function TicketProduct ({ name, qty }) {
  return (
    <tr >
      <td style={{
        borderBottom: '1px solid #000',
      }}>
        {qty}
      </td>
      <td
        style={{
          textAlign: 'center',
          borderBottom: '1px solid #000',
        }}>{name}</td>
    </tr>
  );
}
