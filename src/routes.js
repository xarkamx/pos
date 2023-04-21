import { Navigate, useRoutes } from 'react-router-dom';
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

// ----------------------------------------------------------------------

export default function Router () {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/caja" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'clientes', element: <ClientsPage /> },
        { path: 'clientes/:clientId', element: <SinglePageClient /> },
        { path: 'ordenes', element: <OrdersPage /> },
        { path: 'ordenes/:orderId', element: <OrderPage /> },
        { path: 'pagos', element: <PaymentPages /> },
        { path: 'productos', element: <ProductsPage /> },
        { path: 'caja', element: <CheckoutPage /> },
        {
          path: 'inventario',
          element: <InventoryPage />,
        }
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
  ]);

  return routes;
}

