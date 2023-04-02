// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [

  {
    title: 'clientes',
    path: '/dashboard/clientes',
    icon: icon('ic_user'),
  },
  {
    title: 'productos',
    path: '/dashboard/productos',
    icon: icon('ic_cart'),
  },
  {
    title: 'Ordenes',
    path: '/dashboard/ordenes',
    icon: icon('ic_blog'),
  },
  {
    title: 'Caja',
    path: '/dashboard/caja',
    icon: icon('ic_blog'),
  },
  {
    title: 'Pagos',
    path: '/dashboard/pagos',
    icon: icon('ic_blog'),
  }
];

export default navConfig;
