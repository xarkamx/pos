import { Button, Input } from '@mui/material';
import { useState } from 'react';

export function EditableContainer ({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  return <>
    {editing ? <Input type='text' value={value} onChange={(ev) => {
      onChange(ev.target.value);
    }} onBlur={() => {
      setEditing(false);
    }} /> : <Button onClick={() => {
      setEditing(true);
    }}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter') {
          setEditing(false);
        }
      }}
      tabIndex="0"
    >{value}</Button>}
  </>
}