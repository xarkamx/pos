import { Navigate, useRoutes } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import CheckoutPage from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersLists';
import PaymentPages from './pages/PaymentsPage';
import ClientsPage from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage';
import OrderPage from './pages/OrderPage';
import { InventoryPage } from './pages/Inventory';
import SinglePageClient from './pages/clients/client';
import { useAuth } from './hooks/useAuth';
import { isObjectEmpty } from './core/helpers';

// ----------------------------------------------------------------------
export const routes = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    auth: true,
    children: [
      { element: <Navigate to="/dashboard/caja" />, index: true },
      { path: 'app', element: <DashboardAppPage />, roles: ['admin', 'cashier'] },
      {
        path: 'clientes',
        element: <ClientsPage />,
        roles: ['admin', 'cashier'],
        icon: <SupervisedUserCircleIcon />,
        title: 'Clientes',
      },
      { path: 'clientes/:clientId', element: <SinglePageClient />, roles: ['admin', 'cashier'] },
      {
        path: 'ordenes', element: <OrdersPage />, roles: ['admin', 'cashier'],
        icon: <ReceiptIcon />,
        title: 'Notas de venta'
      },
      { path: 'ordenes/:orderId', element: <OrderPage />, roles: ['admin', 'cashier'] },
      {
        path: 'pagos', element: <PaymentPages />, roles: ['admin', 'cashier'],
        icon: <MonetizationOnIcon />,
        title: 'Pagos'
      },
      {
        path: 'productos', element: <ProductsPage />, roles: ['admin', 'storer', 'cashier'],
        icon: <LoyaltyIcon />,
        title: 'Productos'
      },
      {
        path: 'caja', element: <CheckoutPage />, roles: ['admin', 'cashier'],
        icon: <PointOfSaleIcon />,
        title: 'Caja'
      },
      {
        path: 'inventario',
        element: <InventoryPage />,
        roles: ['admin', 'storer'],
        icon: <InventoryIcon />,
        title: 'Inventario',
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    element: <SimpleLayout />,
    children: [
      { element: <Navigate to="/dashboard/caja" />, index: true },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

function filterRoutes (routes, auth) {
  return routes.map((route) => {
    if (route.auth) {
      route.element = auth.access ? route.element : <Navigate to="/login" />;
    }
    if (route.roles) {
      const valid = route.roles.some((role) => auth.access.roles.includes(role));
      route.element = valid ? route.element : <Navigate to="/404" />;
    }
    if (route.children) route.children = filterRoutes(route.children, auth);

    if (route.title) route.element = <HelmetElement title={route.title}>{route.element}</HelmetElement>
    return route;
  });
}

function HelmetElement ({ title, children }) {
  return (
    <>
      <Helmet><title>{title} | POS </title></Helmet>
      {children}
    </>
  )
}

export default function Router () {
  const auth = useAuth();
  const customRoutes = !isObjectEmpty(auth.access) ? filterRoutes(routes, auth) : routes.filter((route) => !route.auth);
  return useRoutes(customRoutes);
}
