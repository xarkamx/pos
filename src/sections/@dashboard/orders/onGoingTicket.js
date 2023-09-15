import React from 'react';

const { TicketProduct } = require('./sTicket');

export const CheckoutOngoingTicket = React.forwardRef((props, ref) => {
  const { products } = props;
  return <div ref={ref}>
    <p>Pedido:</p>
    <table style={{
      width: '00%',
      textAlign: 'justify',
      fontSize: '0.8rem',
    }}>
      <thead>
        <tr>
          <td>Cantidad</td>
          <td>Producto</td>
          <td>Precio</td>
          <td>Importe</td>
        </tr>
      </thead>
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