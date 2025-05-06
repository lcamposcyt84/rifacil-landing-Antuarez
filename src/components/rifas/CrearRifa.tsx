import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Alert,
  AlertTitle,
  IconButton,
  InputAdornment,
  FormHelperText,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { Add as AddIcon, Delete as DeleteIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Definir interfaces para el formulario
interface Premio {
  descripcion: string;
  valor: number;
  tipo: 'monetario' | 'fisico' | 'servicio';
  posicion: number;
}

interface RifaFormData {
  nombre: string;
  modalidad_tickets: 'limitado' | 'ilimitado';
  cantidad_tickets: number;
  valor_ticket: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  hora_sorteo: Date;
  modalidad_premio: 'minirifa' | 'superrifa' | 'maxirifa';
  valor_total_premios: number;
  comision_operador: number;
  regalias: number;
  premios: Premio[];
}

interface RifaCreada {
  id: number;
  nombre: string;
  cantidad_tickets: number;
  valor_ticket: number;
  valor_total_premios: number;
  modalidad_tickets: string;
}

const CrearRifa = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [rifaCreada, setRifaCreada] = useState<RifaCreada | null>(null);

  // Estado para el formulario
  const [formData, setFormData] = useState<RifaFormData>({
    nombre: '',
    modalidad_tickets: 'limitado',
    cantidad_tickets: 100,
    valor_ticket: 0,
    fecha_inicio: new Date(),
    fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Una semana después
    hora_sorteo: new Date(),
    modalidad_premio: 'minirifa',
    valor_total_premios: 0,
    comision_operador: 5, // Valor predeterminado
    regalias: 0,
    premios: [{ descripcion: '', valor: 0, tipo: 'monetario', posicion: 1 }]
  });

  // Verificar si el usuario puede crear rifas
  useEffect(() => {
    if (!user || (user.tipo_usuario !== 'persona' && user.tipo_usuario !== 'empresa')) {
      setError('No tienes permisos para crear rifas');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar cambios en los selects
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar cambios en los campos de fecha
  const handleDateChange = (name: string) => (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        [name]: date
      });
    }
  };

  // Manejar cambios en los premios
  const handlePremioChange = (index: number, field: keyof Premio, value: any) => {
    const updatedPremios = [...formData.premios];
    updatedPremios[index] = {
      ...updatedPremios[index],
      [field]: value
    };
    setFormData({
      ...formData,
      premios: updatedPremios
    });
  };

  // Agregar un nuevo premio
  const addPremio = () => {
    setFormData({
      ...formData,
      premios: [
        ...formData.premios,
        {
          descripcion: '',
          valor: 0,
          tipo: 'monetario',
          posicion: formData.premios.length + 1
        }
      ]
    });
  };

  // Eliminar un premio
  const removePremio = (index: number) => {
    const updatedPremios = formData.premios.filter((_, i) => i !== index);
    // Actualizar posiciones
    const reorderedPremios = updatedPremios.map((premio, i) => ({
      ...premio,
      posicion: i + 1
    }));
    setFormData({
      ...formData,
      premios: reorderedPremios
    });
  };

  // Manejar carga de imagen
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Solo se permiten archivos de imagen (JPEG, PNG, GIF)');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }

      setSelectedFile(file);

      // Crear URL para previsualización
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);

      setError(null);
    }
  };

  // Calcular valor total de premios
  useEffect(() => {
    const totalPremios = formData.premios.reduce((sum, premio) => sum + premio.valor, 0);
    setFormData(prev => ({
      ...prev,
      valor_total_premios: totalPremios
    }));
  }, [formData.premios]);

  // Manejar cierre del Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Enviar formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setRifaCreada(null);

    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) {
        throw new Error('El nombre de la rifa es obligatorio');
      }

      if (formData.valor_ticket <= 0) {
        throw new Error('El valor del boleto debe ser mayor a 0');
      }

      if (formData.modalidad_tickets === 'limitado' && formData.cantidad_tickets <= 0) {
        throw new Error('La cantidad de boletos debe ser mayor a 0');
      }

      if (formData.premios.length === 0) {
        throw new Error('Debe agregar al menos un premio');
      }

      if (formData.premios.some(premio => !premio.descripcion.trim() || premio.valor <= 0)) {
        throw new Error('Todos los premios deben tener descripción y valor mayor a 0');
      }

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('modalidad_tickets', formData.modalidad_tickets);
      formDataToSend.append('cantidad_tickets', formData.cantidad_tickets.toString());
      formDataToSend.append('valor_ticket', formData.valor_ticket.toString());
      formDataToSend.append('fecha_inicio', formData.fecha_inicio.toISOString());
      formDataToSend.append('fecha_fin', formData.fecha_fin.toISOString());
      formDataToSend.append('hora_sorteo', formData.hora_sorteo.toTimeString().split(' ')[0]);
      formDataToSend.append('modalidad_premio', formData.modalidad_premio);
      formDataToSend.append('valor_total_premios', formData.valor_total_premios.toString());
      formDataToSend.append('comision_operador', formData.comision_operador.toString());
      formDataToSend.append('regalias', formData.regalias.toString());
      formDataToSend.append('premios', JSON.stringify(formData.premios));

      if (selectedFile) {
        formDataToSend.append('imagen', selectedFile);
      }

      // Obtener token del localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se ha iniciado sesión');
      }

      // Enviar solicitud
      const response = await fetch('http://localhost:3000/api/rifas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Error al crear la rifa');
      }

      // Extraer información de la rifa creada
      const nuevaRifa: RifaCreada = data.rifa || data;
      setRifaCreada(nuevaRifa);

      // Crear mensajes de éxito
      const mensajeExito = `¡Rifa "${nuevaRifa.nombre}" creada con éxito! Se han generado ${nuevaRifa.cantidad_tickets} tickets con un valor de $${nuevaRifa.valor_ticket} cada uno.`;
      setSuccess(mensajeExito);

      // Mostrar notificación toast
      setSnackbarMessage(`Rifa creada: ${nuevaRifa.nombre} (ID: ${nuevaRifa.id})`);
      setOpenSnackbar(true);

      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate('/mis-rifas');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Error al crear la rifa');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#121726', color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Crear Nueva Rifa
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            variant="filled"
            sx={{
              mb: 3,
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
            action={
              <Button color="inherit" size="small" onClick={() => navigate('/mis-rifas')}>
                Ver mis rifas
              </Button>
            }
          >
            <AlertTitle>¡Operación Exitosa!</AlertTitle>
            {success}
          </Alert>
        )}

        {rifaCreada && (
          <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'rgba(46, 125, 50, 0.1)', border: '1px solid #2e7d32', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ color: '#2e7d32', mb: 1 }}>
              Detalles de la Rifa Creada:
            </Typography>
            <Typography variant="body2">
              <strong>ID:</strong> {rifaCreada.id}
            </Typography>
            <Typography variant="body2">
              <strong>Nombre:</strong> {rifaCreada.nombre}
            </Typography>
            <Typography variant="body2">
              <strong>Tickets generados:</strong> {rifaCreada.cantidad_tickets}
            </Typography>
            <Typography variant="body2">
              <strong>Valor por ticket:</strong> ${rifaCreada.valor_ticket}
            </Typography>
            <Typography variant="body2">
              <strong>Valor total de premios:</strong> ${rifaCreada.valor_total_premios}
            </Typography>
          </Paper>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Nombre de la rifa */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la Rifa"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#7e3af2' }
                  }
                }}
              />
            </Grid>

            {/* Modalidad de tickets */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="modalidad-tickets-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Modalidad de Tickets
                </InputLabel>
                <Select
                  labelId="modalidad-tickets-label"
                  name="modalidad_tickets"
                  value={formData.modalidad_tickets}
                  onChange={handleSelectChange}
                  label="Modalidad de Tickets"
                  required
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7e3af2' },
                    '.MuiSvgIcon-root': { color: 'white' }
                  }}
                >
                  <MenuItem value="limitado">Limitado</MenuItem>
                  <MenuItem value="ilimitado">Ilimitado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Cantidad de tickets (solo si es limitado) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de entradas"
                name="cantidad_tickets"
                type="number"
                value={formData.cantidad_tickets}
                onChange={handleChange}
                disabled={formData.modalidad_tickets !== 'limitado'}
                InputProps={{
                  style: { color: 'white' },
                  inputProps: { min: 1 }
                }}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#7e3af2' }
                  }
                }}
              />
            </Grid>

            {/* Fecha de finalización */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha de finalización"
                  value={formData.fecha_fin}
                  onChange={handleDateChange('fecha_fin')}
                  minDate={new Date()}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#7e3af2' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiSvgIcon-root': { color: 'white' }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Valor del boleto */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor del billete"
                name="valor_ticket"
                type="number"
                value={formData.valor_ticket}
                onChange={handleChange}
                required
                InputProps={{
                  style: { color: 'white' },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0.01, step: 0.01 }
                }}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#7e3af2' }
                  },
                  '& .MuiInputAdornment-root': { color: 'white' }
                }}
              />
            </Grid>

            {/* Hora del sorteo */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <TimePicker
                  label="Hora de Ejecución"
                  value={formData.hora_sorteo}
                  onChange={handleDateChange('hora_sorteo')}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#7e3af2' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiSvgIcon-root': { color: 'white' }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Modalidad de premio */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="modalidad-premio-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Modalidad del Premio
                </InputLabel>
                <Select
                  labelId="modalidad-premio-label"
                  name="modalidad_premio"
                  value={formData.modalidad_premio}
                  onChange={handleSelectChange}
                  label="Modalidad del Premio"
                  required
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7e3af2' },
                    '.MuiSvgIcon-root': { color: 'white' }
                  }}
                >
                  <MenuItem value="minirifa">Mini Rifa</MenuItem>
                  <MenuItem value="superrifa">Super Rifa</MenuItem>
                  <MenuItem value="maxirifa">Maxi Rifa</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Imagen de la rifa */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Imagen de la Rifa
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, border: '1px dashed rgba(255,255,255,0.3)', borderRadius: 1 }}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2, bgcolor: '#7e3af2', '&:hover': { bgcolor: '#6929c4' } }}
                >
                  Subir imagen
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>

                {selectedFile && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Archivo seleccionado: {selectedFile.name}
                  </Typography>
                )}

                {previewUrl && (
                  <Box sx={{ mt: 2, maxWidth: '100%', maxHeight: '200px', overflow: 'hidden' }}>
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Sección de premios */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Premios
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addPremio}
                  size="small"
                  sx={{ bgcolor: '#7e3af2', '&:hover': { bgcolor: '#6929c4' } }}
                >
                  Añadir Premio
                </Button>
              </Typography>

              {formData.premios.map((premio, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Descripción"
                        value={premio.descripcion}
                        onChange={(e) => handlePremioChange(index, 'descripcion', e.target.value)}
                        required
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#7e3af2' }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Valor"
                        type="number"
                        value={premio.valor}
                        onChange={(e) => handlePremioChange(index, 'valor', parseFloat(e.target.value))}
                        required
                        InputProps={{
                          style: { color: 'white' },
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          inputProps: { min: 0.01, step: 0.01 }
                        }}
                        InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: '#7e3af2' }
                          },
                          '& .MuiInputAdornment-root': { color: 'white' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel id={`tipo-premio-${index}-label`} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Tipo
                        </InputLabel>
                        <Select
                          labelId={`tipo-premio-${index}-label`}
                          value={premio.tipo}
                          onChange={(e) => handlePremioChange(index, 'tipo', e.target.value)}
                          label="Tipo"
                          required
                          sx={{
                            color: 'white',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7e3af2' },
                            '.MuiSvgIcon-root': { color: 'white' }
                          }}
                        >
                          <MenuItem value="monetario">Valor Monetario</MenuItem>
                          <MenuItem value="fisico">Producto Físico</MenuItem>
                          <MenuItem value="servicio">Servicio</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton
                        onClick={() => removePremio(index)}
                        disabled={formData.premios.length <= 1}
                        sx={{ color: 'red' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
                Valor total de premios: ${formData.valor_total_premios.toFixed(2)}
              </Typography>
            </Grid>

            {/* Botón de envío */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 2,
                  bgcolor: '#7e3af2',
                  '&:hover': { bgcolor: '#6929c4' },
                  '&:disabled': { bgcolor: 'rgba(126, 58, 242, 0.5)' }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Crear Rifa'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          elevation={6}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CrearRifa;
