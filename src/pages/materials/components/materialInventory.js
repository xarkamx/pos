

import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { IconButton, List } from '@mui/material';
import { CustomTable } from '../../../components/tables/Table';
import { MaterialTransaction } from '../../../utils/transactions/materialTransaction';
import { Money } from '../../../components/Formats/FormatNumbers';
import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../../components/Containers/QuickFormContainer';
import { BasicMaterialSearch } from './MaterialSelector';
import { SmartGrid } from '../../../components/Containers/SmartGrid';
import { useCState } from '../../../hooks/useHooks';
import { usePopUp } from '../../../context/PopUpContext';
import { kValues } from '../../../core/helpers';

export function MaterialInventory () {
  const { materials, addMaterial, loading } = useMaterialInventory()
  const nav = useNavigate()
  return <SmartGrid container spacing={3}>
    <SmartGrid title='Agregar Material' item xs={12} md={4} >
      <AddMaterialToInventoryForm onSubmit={addMaterial} loading={loading} />
    </SmartGrid>
    <SmartGrid title='Lista de materiales' item xs={12} md={8} >
      <CustomTable
        titles={['Id', 'Nombre', 'Cantidad', 'Unidad', 'Precio', 'Inversion', 'Acciones']}
        content={materials}
        format={(item) => [
          item.id,
          item.name,
          kValues(item.quantity),
          item.unit,
          <Money number={item.price} key={`${item.id}-price`} />,
          <Money number={item.quantity * item.price} key={`${item.id}-investment`} />,
          <IconButton onClick={() => nav(`/dashboard/insumos/${item.id}`)} key={`${item.id}-edit`}><VisibilityIcon /></IconButton>

        ]} />
    </SmartGrid>
  </SmartGrid>
}

function AddMaterialToInventoryForm ({ onSubmit, loading }) {
  const [form, setForm] = useCState({
    qty: 0,
    materialId: null
  })
  return <QuickFormContainer onSubmit={() => {
    onSubmit(form.materialId, form.qty)
  }} title='Inventario'>
    <List style={{
      padding: "1rem",
    }}>
      <BasicMaterialSearch onChange={(ev) => {
        setForm({ materialId: ev.id })
      }} />
    </List>
    <QuickFormInput fullWidth label='Cantidad' name='qty'
      type='number'
      inputProps={{ step: 0.001 }}
      value={form.qty}
      onChange={(ev) => {
        setForm({ qty: ev.target.value })
      }
      }
    />
    <QuickFormButton
      disabled={!form.materialId || !form.qty || loading}
      type='submit' fullWidth variant='contained'>Guardar</QuickFormButton>
  </QuickFormContainer>
}

function useMaterialInventory () {
  const { popUpAlert } = usePopUp()
  const [loading, setLoading] = useState(false)
  const transaction = new MaterialTransaction()


  const getInventory = useQuery('materialInventory', () => transaction.getInventory())
  const addMaterial = async (materialId, qty) => {
    setLoading(true)
    try {
      await transaction.addMaterialToInventory(materialId, qty)
      getInventory.refetch()
      popUpAlert('success', 'Material agregado al inventario')
    } catch (error) {
      popUpAlert('Error', error.message)
    }
    setLoading(false)
  }
  return {
    materials: getInventory.data,
    addMaterial,
    loading,
  }
}