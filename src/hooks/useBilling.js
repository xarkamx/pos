import { useMutation, useQuery } from 'react-query'
import { useCState } from './useHooks'

const { useNavigate } = require('react-router-dom')
const { usePopUp } = require('../context/PopUpContext')
const { OrderTransaction } = require('../utils/transactions/orderTransaction')

export function useBilling () {
  const navigate = useNavigate()
  const { popUpAlert } = usePopUp()
  return {
    async bill (orders, clientId) {
      try {
        const service = new OrderTransaction()
        await service.bill(orders.map(order => order.id))
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

  const cancel = useMutation((billId) => new OrderTransaction().cancelBilling(billId), {
    onSuccess: () => {
      billing.refetch()
    },
  })
  return {
    billing: billing.data,
    search: setSearchParams,
    cancel: cancel.mutate,
  }
}