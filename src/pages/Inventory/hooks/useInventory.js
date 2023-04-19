import { useMutation, useQuery } from 'react-query';
import { usePopUp } from '../../../context/PopUpContext';
import { InventoryTransaction } from '../../../utils/transactions/inventoryTransaction';
import { ProductsTransaction } from '../../../utils/transactions/productsTransaction';



export function useInventory () {
  const { popUpAlert } = usePopUp();
  const query = useQuery('inventory', () => new ProductsTransaction().getProductInventoryList());
  const add = useMutation((item) => new InventoryTransaction().addItem(item), {
    onSuccess: () => {
      popUpAlert('success', 'Agregado correctamente');
      query.refetch();
    }
  });

  const updateMutation = useMutation((content) => new InventoryTransaction()
    .updateItem(content.id, content.client), {
    onSuccess: () => {
      query.refetch();
    }
  });
  return { items: query.data, add: add.mutate, update: updateMutation.mutate }
}