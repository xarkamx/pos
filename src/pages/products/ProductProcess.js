
import { useState } from 'react';

import { useQuery } from 'react-query';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { BasicProductSearch } from '../../sections/@dashboard/products/ProductSearchInput';
import { CustomTable } from '../../components/tables/Table';
import { useCState } from '../../hooks/useHooks';
import { ProductsTransaction } from '../../utils/transactions/productsTransaction';
import { usePopUp } from '../../context/PopUpContext';

export function ProcessPage () {
  const process = useProcess()
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProductProcessForm onSubmit={
            (prod) => {
              process.addProcess(prod)
            }
          } />
          <CustomTable
            titles={['Nombre', 'Tipo', 'Kilos Pendientes', 'Cantidad']}
            content={process.content}
            format={(item) => [
              item.name,
              item.type,
              `${item.quantity || 0} en Kg`,
              <ProccessInflow key={`fo-${item.id}`} maxQty={item.quantity || 0} onSubmit={(qty) => {
                process.updateProcess(item, qty)
              }} />
            ]}
          />
        </Grid>
      </Grid>
    </div>
  )
}

function ProductProcessForm ({ onSubmit }) {
  const [products, setProducts] = useCState({
    product: {},
    quantity: 1,
    type: 'otro',
  })
  return <form style={{
    display: 'flex'
  }}
    onSubmit={(ev) => {
      ev.preventDefault();
      onSubmit?.(products);
    }}
  >
    <BasicProductSearch onChange={(prod) => {
      setProducts({ product: { name: prod.label, id: prod.id } })
    }} />
    <TextField label="Cantidad en Kg" fullWidth type='number'
      value={products.quantity}
      onChange={(ev) => {
        setProducts({ quantity: ev.target.value })
      }}
    />
    <TextField
      onChange={(ev) => {
        setProducts({ type: ev.target.value })
      }}
      value={products.type}
      label="Tipo de proceso" select fullWidth>
      <MenuItem value="colgado">Colgado</MenuItem >
      <MenuItem value="barril">Barril</MenuItem >
      <MenuItem value="tropicalizado">Tropicalizado</MenuItem >
      <MenuItem value="otro">Otro</MenuItem >
    </TextField>
    <Button variant='contained' type='submit'>OK</Button>
  </form>
}

function ProccessInflow ({ maxQty, onSubmit }) {
  const [inflowProducts, setInflowProducts] = useState(0)
  return <form style={{
    display: 'flex'
  }}
    onSubmit={(ev) => {
      ev.preventDefault();
      onSubmit?.(inflowProducts);
      setInflowProducts(0)
    }}>

    <TextField
      InputProps={{
        inputProps: {
          min: 0,
          max: maxQty,
          step: 0.1
        }
      }}
      label="Cantidad en Kg" fullWidth type='number'
      onChange={(ev) => {
        setInflowProducts(ev.target.value)
      }}
      value={inflowProducts}
    />
    <Button variant='contained' type='submit'>OK</Button>
  </form>
}

function useProcess () {
  const [process, setProcess] = useState([])
  const { popUpAlert } = usePopUp()
  const transaction = new ProductsTransaction()
  const processQuery = useQuery('process', async () => {
    const res = await transaction.getProcessList()
    setProcess(res.map(item => ({
      id: item.productId,
      name: item.name,
      type: 'otro',
      quantity: item.total,
      flow: item.flow,
      total: 0
    })))
    return res
  })
  const addProcess = async (prod) => {
    if (!prod.product.id) {
      popUpAlert('error', 'Debe seleccionar un producto')
      return false
    }
    const index = process.findIndex(item => item.id === prod.product.id)
    if (index !== -1) {
      const newProcess = [...process]
      newProcess[index].quantity += parseFloat(prod.quantity)
      setProcess(newProcess)
    } else {
      setProcess([...process, {
        id: prod.product.id,
        name: prod.product.name,
        type: prod.type,
        quantity: prod.quantity,
        flow: 'outflow',
        total: 0
      }])
    }

    await transaction.addProcess({
      "productId": prod.product.id,
      "quantity": prod.quantity,
      "unit": "kg",
      "flow": "outflow"
    })
    popUpAlert('success', 'Producto agregado correctamente')
    processQuery.refetch()
    return process
  }

  const updateProcess = async (prod, qty) => {
    const index = process.findIndex(item => item.id === prod.id)
    const newProcess = [...process]
    newProcess[index] = prod
    setProcess(newProcess)
    await transaction.addProcess({
      "productId": prod.id,
      "quantity": qty,
      "unit": "kg",
      "flow": "inflow"
    })
    popUpAlert('success', 'Cantidad actualizada correctamente')
    processQuery.refetch()
  }

  return {
    content: process,
    addProcess,
    updateProcess
  }

}