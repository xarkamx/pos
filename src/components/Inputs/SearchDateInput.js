import { Grid, TextField } from '@mui/material';
import { useCState } from '../../hooks/useHooks';
import { validInputDate } from '../../core/helpers';

export function SearchDatesInputs ({ onChange, dfrom }) {
  const [dates, setDates] = useCState({
    from: null,
    to: null,
  });
  let debounce1 = null;
  let debounce2 = null;
  return <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <TextField
        defaultValue={validInputDate(dfrom)}
        fullWidth label="Desde"
        InputLabelProps={{ shrink: true }}
        type='date' onChange={(ev) => {
          const stringDate = ev.target.value.replace(/-/g, '/');
          const date = new Date(stringDate).setHours(0, 0, 0, 0);
          setDates({ from: date });
          clearTimeout(debounce1);
          debounce1 = setTimeout(() => {
            onChange({ ...dates, from: date });
          }, 1000);

        }} />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        defaultValue={validInputDate(new Date())}
        fullWidth label="Hasta"
        InputLabelProps={{ shrink: true }}
        type='date' onChange={(ev) => {
          const stringDate = ev.target.value.replace(/-/g, '/');
          const date = new Date(stringDate).setHours(23, 59, 59, 999);
          setDates({ to: date });
          clearTimeout(debounce2);
          debounce2 = setTimeout(() => {
            onChange({ ...dates, to: date });
          }, 1000);

        }} />
    </Grid>
  </Grid>
}