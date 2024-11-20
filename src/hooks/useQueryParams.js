
import { useEffect } from 'react';
import { useUrlQuery } from '../context/queryContext';
import { isObjectEmpty } from '../core/helpers';



export function useQueryParams (obj) {
  const { entries, set } = useUrlQuery();
  console.log(entries, set)
  useEffect(() => {
    if (isObjectEmpty(entries) && obj) {
      set(obj)
    }
  }, [obj, entries, set]);
  return [entries, set];
}