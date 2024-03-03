import { Navigate, useRoutes } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EngineeringIcon from '@mui/icons-material/Engineering';
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
import { UsersPage } from './pages/users';
import { BillingPage } from './pages/clients/billing';
import { BillingList, ReceivedBillingList } from './pages/billing/emited';
import { SingleProductPage } from './pages/products/SingleProduct';
import { MyAccount } from './pages/users/me';
import { PayrollView } from './pages/payroll/payrollPage';
import { ProcessPage } from './pages/products/ProductProcess';
import { CustomBillForm } from './pages/billing/customBillForm';

// ----------------------------------------------------------------------
export const routes = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    auth: true,
    children: [
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
        path: 'clientes/:clientId/factura',
        element: <BillingPage />,
        roles: ['admin', 'cashier'],
      },
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
        path: 'productos/procesos', element: <ProcessPage />, roles: ['admin', 'storer', 'cashier'],
      },
      {
        path: 'productos/:productId', element: <SingleProductPage />, roles: ['admin', 'storer', 'cashier'],
      },
      {
        path: 'caja', element: <CheckoutPage />, roles: ['admin', 'cashier'],
        icon: <PointOfSaleIcon />,
        title: 'Caja',
      },
      {
        path: 'inventario',
        element: <InventoryPage />,
        roles: ['admin', 'storer'],
        icon: <InventoryIcon />,
        title: 'Inventario',
      },
      {
        path: 'Nomina',
        element: <PayrollView />,
        roles: ['admin', 'cashier'],
        icon: <EngineeringIcon />,
        title: 'Nominas',
      },
      {
        path: 'usuarios',
        title: 'Usuarios',
        element: <UsersPage />,
        roles: ['admin'],
        icon: <PeopleOutlineIcon />,
      },
      {
        path: 'facturas',
        title: 'Facturas',
        element: <BillingList />,
        roles: ['admin', 'cashier'],
        icon: <ReceiptLongIcon />,
      },
      {
        path: 'facturas/recibidas',
        title: 'Facturas Recibidas',
        element: <ReceivedBillingList />,
        roles: ['admin', 'cashier'],
        icon: <ReceiptLongIcon />,
      },
      {
        path: 'factura/custom',
        title: 'Crear Facturas',
        element: <CustomBillForm />,
        roles: ['admin'],
        icon: <ReceiptLongIcon />,
      },
      {
        path: 'me',
        title: 'Mi perfil',
        element: <MyAccount />,
        roles: ['admin', 'cashier', 'storer'],
        icon: <AccountBoxIcon />,
      }
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
    index: true,
  },
  {
    element: <SimpleLayout />,
    children: [
      { element: <Navigate to="/dashboard/caja" /> },
      { path: '404', element: <Page404 /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

function filterRoutes (routes, auth) {
  if (auth.access.roles.includes('master')) return routes;
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

  const defaultRoute = {
    path: '/',
    element: <Navigate to="/login" />,
  }

  if (!isObjectEmpty(auth.access)) {
    const mainPages = {
      cashier: '/dashboard/caja',
      admin: '/dashboard/app',
      storer: '/dashboard/inventario',
      master: '/dashboard/app',
    }
    const mainRole = auth.access.roles[0];
    defaultRoute.element = <Navigate to={mainPages[mainRole]} />;
  }

  return useRoutes([...customRoutes, defaultRoute]);
}

