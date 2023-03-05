import { Grid, TextField } from '@mui/material';
import { useCState } from '../../hooks/useHooks';

export function SearchDatesInputs ({ onChange }) {
  const [dates, setDates] = useCState({
    from: null,
    to: null,
  });
  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth label="Desde"
          InputLabelProps={{ shrink: true }}
          type='date' onChange={(ev) => {
            setDates({ from: ev.target.value });
            onChange({ ...dates, from: ev.target.value });
          }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth label="Hasta"
          InputLabelProps={{ shrink: true }}
          type='date' onChange={(ev) => {
            setDates({ to: ev.target.value });
            onChange({ ...dates, to: ev.target.value });
          }} />
      </Grid>
    </Grid>
  </>
}