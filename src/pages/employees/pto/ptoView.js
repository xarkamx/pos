

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useParams } from 'react-router-dom';
import { PTOForm } from './ptoForm';
import { CustomTable } from '../../../components/tables/Table';
import { usePTO } from '../hooks/usePTO';
import { localeDate } from '../../../core/helpers';

export function PTOView () {
  const { employeeId } = useParams()
  const { req, createPTO, changeStatus } = usePTO(employeeId)
  return <div>
    <div>
      <PTOForm onSubmit={createPTO} />
      <PTOList ptos={req.pto} changeStatus={changeStatus} />
    </div>
  </div>
}

export function PTOList ({ ptos, changeStatus }) {
  return <CustomTable
    titles={['Inicio', 'Final', 'Tipo', 'Acciones']}
    content={ptos}
    format={(item) => [
      localeDate(item.startDate),
      localeDate(item.endDate),
      item.ptoType,
      <StatusForm
        key={`status-${item.id}`}
        status={item.status}
        onChange={(status) => {
          changeStatus(item.id, status)
        }}
      />
    ]}
  />
}


function StatusForm ({ status, onChange }) {
  return (<FormControl
    style={{
      marginBottom: '1rem'
    }}
    fullWidth>
    <InputLabel id="status-type-label">Tipo</InputLabel>
    <Select value={status}
      labelId="status-type-label"
      id="status-type-select" fullWidth
      onChange={(ev) => {
        onChange(ev.target.value)
      }}
    >
      <MenuItem value='approved'>Aprobada</MenuItem>
      <MenuItem value='rejected'>Rechazada</MenuItem>
    </Select>
  </FormControl>)
}

