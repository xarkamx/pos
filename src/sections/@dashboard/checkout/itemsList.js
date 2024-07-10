import { Card, IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Money } from '../../../components/Formats/FormatNumbers';
import { CustomTable } from '../../../components/tables/Table';
import Iconify from '../../../components/iconify';
import { ConditionalWall } from '../../../components/FilterWall/ConditionalWall';


export function ItemsList ({ products = [], onEditQuantity, onDeleteProduct }) {
  return (
    <Card>
      <CustomTable
        titles={
          [
            '',
            'Producto',
            'Precio',
            'Cantidad',
            'Importe'
          ]
        }
        format={(values) => [
          <ConditionalWall key={`b-${values.id}`} condition={onDeleteProduct}>
            <IconButton onClick={() => {
              onDeleteProduct(values.id)
            }}>
              <Iconify icon="eva:close-fill" sx={{ color: 'red' }} />
            </IconButton>,
          </ConditionalWall>,
          values.name,
          <Money number={values.price} key={`m-${values.id}`} />,
          <ConditionalWall
            or={
              values.quantity
            }
            condition={
              onEditQuantity
            }
            key={`i-${values.id}`}
          >
            <QtyInput onChange={(qty) => {
              onEditQuantity(values.id, parseInt(qty, 10))
            }} value={values.quantity} />
          </ConditionalWall>
          ,
          <Money number={values.amount} key={`m2-${values.id}`} />
        ]
        }
        content={products}

      />
    </Card >
  );
}



function QtyInput ({ onChange, value }) {
  const [val, setVal] = useState(value)
  useEffect(() => {
    setVal(value)
  }, [value])
  return <TextField variant="standard"
    inputProps={{ min: 1 }}
    onChange={(ev) => {
      onChange(ev.target.value)
      setVal(ev.target.value)
    }} value={val} />
}
export function DiscountInput ({ onChange, total, value = 0 }) {
  const [val, setVal] = useState(value)
  useEffect(() => {
    setVal(value)
  }, [value])
  return <TextField
    label='Descuento'
    size='large'
    style={{ width: '100%' }}
    inputProps={{
      pattern: '[0-9]+([.][0-9]+)?%?',
    }}
    onChange={(ev) => {
      let discount = ev.target.value
      let percentage = 0;
      if (Number.isNaN(-discount)) {
        discount = discount.replace(/%/, '')
        percentage = (discount / 100)
        discount = total * (discount / 100)
      }
      const validations = [
        Number.isNaN(total - discount),
        discount > total,
        discount < 0
      ]
      const isValid = validations.every((v) => v === false)
      if (!isValid) discount = 0
      value = !isValid ? 0 : ev.target.value
      onChange({ subtotal: total, total: total - discount, discount, percentage, val: value })
      setVal(!isValid ? 0 : ev.target.value)
    }} value={val} />
}