import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Drawer } from '@mui/material';
// mock
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import { routes } from '../../../routes';
import { useAuth } from '../../../hooks/useAuth';


// ----------------------------------------------------------------------

const NAV_WIDTH = 280;



// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};


export default function Nav ({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const auth = useAuth();
  let navConfig = routes[0].children.filter((item) => item.title);
  navConfig = navConfig.filter((item) => {
    if (item.roles) {
      return item.roles.some((role) => auth.access?.roles?.includes(role));
    }
    return true;
  }).sort((a, b) => a.title.localeCompare(b.title))
  let menu = navConfig.filter((item) => {

    const itemPathLevel = item.path.split('/').length + 1;
    const pathLevel = pathname.split('/').length - 1;
    const pathPos = item.path.includes(pathname.split('/')[pathLevel])
    if (pathname.includes('app')) {
      return itemPathLevel === 2
    }

    return itemPathLevel > pathLevel && pathPos
  });

  const isDesktop = useResponsive('up', 'lg');
  if (menu.length === 0) {
    menu = navConfig.filter((item) => {
      const itemPathLevel = item.path.split('/').length + 1;
      return itemPathLevel === 2
    })
  }
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>


      <NavSection data={menu} />

      <Box sx={{ flexGrow: 1 }} />


    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
