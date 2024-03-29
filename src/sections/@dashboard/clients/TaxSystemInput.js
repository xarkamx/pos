
import { useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import { taxSystem, taxUses } from '../../../config/constants'
import { QuickFormInput } from '../../../components/Containers/QuickFormContainer'

export function TaxSystem ({ onChange, value = null }) {
  value = value || "612"
  const [val, setValue] = useState(value)
  const ts = Object.keys(taxSystem)
  const options = ts.map(k => ({ label: taxSystem[k], value: k }))
  useEffect(() => {
    setValue(value)
  }, [value])
  return <Autocomplete
    options={options}
    label='Regimen Fiscal'
    fullWidth
    value={options.find((option) => option.value === val) || null}
    isOptionEqualToValue={(option, value) => option.value === value.value}
    onChange={(ev, value) => {
      setValue(value.value)
      onChange(value)
    }}
    renderInput={(params) => <QuickFormInput {...params} label='Regimen Fiscal' fullWidth />}
  />
}

export function TaxUsesSelector ({ onChange, value = "" }) {
  const [val, setValue] = useState(value)
  const ts = Object.keys(taxUses)
  const options = ts.map(k => ({ label: taxUses[k].description, value: k }))
  useEffect(() => {
    setValue(value)
  }, [value])
  return <Autocomplete
    options={options}
    label='Uso de CFDI'
    fullWidth
    value={options.find((option) => option.value === val) || null}
    isOptionEqualToValue={(option, value) => option.value === value.value}
    onChange={(ev, value) => {
      setValue(value.value)
      onChange(value)
    }}
    renderInput={(params) => <QuickFormInput {...params} label='Uso de CDFI' fullWidth />}
  />
}