import { Card, List, ListItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';


export function QuickFormContainer ({ children, title = 'quickForm', onSubmit }) {
  return (
    <form
      className='quick-form-container'
      onSubmit={(ev) => {
        ev.preventDefault()
        onSubmit(ev)
      }}>
      <Card sx={{
        padding: 2,
      }}>
        <Typography variant="h4">{title}</Typography>
        <List>
          {children}
        </List>
      </Card>
    </form>
  );
}

export function QuickFormInput ({ pattern, onChange, ...props }) {
  const [error, setError] = useState(false)
  return <ListItem>
    <TextField {...props}
      error={error}
      onChange={(ev) => {
        const isValid = ev.target.checkValidity()
        setError(!isValid)
        onChange(ev)
      }} inputProps={{
        pattern
      }} />
  </ListItem>
}