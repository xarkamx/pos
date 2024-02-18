

import React, { useEffect } from 'react';

import { useReactToPrint } from 'react-to-print';
import { isObjectEmpty, localeDate } from '../../../core/helpers';
import { Money } from '../../../components/Formats/FormatNumbers';
import { ConditionalWall } from '../../../components/FilterWall/ConditionalWall';
import { ClientTicket } from './Ticket';
import { useClient } from '../../../hooks/useClients';

export function PaymentOrderTicket ({ clientResume, amount, date, currentDebt }) {
  const sectionStyle = {
    marginTop: '.5rem',

    padding: '0 2%'
  }
  return (

    <div style={{
      textAlign: 'center',
      alignItems: 'center',
    }}>

      <h3>Hojalateria Gutierrez</h3>
      <ul>
        <li>Pago: <Money number={amount} /></li>
        <li>Fecha: {localeDate(date)}</li>
        <li>Deuda: <Money number={currentDebt} /> </li>
      </ul>
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
      <p>Gracias por su preferencia</p>
    </div>
  );
}



export function AutoPrintablePaymentTicket ({ clientId, amount, date, currentDebt, printable = false, onAfterPrint }) {
  const { clientResume } = useClient(clientId);
  const ref = React.useRef();

  const print = useReactToPrint({
    content: () => ref.current,
    onAfterPrint
  },

  )
  useEffect(() => {
    if (printable && !isObjectEmpty(clientResume)) {
      print();
    }
  }, [printable, clientResume, print]);
  return <TicketPayment ref={ref} clientResume={clientResume} amount={amount} date={date} currentDebt={currentDebt} />
}


export const TicketPayment = React.forwardRef((props, ref) => {
  const { clientResume, amount, date, currentDebt } = props;
  return <div style={{
    display: 'none',
  }}><div ref={ref} style={{
    height: '100%',
    textAlign: 'justify',
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    color: '#000',
  }}><PaymentOrderTicket ref={ref} clientResume={clientResume} amount={amount} date={date} currentDebt={currentDebt} />
    </div>
  </div>
});