import React, { useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { apiFetchProductos } from "@/Api/Producto/Producto"; // Asegúrate de tener esta función para obtener los productos
import { useUserContext } from "@/components/Context/UseContext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const ProductosGrid = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { productos, cargando, setProductos ,addToCart} = useUserContext();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    // Cargar productos si no están cargados
    if (!productos) {
      setIsLoading(true);
      apiFetchProductos().then((data) => {
        setProductos(data);
        setIsLoading(false);
      });
    }
  }, [productos, setProductos]);

  if (cargando || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Grid container spacing={3}>
        {productos.map((producto) => {
          const descuento = Math.round(
            ((producto.precioOriginal - producto.precioVenta) /
              producto.precioOriginal) *
              100
          );

          return (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredProduct(producto.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                style={{ position: "relative" }}
              >
                <Card
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                  className="shadow-lg"
                >
                  <div
                    style={{
                      width: "100%",
                      height: "250px",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <CardContent style={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="div" noWrap>
                      {producto.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {producto.detalles}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        style={{ color: "red" }}
                      >
                        {producto.descuento}% OFF
                      </Typography>
                      <Typography variant="h6" component="div">
                        ${producto.precioVenta}
                      </Typography>
                    </div>
                    
                    {producto.envioGratis && (
                      <CardActions disableSpacing>
                        <LocalShippingIcon style={{ color: "green" }} />
                        <Typography variant="body2" color="text.secondary">
                          ENVÍO GRATIS
                        </Typography>
                      </CardActions>
                    )}
                  </CardContent>
                  {hoveredProduct === producto.id && (
                   <div className="mt-6 p-3 text-center">
                     <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: "absolute",
                        bottom: "16px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() =>
                          addToCart(producto)
                        }
                      >
                        Agregar al carrito
                      </Button>
                    </motion.div>
                   </div>
                  )}
                </Card>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default ProductosGrid;
