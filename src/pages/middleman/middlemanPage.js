

import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { QuickFormButton, QuickFormContainer, QuickFormInput } from '../../components/Containers/QuickFormContainer';
import { CustomTable } from '../../components/tables/Table';
import { MiddlemanTransaction } from '../../utils/transactions/middlemanTransaction';
import { usePopUp } from '../../context/PopUpContext';
import { useCState } from '../../hooks/useHooks';
import { Money } from '../../components/Formats/FormatNumbers';
import { MinifyPaymentModal } from '../../sections/@dashboard/orders/paymentModal';
import { SmartGrid } from '../../components/Containers/SmartGrid';

export function MiddlemanPage () {
  const { middlemen, addMiddleman, deleteMiddleman, sendPayment } = useMiddleman()
  const [openPayment, setOpenPayment] = useState(false)
  const [currentMiddleman, setCurrentMiddleman] = useCState({
    middlemanId: 0,
    pending: 0
  })
  return <SmartGrid container spacing={2}>
    <SmartGrid title='Agregar' icon={<AddIcon />} item xs={12} md={4}>
      <MiddlemanForm onSubmit={(middleman) => {
        addMiddleman(middleman)
      }} />
    </SmartGrid>

    <SmartGrid title='Comisionistas' icon={<GroupAddIcon />} item xs={12} md={8}>
      <MiddlemanTable middlemen={middlemen} onDelete={deleteMiddleman} onItemClick={(middleman) => {
        setCurrentMiddleman(middleman)
        setOpenPayment(true)
      }} />
      <MinifyPaymentModal open={openPayment} max={currentMiddleman.pending} onSubmit={(amount) => {
        sendPayment(currentMiddleman.middlemanId, amount)
        setOpenPayment(false)

      }} onClose={() => {
        setOpenPayment(false)

      }} />
    </SmartGrid>
  </SmartGrid>
}

function MiddlemanForm ({ onSubmit }) {
  const [middleman, setMiddleman] = useCState({
    name: '',
    rfc: '',
    email: '',
    password: '',
    phone: '',
    postalCode: '',
    address: '',
    bankName: '',
    clabe: ''
  })
  return <QuickFormContainer
    title='Registrar Comisionista'
    onSubmit={() => {
      onSubmit(middleman)
    }}
  >
    <QuickFormInput
      onChange={(ev) => { setMiddleman({ name: ev.target.value }) }}
      fullWidth label="Nombre" />

    <QuickFormInput
      onChange={(ev) => { setMiddleman({ rfc: ev.target.value }) }}
      fullWidth
      label="RFC"
      pattern={
        '^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$'
      } />
    <QuickFormInput
      onChange={(ev) => { setMiddleman({ email: ev.target.value }) }}
      fullWidth label="Correo" type='email' />
    <QuickFormInput
      onChange={(ev) => { setMiddleman({ password: ev.target.value }) }}
      fullWidth
      label="Contraseña" type='password' />
    <QuickFormInput
      onChange={(ev) => { setMiddleman({ phone: ev.target.value }) }}
      fullWidth label="Teléfono" type='tel' />
    <QuickFormInput
      onChange={(ev) => { setMiddleman({ postalCode: ev.target.value }) }}
      fullWidth label="Código postal" type='number'
      pattern={
        '^[0-9]{5}$'
      }
    />
    <QuickFormInput
      onChange={(ev) => { setMiddleman({ address: ev.target.value }) }}
      fullWidth label="Dirección" />

    <QuickFormInput
      onChange={(ev) => { setMiddleman({ bankName: ev.target.value }) }}
      fullWidth label="Banco" />
    <QuickFormInput
      onChange={(ev) => { setMiddleman({ clabe: ev.target.value }) }}
      fullWidth label="CLABE" />
    <QuickFormButton fullWidth variant='contained' color='primary' type='submit'>Registrar</QuickFormButton>

  </QuickFormContainer>
}

function MiddlemanTable ({ middlemen = [], onDelete, onItemClick }) {
  return <CustomTable
    titles={['ID', 'Comisionista', 'Comision', 'Pagado', 'Pendiente', 'Clientes', 'Acciones']}
    content={middlemen}
    format={(middleman) => [
      middleman.middlemanId,
      middleman.name,
      <Money number={middleman.earnings} key={`earnings-${middleman.middlemanId}`} />,
      <Money number={middleman.paidEarnings} key={`paid-${middleman.middlemanId}`} />,
      <Money number={middleman.earnings - middleman.paidEarnings} key={`pending-${middleman.middlemanId}`} />,
      middleman.numberOfClients,
      <>
        <IconButton
          color='success'
          key={`edit-${middleman.middlemanId}`} onClick={() => {
            onItemClick({ ...middleman, pending: middleman.earnings - middleman.paidEarnings })
          }} >
          <AttachMoneyIcon />
        </IconButton>
        <IconButton
          color='error'
          key={`del-${middleman.middlemanId}`} onClick={() => {
            onDelete(middleman.middlemanId)
          }} >
          <DeleteIcon />
        </IconButton>
      </>
    ]}
  />
}

function useMiddleman () {

  const { popUpAlert } = usePopUp();

  const query = useQuery('middlemen', async () => {
    const service = new MiddlemanTransaction()
    return service.getMiddlemen()
  })

  const mutation = useMutation((middleman) => {
    const service = new MiddlemanTransaction()
    return service.createMiddleman(middleman)
  }, {
    onSuccess: () => {
      query.refetch()
    },
    onError: (error) => {
      popUpAlert('error', error.message)
    }
  })

  const deleteMiddleman = async (middlemanId) => {
    const service = new MiddlemanTransaction()
    try {
      const resp = await service.deleteMiddleman(middlemanId)
      if (resp) {
        popUpAlert('success', 'Comisionista eliminado')
      }
      query.refetch()
    }
    catch (err) {
      popUpAlert('error', err.message)
    }

  }

  const sendPayment = async (id, amount) => {
    const service = new MiddlemanTransaction()
    try {
      await service.sendPayment(id, amount)
      popUpAlert('success', 'Pago registrado')
      query.refetch()
    } catch (e) {
      popUpAlert('error', e.toString())
    }
  }



  return {
    middlemen: query.data,
    addMiddleman: mutation.mutate,
    deleteMiddleman,
    sendPayment
  }
}