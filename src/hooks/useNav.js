
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { filterRoutes, routes } from '../routes';
import { isObjectEmpty } from '../core/helpers';

export function useNav () {
  const auth = useAuth();
  const navigate = useNavigate();
  const customRoutes = !isObjectEmpty(auth.access) ? filterRoutes(routes, auth) : routes.filter((route) => !route.auth);
  const flatCustomRoutes = flatRoutes(customRoutes);
  return (path) => {
    const isValidPath = pathInList(path, flatCustomRoutes);
    if (!isValidPath) {
      return false;
    }
    return navigate(path);
  }
}

function flatRoutes (routes) {
  return routes.reduce((acc, route) => {
    if (route.path) {
      acc.push(route.path);
    }
    if (route.children) {
      acc = acc.concat(flatRoutes(route.children).map((childPath) => (
        `${route.path}/${childPath}`
      )));
    }
    return acc;
  }, [])
}

function pathInList (path, list) {

  const listRegex = list.map((item) => item.replace(/:\w+/g, '\\w+'))

  return listRegex.filter(item => {
    const pathParts = path.split('/')
    const itemParts = item.split('/')
    return pathParts.length === itemParts.length
  }).find((item) => {
    const regex = new RegExp(item)
    return path.match(regex)
  })
}