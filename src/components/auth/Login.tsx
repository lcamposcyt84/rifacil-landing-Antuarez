import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Link, Grid, Divider, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

const Login = () => {
  const [formData, setFormData] = useState({
    correo_electronico: '',
    contraseña: ''  // Cambiado de 'contrasena' a 'contraseña' para coincidir con la DB
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validaciones básicas
    if (!formData.correo_electronico || !formData.contraseña) {
      setError('Por favor, complete todos los campos');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo_electronico: formData.correo_electronico,
          contraseña: formData.contraseña
        })
      });
      
      console.log('Respuesta del servidor:', response.status);
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (!response.ok) {
        throw new Error(data.msg || 'Error al iniciar sesión');
      }
      
      // Guardar token y datos de usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      console.log('Token guardado:', data.token);
      console.log('Usuario guardado:', data.usuario);
      
      // Verificar que se guardaron correctamente
      console.log('Token en localStorage:', localStorage.getItem('token'));
      console.log('Usuario en localStorage:', localStorage.getItem('usuario'));
      
      // Recargar la página para que los cambios se reflejen
      window.location.href = '/';
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              p: 4,
              height: '100vh',
              bgcolor: '#121726'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom color="white">
              Iniciar sesión
            </Typography>
            <Typography variant="body1" gutterBottom color="white" sx={{ mb: 4 }}>
              Ingrese su correo electrónico y contraseña para iniciar sesión
            </Typography>
            
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                margin="normal"
                name="correo_electronico"
                label="Correo electrónico *"
                variant="standard"
                value={formData.correo_electronico}
                onChange={handleChange}
                InputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                margin="normal"
                name="contraseña"
                label="Contraseña"
                type="password"
                variant="standard"
                value={formData.contraseña}
                onChange={handleChange}
                InputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{ mb: 1 }}
              />
              
              <Box sx={{ textAlign: 'right', mb: 2 }}>
                <Link href="/recuperar-contrasena" color="secondary" underline="hover">
                  ¿Ha olvidado su contraseña?
                </Link>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  mb: 2,
                  bgcolor: '#7e3af2',
                  '&:hover': {
                    bgcolor: '#6929c4'
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
              
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Typography color="white" sx={{ mx: 1 }}>o</Typography>
                <Divider sx={{ flexGrow: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'white'
                      }
                    }}
                  >
                    Iniciar con Google
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AppleIcon />}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        borderColor: 'white'
                      }
                    }}
                  >
                    Iniciar con Apple
                  </Button>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="white">
                  ¿No tienes cuenta en Rifácil?{' '}
                  <Link href="/register" color="secondary">
                    Regístrate
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box
            sx={{
              height: '100vh',
              backgroundImage: 'url(/img/laptop-mockup.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
