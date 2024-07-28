import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { useMaterial } from '../hooks/useMaterial';


export function BasicMaterialSearch ({ onChange }) {
  const [material, setMaterial] = useState({})
  const { materials } = useMaterial();
  const options = (materials || []).map((m) => ({
    label: m.name,
    id: m.id,
    extras: m
  }));
  return <Autocomplete
    value={material.label || ''}
    disablePortal
    options={options}
    fullWidth
    onChange={(ev, nv) => {
      if (!nv?.id) return;
      setMaterial(nv);
      onChange?.(nv);
    }}
    renderInput={(params) => <TextField {...params} autoFocus label="Materiales" />} />
}