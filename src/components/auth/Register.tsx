import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Link, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    numero_telefono: '',  // Cambiado de 'telefono' a 'numero_telefono' para coincidir con la DB
    correo_electronico: '',
    fecha_nacimiento: null,
    residencia: '',  // Cambiado de 'provincia' a 'residencia' para coincidir con la DB
    contraseña: '',  // Cambiado de 'contrasena' a 'contraseña' para coincidir con la DB
    confirmarContraseña: '',  // Actualizado para mantener consistencia
    tipo_usuario: 'persona'  // Nuevo campo requerido según tu esquema
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      fecha_nacimiento: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validaciones básicas
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.cedula) newErrors.cedula = 'La cédula es obligatoria';
    if (!formData.numero_telefono) newErrors.numero_telefono = 'El número de teléfono es obligatorio';
    if (!formData.correo_electronico) newErrors.correo_electronico = 'El correo electrónico es obligatorio';
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    if (!formData.residencia) newErrors.residencia = 'La residencia es obligatoria';
    if (!formData.contraseña) newErrors.contraseña = 'La contraseña es obligatoria';
    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Formatear fecha para enviar al backend (YYYY-MM-DD)
    const fechaFormateada = formData.fecha_nacimiento instanceof Date ? 
      formData.fecha_nacimiento.toISOString().split('T')[0] : null;
    
    // Preparar datos para enviar al backend
    const userData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      cedula: formData.cedula,
      correo_electronico: formData.correo_electronico,
      residencia: formData.residencia,
      fecha_nacimiento: fechaFormateada,
      numero_telefono: formData.numero_telefono,
      contraseña: formData.contraseña,
      tipo_usuario: formData.tipo_usuario
    };
    
    try {
      console.log('Datos a enviar:', userData);
      
      const response = await fetch('http://localhost:3000/api/auth/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Manejar errores del servidor
        if (data.errors) {
          const serverErrors = data.errors.reduce((acc, err) => ({
            ...acc,
            [err.param]: err.msg
          }), {});
          setErrors(serverErrors);
        } else {
          setErrors({ general: data.msg || 'Error al registrar usuario' });
        }
        setIsLoading(false);
        return;
      }
      
      // Registro exitoso
      console.log('Usuario registrado correctamente:', data);
      // Redirigir al login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrors({ general: 'Error de conexión. Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
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
                Crear una cuenta en Rifácil
              </Typography>
              <Typography variant="body1" gutterBottom color="white" sx={{ mb: 4 }}>
                Preparate para acceder y ser el protagonista dentro de nuestra plataforma
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Typography color="white" sx={{ mb: 2 }}>Ingresa tus datos</Typography>
                
                {errors.general && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {errors.general}
                  </Typography>
                )}
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="nombre"
                  label="Nombre"
                  variant="standard"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  sx={{ mb: 1 }}
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="apellido"
                  label="Apellido"
                  variant="standard"
                  value={formData.apellido}
                  onChange={handleChange}
                  error={!!errors.apellido}
                  helperText={errors.apellido}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  sx={{ mb: 1 }}
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="cedula"
                  label="Cédula de identidad"
                  variant="standard"
                  value={formData.cedula}
                  onChange={handleChange}
                  error={!!errors.cedula}
                  helperText={errors.cedula}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  sx={{ mb: 1 }}
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="numero_telefono"
                  label="Número de teléfono"
                  variant="standard"
                  value={formData.numero_telefono}
                  onChange={handleChange}
                  error={!!errors.numero_telefono}
                  helperText={errors.numero_telefono}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  sx={{ mb: 1 }}
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="correo_electronico"
                  label="Correo electrónico"
                  variant="standard"
                  value={formData.correo_electronico}
                  onChange={handleChange}
                  error={!!errors.correo_electronico}
                  helperText={errors.correo_electronico}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  sx={{ mb: 1 }}
                />
                
                {/* DatePicker actualizado para MUI v6 */}
                <DatePicker
                  label="Fecha de nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      variant: "standard",
                      error: !!errors.fecha_nacimiento,
                      helperText: errors.fecha_nacimiento,
                      InputProps: { style: { color: 'white' } },
                      InputLabelProps: { style: { color: 'white' } },
                      sx: { mb: 1 }
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="residencia"
                  label="Dirección de residencia"
                  variant="standard"
                  value={formData.residencia}
                  onChange={handleChange}
                  error={!!errors.residencia}
                  helperText={errors.residencia}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  sx={{ mb: 1 }}
                />
                
                <FormControl fullWidth margin="normal" variant="standard" sx={{ mb: 1 }}>
                  <InputLabel id="tipo-usuario-label" sx={{ color: 'white' }}>Tipo de Usuario</InputLabel>
                  <Select
                    labelId="tipo-usuario-label"
                    name="tipo_usuario"
                    value={formData.tipo_usuario}
                    onChange={handleChange}
                    label="Tipo de Usuario"
                    sx={{ color: 'white', '&:before': { borderBottomColor: 'white' } }}
                  >
                    <MenuItem value="persona">Persona</MenuItem>
                    <MenuItem value="empresa">Empresa</MenuItem>
                    <MenuItem value="gobierno">Gobierno</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="contraseña"
                  label="Contraseña"
                  type="password"
                  variant="standard"
                  value={formData.contraseña}
                  onChange={handleChange}
                  error={!!errors.contraseña}
                  helperText={errors.contraseña}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  sx={{ mb: 1 }}
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="confirmarContraseña"
                  label="Confirmar contraseña"
                  type="password"
                  variant="standard"
                  value={formData.confirmarContraseña}
                  onChange={handleChange}
                  error={!!errors.confirmarContraseña}
                  helperText={errors.confirmarContraseña}
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                  sx={{ mb: 3 }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: '#7e3af2',
                    '&:hover': {
                      bgcolor: '#6929c4'
                    }
                  }}
                >
                  {isLoading ? 'Procesando...' : 'Continuar'}
                </Button>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="white">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" color="secondary">
                      Inicia sesión
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
    </LocalizationProvider>
  );
};

export default Register;
