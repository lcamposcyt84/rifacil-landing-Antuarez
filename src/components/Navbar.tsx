import { useState } from 'react';
import { Facebook, Twitter, Instagram, Menu, X } from 'lucide-react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, Avatar, Menu as MuiMenu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';

// Definimos la interfaz para el usuario que incluye tipo_usuario y es_operador
interface User {
  id: string;
  nombre: string;
  apellido?: string;
  email: string;
  tipo_usuario: string;
  es_operador: number;
}

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const menuItems = ['Inicio', 'Nosotros', 'Blog'];
  const royalBlue = '#1c37a3';
  const hoverYellow = '#FFAE00'; // Color amarillo para hover

  // Estilo común para botones redondeados
  const roundedButtonStyle = {
    borderRadius: '24px',
    textTransform: 'none',
    padding: '8px 16px',
  };

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <X />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item} disablePadding>
            <Button
              component={Link}
              to={index === 0 ? '/' : `/${item.toLowerCase()}`}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                color: '#1976d2',
                '&:hover': {
                  color: '#000000',
                  backgroundColor: hoverYellow,
                },
              }}
            >
              {item}
            </Button>
          </ListItem>
        ))}
        
        {/* Botones de autenticación para móvil */}
        {isAuthenticated && user ? (
          <>
            {/* Mostrar botón de crear rifa si el usuario es persona o empresa */}
            {(user.tipo_usuario === 'persona' || user.tipo_usuario === 'empresa') && (
              <ListItem disablePadding>
                <Button
                  component={Link}
                  to="/crear-rifa"
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    color: '#7e3af2',
                    fontWeight: 'bold',
                    '&:hover': { 
                      color: '#000000',
                      backgroundColor: hoverYellow 
                    },
                  }}
                >
                  Crear Rifa
                </Button>
              </ListItem>
            )}
            <ListItem disablePadding>
              <Button
                component={Link}
                to="/perfil"
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  color: '#1976d2',
                  '&:hover': { 
                    color: '#000000',
                    backgroundColor: hoverYellow 
                  },
                }}
              >
                Mi Perfil
              </Button>
            </ListItem>
            <ListItem disablePadding>
              <Button
                component={Link}
                to="/mis-rifas"
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  color: '#1976d2',
                  '&:hover': { 
                    color: '#000000',
                    backgroundColor: hoverYellow 
                  },
                }}
              >
                Mis Rifas
              </Button>
            </ListItem>
            {user.es_operador === 1 && (
              <ListItem disablePadding>
                <Button
                  component={Link}
                  to="/admin"
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    py: 1.5,
                    color: '#1976d2',
                    '&:hover': { 
                      color: '#000000',
                      backgroundColor: hoverYellow 
                    },
                  }}
                >
                  Panel Admin
                </Button>
              </ListItem>
            )}
            <ListItem disablePadding>
              <Button
                onClick={handleLogout}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  color: '#f44336',
                  '&:hover': { 
                    color: '#000000',
                    backgroundColor: hoverYellow 
                  },
                }}
              >
                Cerrar Sesión
              </Button>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <Button
                component={Link}
                to="/login"
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  color: '#1976d2',
                  '&:hover': { 
                    color: '#000000',
                    backgroundColor: hoverYellow 
                  },
                }}
              >
                Iniciar Sesión
              </Button>
            </ListItem>
            <ListItem disablePadding>
              <Button
                component={Link}
                to="/register"
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  color: '#1976d2',
                  '&:hover': { 
                    color: '#000000',
                    backgroundColor: hoverYellow 
                  },
                }}
              >
                Registrarse
              </Button>
            </ListItem>
          </>
        )}
      </List>
      <Box sx={{ display: 'flex', gap: 2, ml: 2, mt: 2 }}>
        <IconButton size="small" sx={{ color: '#1976d2', '&:hover': { color: hoverYellow } }}>
          <Facebook size={25} />
        </IconButton>
        <IconButton size="small" sx={{ color: '#1976d2', '&:hover': { color: hoverYellow } }}>
          <Twitter size={25} />
        </IconButton>
        <IconButton size="small" sx={{ color: '#1976d2', '&:hover': { color: hoverYellow } }}>
          <Instagram size={25} />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <AppBar position="absolute" color="transparent" elevation={0}>
      <Toolbar sx={{ py: { xs: 1, md: 2 }, px: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            flexGrow: 0,
            fontWeight: 'bold',
            letterSpacing: 2,
            color: 'white',
            fontSize: { xs: '1.5rem', md: '2rem' },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img src="log.png" alt="RIFÁCIL Logo" style={{ height: '5rem', marginRight: '1.5rem' }} />
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
          {menuItems.map((item, index) => (
            <Button
              key={item}
              component={Link}
              to={index === 0 ? '/' : `/${item.toLowerCase()}`}
              color="inherit"
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                color: 'white',
                borderRadius: '24px',
                padding: '6px 16px',
                '&:hover': {
                  backgroundColor: hoverYellow,
                  color: '#000000',
                },
              }}
            >
              {item}
            </Button>
          ))}
          
          {/* Opciones de autenticación para desktop */}
          {isAuthenticated && user ? (
            <>
              {/* Mostrar botón de crear rifa si el usuario es persona o empresa */}
              {(user.tipo_usuario === 'persona' || user.tipo_usuario === 'empresa') && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/crear-rifa"
                  variant="contained"
                  sx={{ 
                    ...roundedButtonStyle,
                    backgroundColor: '#7e3af2', 
                    '&:hover': { 
                      backgroundColor: hoverYellow,
                      color: '#000000'
                    } 
                  }}
                >
                  Crear Rifa
                </Button>
              )}
              
              {/* Menú de usuario */}
              <Box>
                <IconButton
                  size="large"
                  aria-label="cuenta del usuario"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    '&:hover': {
                      backgroundColor: hoverYellow,
                      color: '#000000'
                    }
                  }}
                >
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#7e3af2',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
                <MuiMenu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      minWidth: '200px',
                      mt: 1.5,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1,
                        '&:hover': {
                          backgroundColor: hoverYellow,
                          color: '#000000'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                      {user.nombre} {user.apellido}
                    </Typography>
                  </MenuItem>
                  <MenuItem disabled>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Tipo: {user.tipo_usuario.charAt(0).toUpperCase() + user.tipo_usuario.slice(1)}
                    </Typography>
                  </MenuItem>
                  <MenuItem component={Link} to="/perfil" onClick={handleClose}>Mi Perfil</MenuItem>
                  <MenuItem component={Link} to="/mis-rifas" onClick={handleClose}>Mis Rifas</MenuItem>
                  {user.es_operador === 1 && (
                    <MenuItem component={Link} to="/admin" onClick={handleClose}>Panel Admin</MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ color: '#f44336' }}>Cerrar Sesión</MenuItem>
                </MuiMenu>
              </Box>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{
                  ...roundedButtonStyle,
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  '&:hover': {
                    backgroundColor: hoverYellow,
                    borderColor: hoverYellow,
                    color: '#000000',
                  },
                }}
              >
                Iniciar Sesión
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={{
                  ...roundedButtonStyle,
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  '&:hover': {
                    backgroundColor: hoverYellow,
                    borderColor: hoverYellow,
                    color: '#000000',
                  },
                }}
              >
                Registrarse
              </Button>
            </>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
            <IconButton size="small" sx={{ color: 'white', '&:hover': { color: hoverYellow } }}>
              <Facebook size={25} />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white', '&:hover': { color: hoverYellow } }}>
              <Twitter size={25} />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white', '&:hover': { color: hoverYellow } }}>
              <Instagram size={25} />
            </IconButton>
          </Box>
        </Box>
        <IconButton
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: 'white',
            ml: 2,
            '&:hover': { 
              color: '#000000',
              backgroundColor: hoverYellow 
            },
          }}
          onClick={handleDrawerToggle}
        >
          <Menu />
        </IconButton>
      </Toolbar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '&.MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
