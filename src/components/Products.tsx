import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Calendar, Clock, Ticket } from 'lucide-react';

interface ProductCardProps {
  date: string;
  time: string;
  title: string;
  description: string;
  tickets: number;
  image: string;
}

const ProductCard = ({ date, time, title, description, tickets, image }: ProductCardProps) => (
  <Card
    sx={{
      minWidth: '180px',
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      },
      flexShrink: 0,
      mr: 2,
      boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
    }}
  >
    {/* Imagen ocupando el 65% */}
    <CardMedia
      component="div"
      sx={{
        flex: '65%',
        position: 'relative',
        bgcolor: 'primary.main',
      }}
    >
      <Box
        component="img"
        src={image}
        alt="Rifa"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </CardMedia>

    {/* Contenido ocupando el 35% */}
    <CardContent
      sx={{
        flex: '35%',
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, bgcolor: '#1a237e', color: 'white', p: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Calendar size={12} color="white" />
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            {date}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Clock size={12} color="white" />
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            {time}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, p: 0.5 }}>
        <Typography variant="subtitle2" sx={{ color: '#1a237e', fontWeight: 'bold', fontSize: '0.9rem', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          {description}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: '#1a237e',
          color: 'white',
          p: 0.5,
          borderRadius: '20px',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.3, fontSize: '0.7rem' }}>
          <Ticket size={14} />
          {tickets} Ticket a sortear
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default ProductCard;