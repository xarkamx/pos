
import { useMutation, useQuery } from 'react-query';
import { ProductsTransaction } from '../utils/transactions/productsTransaction';
import { usePopUp } from '../context/PopUpContext';

export function useProducts () {
  const { popUpAlert } = usePopUp();
  const query = useQuery('products', () => new ProductsTransaction().getProductInventoryList());
  const add = useMutation((product) => new ProductsTransaction().addProduct(product), {
    onSuccess: () => {
      popUpAlert('success', 'Producto agregado correctamente');
      query.refetch()
    }
  });
  const del = useMutation((id) => new ProductsTransaction().deleteProduct(id), {
    onSuccess: () => query.refetch()
  });

  const update = useMutation((product) => {
    const { id, ...rest } = product;
    new ProductsTransaction().updateProduct(id, rest);
  });
  const productsList = query.data ?? []
  return {
    products: productsList.map(item => ({ label: item.name, id: item.id, price: item.unitPrice, quantity: item.inStock })),
    data: productsList,
    add: add.mutate,
    del: del.mutate,
    update: update.mutate,
    refresh: query.refetch
  }
}