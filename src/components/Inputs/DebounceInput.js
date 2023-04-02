import { TextField } from '@mui/material';
import { useState } from 'react';

let timer = null;
export function DebounceInput ({ timeout = 1000, onChange, value, ...props }) {
  const [val, setValue] = useState(value);

  return <TextField
    variant='standard'
    value={val}
    {...props} onChange={(ev) => {
      clearTimeout(timer);
      setValue(ev.target.value);
      timer = setTimeout(() => {
        onChange(ev);
      }, timeout);
    }} />
};