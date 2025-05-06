import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Features from './components/Features';
import Contact from './components/Contact';
import Footer from './components/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1c37a3',
    },
    secondary: {
      main: '#ffae00', // Yellow color for hover effects
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Inter", "Helvetica", "Arial", sans-serif', // Montserrat first
    h1: {  // Apply Montserrat to h1
      fontWeight: 800, // Extrabold
    },
    h5: { // you can also add other variants
      fontWeight: 400, // Normal
    },
    allVariants: {
      color: 'white',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          '&:hover': {
            backgroundColor: '#ffae00',
            color: '#1c37a3',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <Products />
        <Features />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;