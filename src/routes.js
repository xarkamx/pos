import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import CheckoutPage from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersLists';
import PaymentPages from './pages/PaymentsPage';
import ClientsPage from './pages/ClientsPage';

// ----------------------------------------------------------------------

export default function Router () {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'clientes', element: <ClientsPage /> },
        { path: 'ordenes', element: <OrdersPage /> },
        { path: 'pagos', element: <PaymentPages /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'caja', element: <CheckoutPage /> }
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
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
