
import { useMutation, useQuery } from 'react-query';
import { ProductsTransaction } from '../utils/transactions/productsTransaction';

export function useProducts () {
  const query = useQuery('products', () => new ProductsTransaction().getProducts());
  const add = useMutation((product) => new ProductsTransaction().addProduct(product), {
    onSuccess: () => query.refetch()
  });
  const del = useMutation((id) => new ProductsTransaction().deleteProduct(id), {
    onSuccess: () => query.refetch()
  });

  const update = useMutation((product) => {
    const { id, ...rest } = product;
    new ProductsTransaction().updateProduct(id, rest);
  });
  return {
    products: query.data?.map(item => ({ label: item.name, id: item.id, price: item.price })),
    add: add.mutate,
    del: del.mutate,
    update: update.mutate

  }
}