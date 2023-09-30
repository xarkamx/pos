
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, ListItem, MenuItem, Select } from '@mui/material';
import { QuickFormContainer, QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { ClientsSearchInput } from '../../sections/@dashboard/clients/SelectClient';
import { TaxUsesSelector } from '../../sections/@dashboard/clients/TaxSystemInput';
import { PaymentCodeSelector } from '../clients/billing';
import { CustomTable } from '../../components/tables/Table';
import { ConditionalWall } from '../../components/FilterWall/ConditionalWall';
import { useCState } from '../../hooks/useHooks';
import { PaymentMethodSelect } from '../../sections/@dashboard/payments/SelectPaymentMethod';
import { BillingTransactions } from '../../utils/transactions/billingTransaction';
import { usePopUp } from '../../context/PopUpContext';

export function CustomBillForm () {
  const { taxDetails, setTaxDetails, onSubmit, loading } = UseCustomTax()
  return <>
    <QuickFormContainer title='Factura Personalizada'>
      <ListItem>
        <OrgTaxSystemSelector
          value={taxDetails.taxSystem}
          onChange={(ev => {
            setTaxDetails({ taxSystem: ev.target.value })
          })} />
      </ListItem>
      <TaxUsesSelector
        value={taxDetails.taxUses}
        onChange={(ev) => {
          setTaxDetails({ taxUses: ev.value })
        }}
      />
      <ListItem>
        <ClientsSearchInput
          onSubmit={(ev) => {
            setTaxDetails({ clientId: ev.id })
          }}
        />
      </ListItem>
      <ListItem>
        <PaymentCodeSelector
          paymentCode={taxDetails.paymentCode}
          onChange={(ev) => {
            setTaxDetails({ paymentCode: ev })
          }}
        />
      </ListItem>
      <ListItem>
        <PaymentMethodSelect
          paymentMethod={taxDetails.paymentMethod}
          onChange={(ev) => {
            setTaxDetails({ paymentMethod: ev.value })
          }}

        />
      </ListItem>

    </QuickFormContainer>
    <ProductTable isLease={taxDetails.taxSystem === 606} onAdd={(products) => {
      setTaxDetails({ products })
    }} />
    <LoadingButton variant='contained' fullWidth
      loading={loading}
      onClick={async () => {
        await onSubmit()
      }}> Generar Factura </LoadingButton>
  </>
}

function OrgTaxSystemSelector ({ value, onChange }) {

  return <FormControl fullWidth>
    <InputLabel id="taxSystem">Regimen Fiscal del emisor</InputLabel>
    <Select
      labelId='taxSystem'
      fullWidth
      value={value}
      onChange={onChange}
    >

      <MenuItem value={612}>
        Personas Físicas con Actividades Empresariales y Profesionales
      </MenuItem>
      <MenuItem value={606}>
        Arrendamiento
      </MenuItem>

    </Select>
  </FormControl>
}

function ProductTable ({ isLease = false, onAdd }) {
  const [products, setProducts] = useState([])
  const [product, setProduct] = useCState({
    key: '',
    description: '',
    quantity: '',
    price: '',
    propertyAccount: '',
  })
  return <>
    <form style={{
      width: '100%',
      display: 'flex',
      background: 'white',
      padding: '1rem',
      borderRadius: '1rem',

    }}
      onSubmit={(ev) => {
        ev.preventDefault()
        const results = [...products, {
          quantity: product.quantity,
          property_tax_account: product.propertyAccount || undefined,
          product: {
            product_key: product.key,
            description: product.description,
            price: product.price,
          }
        }]
        setProducts(results)
        onAdd(results)
        ev.target.reset()
      }}>
      <QuickFormInput fullWidth label='Clave' onChange={(ev) => {
        setProduct({ key: ev.target.value })
      }} />
      <QuickFormInput fullWidth label='Producto' onChange={(ev) => {
        setProduct({ description: ev.target.value })
      }} />
      <QuickFormInput fullWidth label='Cantidad' type='number' onChange={(ev) => {
        setProduct({ quantity: ev.target.value })
      }} />
      <QuickFormInput fullWidth label='Precio' type='number' onChange={(ev) => {
        setProduct({ price: ev.target.value })
      }} />
      <ConditionalWall condition={isLease}>
        <QuickFormInput fullWidth label='Predial' onChange={(ev) => {
          setProduct({ propertyAccount: ev.target.value })
        }} />
      </ConditionalWall>
      <Button variant='contained' type='submit'>Agregar</Button>
    </form>
    <CustomTable
      titles={["Clave", "Producto", "Cantidad", "Total", "Predial"]}
      content={products}
      format={(product) => {
        const price = parseFloat(product.product.price) || 0
        const quantity = parseFloat(product.quantity) || 0
        return [
          product.product.product_key,
          product.product.description,
          product.quantity,
          price * quantity,
          product?.property_tax_account || 'N/A',
        ]
      }}
    />
  </>
}


function UseCustomTax () {
  const { popUpAlert } = usePopUp()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [taxDetails, setTaxDetails] = useCState({
    taxSystem: null,
    taxUses: null,
    paymentCode: null,
    clientId: null,
    paymentMethod: null,
    products: [],
  })
  const onSubmit = async () => {
    setLoading(true)
    const service = new BillingTransactions()
    try {
      await service.customBilling({
        orgTaxSystem: `${taxDetails.taxSystem}`,
        paymentForm: taxDetails.paymentMethod,
        paymentMethod: taxDetails.paymentCode,
        customerId: taxDetails.clientId,
        use: taxDetails.taxUses,
        products: taxDetails.products,
      })
      popUpAlert('success', 'Factura generada correctamente', () => {
        navigate('/dashboard/facturas')
      })
    } catch (error) {
      popUpAlert('Error', error.message)
    }
    setLoading(false)

  }
  return { taxDetails, setTaxDetails, onSubmit, loading }
}