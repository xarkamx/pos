const { Grid, Card } = require('@mui/material');
const { Money } = require('../../../components/Formats/FormatNumbers');

export function TotalResume ({ payments, onClick }) {
  const resume = resumePayments(payments);
  if (!resume) return (<></>);
  return (
    <Grid
      container
      spacing={1}
      sx={{
        padding: '.6rem',
      }}
    >
      <Grid item xs={12} md={4}>
        <ResumeCard title="Total" amount={resume.total} color="primary.main" subTypes={resume} onClick={() => {
          onClick('');
        }} />
      </Grid>
      <Grid item xs={12} md={4}>
        <ResumeCard title="Entradas" amount={resume.inflow.total} color="success.main" subTypes={resume.inflow}
          onClick={() => {
            onClick('inflow');
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ResumeCard title="Salidas" amount={resume.outflow.total} color="error.main" subTypes={resume.outflow}
          onClick={() => {
            onClick('outflow');
          }}
        />
      </Grid>
    </Grid>
  );
}

function resumePayments (payments) {
  const init = {
    total: 0,
    cash: 0,
    deposit: 0,
    inflow: {
      total: 0,
      cash: 0,
      deposit: 0,
    },
    outflow: {
      total: 0,
      cash: 0,
      deposit: 0,
    },
  };
  return payments?.reduce((acc, item) => {
    const amount = item.flow === 'inflow' ? item.amount : -item.amount;

    acc[item.flow].total += item.amount;
    acc[item.flow][item.paymentMethod === 1 ? 'cash' : 'deposit'] += item.amount;
    acc.total += amount;
    acc[item.paymentMethod === 1 ? 'cash' : 'deposit'] += amount;
    return acc;
  }, init);
}

function ResumeCard ({
  title = '',
  amount = 0,
  color = 'primary.main',
  subTypes = {
    cash: 0,
    deposit: 0,
  },
  onClick = () => { },
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        padding: '.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        cursor: 'pointer',
        backgroundColor: color,
        boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
        '& > *': {
          margin: '0.5rem 0',
        },
      }}
    >
      <h2>{title}</h2>
      <Money number={amount} />
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <h3>Efectivo</h3>
          <Money number={subTypes.cash} />
        </Grid>
        <Grid item xs={6}>
          <h3>Deposito</h3>
          <Money number={subTypes.deposit} />
        </Grid>
      </Grid>
    </Card>
  );
}
