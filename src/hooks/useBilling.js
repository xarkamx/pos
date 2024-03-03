import { useMutation, useQuery } from 'react-query'
import { useCState } from './useHooks'

const { useNavigate } = require('react-router-dom')
const { usePopUp } = require('../context/PopUpContext')
const { OrderTransaction } = require('../utils/transactions/orderTransaction')

export function useBilling () {
  const navigate = useNavigate()
  const { popUpAlert } = usePopUp()
  return {
    async bill (orders, clientId, paymentType, code) {
      try {
        const service = new OrderTransaction()
        await service.bill(orders.map(order => order.id), paymentType, code)
        navigate(`/dashboard/clientes/${clientId}`)
      }
      catch (error) {
        popUpAlert('Error', error.message)
      }
    },
  }
}

export function useBillingList () {
  const [searchParams, setSearchParams] = useCState({ page: 1, limit: 10, q: '' })
  const billing = useQuery(['billing', searchParams], async () => {
    const service = new OrderTransaction()
    return service.getAllBills(searchParams)
  })

  const metadata = useQuery(['metadata', searchParams], async () => {
    const service = new OrderTransaction()
    return service.getMetadata()
  })

  const cancel = useMutation((billId) => new OrderTransaction().cancelBilling(billId), {
    onSuccess: () => {
      billing.refetch()
    },
  })
  return {
    billing: billing.data,
    search: setSearchParams,
    metadata: metadata.data,
    cancel: cancel.mutate,
  }
}