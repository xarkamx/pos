// component
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
// ----------------------------------------------------------------------

const navConfig = [

  {
    title: 'clientes',
    path: '/dashboard/clientes',
    icon: <SupervisedUserCircleIcon />,
  },
  {
    title: 'productos',
    path: '/dashboard/productos',
    icon: <LoyaltyIcon />,
  },
  {
    title: 'inventario',
    path: '/dashboard/inventario',
    icon: <InventoryIcon />,
  },
  {
    title: 'Ordenes',
    path: '/dashboard/ordenes',
    icon: <ReceiptIcon />,
  },
  {
    title: 'Caja',
    path: '/dashboard/caja',
    icon: <PointOfSaleIcon />,
  },
  {
    title: 'Pagos',
    path: '/dashboard/pagos',
    icon: <MonetizationOnIcon />,
  }
];

export default navConfig;
