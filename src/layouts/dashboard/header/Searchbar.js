import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, ClickAwayListener, Grid } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// component
import Iconify from '../../../components/iconify';
import { routes } from '../../../routes';

// ----------------------------------------------------------------------


const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 5),
    height: "100vh"
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar () {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div role="button" tabIndex={0} onKeyUp={(ev) => {
        if (ev.key === "Escape") handleClose();
      }}>
        {!open && (
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
        )}

        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <MenuGrid handleClose={handleClose} />
          </StyledSearchbar>
        </Slide>
      </div>
    </ClickAwayListener >
  );
}

function MenuGrid ({ handleClose }) {
  const [search, setSearch] = useState('');
  return (
    <Grid container>
      <Grid item xs={12}>
        <Input
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          fullWidth
          disableUnderline
          placeholder="Search…"
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
          sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
        /></Grid>
      <Grid item xs={12}>
        <NavItems searchVal={search} onClose={handleClose} />
      </Grid>
    </Grid>
  );
}

function NavItems ({ searchVal, onClose }) {
  const nav = useNavigate();
  const navConfig = routes[0].children.filter((item) => item.title?.includes(searchVal) || (item.title && item.path.includes(searchVal)));
  return <Grid container sx={{ color: "#333", maxHeight: "80vh", overflow: "auto" }}>
    {navConfig.map((item) => (
      <Grid item key={item.title} xs={4}>
        <Button startIcon={item.icon}
          onClick={() => {
            nav(`/dashboard/${item.path}`);
            onClose();
          }}
          fullWidth sx={{ textTransform: 'none', aspectRatio: "16/9", backgroundColor: "#eeeeee55" }}>
          {item.title}
        </Button>
      </Grid>))}
  </Grid>
}