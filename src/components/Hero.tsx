import { Box, Container, Typography, Button } from '@mui/material';

const Hero = () => {
  return (
    <Box sx={{
      position: 'relative',
      bgcolor: 'primary.main',
      overflow: 'hidden',
      pt: { xs: 1, md: 0 },
      pb: {xs:9, md:8},
      pl: {xs:0, md:4}
    }}>

      <Container maxWidth="xl" sx={{ // Added maxWidth="xl"
        pt: { xs: 20, md: 12 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: { xs: 10, md: 20 },
        px: { xs: 1, md: 0 }, // Added padding for better responsiveness
      }}>
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h1" component="h1" sx={{
            fontWeight: 'bold',
            mb: 1,
            fontSize: { xs: '2.2rem', sm: '2.5rem', md: '3.3rem' }, // Increased md font size
            color: 'rgb(226, 224, 224)',
            lineHeight: 1.2,
            maxWidth: '100%', // Added maxWidth for better text wrapping
            mx: 'auto', // Center text on smaller screens
          }}>
            Lorem Ipsum
          </Typography>
          <Typography variant="h5" sx={{
            mb: 6,
            opacity: 0.9,
            fontSize: { xs: '1rem', sm: '1.5rem', md: '1.5rem' }, // Increased md font size
            color: 'rgb(226, 224, 224)',
            maxWidth: '100%', // Added maxWidth for better text wrapping
            mx: 'auto', // Center text on smaller screens
          }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates.
          </Typography>
          <Box sx={{
            display: 'flex',
            gap: 3,
            justifyContent: { xs: 'center', md: 'flex-start' },
            flexWrap: 'wrap', // Added flexWrap to allow buttons to wrap
          }}>
            <Button
              variant="contained"
              color="inherit"
              size="large"
              sx={{
                px: { xs: 3, sm: 5 },
                py: { xs: 0.5, sm: 0.5 },
                borderRadius: 50,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: 'primary.main',
                whiteSpace: 'nowrap', // Prevent button text from wrapping
              }}
            >
              Leer más
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                px: { xs: 3, sm: 5 },
                py: { xs: 0.5, sm: 0.5 },
                borderRadius: 50,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', sm: '1.1rem' },
                bgcolor: '#ffae00',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgb(255, 255, 255)',
                  color: 'primary.main'
                },
                whiteSpace: 'nowrap', // Prevent button text from wrapping
              }}
            >
              Jugar
            </Button>
          </Box>
        </Box>
        <Box sx={{
          flex: 1,
          display: { xs: 'none', sm: 'block' },
          position: 'relative',
          width: '100%',
          maxWidth: { xs: '80%', md: '100%' },
          mx: 'auto'
        }}>
          <Box
            component="img"
            src="tlf.png"
            alt="iPhone"
            sx={{
              width: '100%',
              height: 'auto', // Changed to auto for better aspect ratio
              maxHeight: 'auto', // Added max height to prevent overflow
            }}
          />
        </Box>
      </Container>

      {/* U-Shaped Border SVG (Inverted) */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1, // Ensure it's above other elements
      }}>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path
            fill="white" // Color of the U shape
            d="M0,0 C 200,50 400,100 720,100 S 1240,50 1440,0 L 1440,100 L 0,100 Z" // Inverted U path
          />
        </svg>
      </Box>
    </Box>
  );
};

export default Hero;