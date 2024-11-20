
import { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useCState } from '../hooks/useHooks';

export const queryContext = createContext();

export function UrlQueryProvider ({ children }) {
  const query = useQuery();
  return <queryContext.Provider value={query}>{
    children
  }</queryContext.Provider>;
}

const useQuery = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const entries = Object.fromEntries(searchParams.entries());
  const [state, setState] = useCState(entries);
  return {
    entries: state,
    set: (obj) => {
      const newParams = new URLSearchParams(search);
      setState(obj);
      Object.entries({ ...state, ...obj }).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    }
  }
};

export function useUrlQuery () {
  return useContext(queryContext);
}