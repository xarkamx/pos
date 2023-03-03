
import { useQuery } from 'react-query';
import { ProductsTransaction } from '../utils/transactions/productsTransaction';

export function useProducts () {
  const query = useQuery('products', () => new ProductsTransaction().getProducts());
  return { products: query.data?.map(item => ({ label: item.name, id: item.id, price: item.price })) }
}