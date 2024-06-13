import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Grid, CardContent, CardMedia, Typography, Button, Box, Container, CircularProgress } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserContext } from "@/components/Context/UseContext";

const ProductoView = () => {
  const router = useRouter();
  const { id } = router.query;
  const { productos } = useUserContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && productos) {
      const foundProduct = productos.find((prod) => prod.id === Number(id));
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [id, productos]);

  const handleBackClick = () => {
    router.push('/'); // Cambia esta ruta según sea necesario
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5" color="error">
          Producto no encontrado
        </Typography>
      </Box>
    );
  }

  const {  modelo, marca, cantidad, color, detalles, imagen, precioVenta, descuento, estado } = product;

  return (
    <>
    <Container maxWidth="md" sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, mt: 4, py: 4, position: 'relative' }}>
      <Button 
        variant="contained" 
        color="error" 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBackClick} 
        sx={{ position: 'absolute', top: 16, left: 16 }}
      >
        Volver
      </Button>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
            <CardMedia
              component="img"
              alt={modelo}
              image={imagen}
              title={modelo}
              sx={{ height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} display="flex" flexDirection="column" justifyContent="center">
          <CardContent>
            <Typography component="h1" variant="h4" gutterBottom>
              {modelo}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Marca: {marca}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Color: {color}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {detalles}
            </Typography>
            <Typography variant="h5" color="success" gutterBottom>
              Precio: ${precioVenta.toFixed(2)}
            </Typography>
            {descuento > 0 && (
              <Typography variant="body2" color="error" gutterBottom>
                Descuento: {descuento}%
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Estado: {estado ? "Disponible" : "No Disponible"}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Items: {cantidad}
            </Typography>
            <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
              Agregar al Carrito
            </Button>
          </CardContent>
        </Grid>
      </Grid>
      
    </Container>
    <br />
    </>
  );
};

export default ProductoView;
