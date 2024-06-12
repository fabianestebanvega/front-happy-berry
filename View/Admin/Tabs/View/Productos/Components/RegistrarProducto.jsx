// components/RegistrarProducto.js

import React, { useState } from "react";
import { useUserContext } from "@/components/Context/UseContext";
import {
  Grid,
  TextField,
  Checkbox,
  Button,
  Typography,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { apiSaveArticulo } from "@/Api/Producto/Producto";

const RegistrarProducto = ({ toggleVistaRegistrar }) => {
  const { categorias, setProductos } = useUserContext();
  const [formData, setFormData] = useState({
    categoria: null,
    modelo: "",
    marca: "",
    cantidad: "",
    color: "",
    detalles: "",
    imagen: null,
    precioCompra: "",
    precioVenta: "",
    descuento: "",
    estado: false,
  });
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "categoria") {
      const selectedCategoria = categorias.find(
        (categoria) => categoria.id === value
      );
      setFormData({
        ...formData,
        categoria: selectedCategoria,
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          type === "checkbox" ? checked : type === "file" ? files[0] : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Activar loading
    const data = new FormData();
    data.append(
      "articulo",
      new Blob([JSON.stringify({ ...formData, imagen: undefined })], {
        type: "application/json",
      })
    );
    data.append("file", formData.imagen);
    apiSaveArticulo(data)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false); // Desactivar loading
        if (data.success) {
          setProductos((prevUsuarios) => [...prevUsuarios, data.data]);
          toggleVistaRegistrar();
        } else {
          console.log(data.mensaje);
        }
      })
      .catch((e) => {
        setIsLoading(false); // Desactivar loading en caso de error
        console.log(e);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "16px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        className="font-bold text-center p-3"
        gutterBottom
      >
        Registrar Producto
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="categoria"
              value={formData.categoria ? formData.categoria.id : ""}
              onChange={handleChange}
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Cantidad"
            name="cantidad"
            type="number"
            value={formData.cantidad}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Publico"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Precio Compra"
            name="precioCompra"
            type="number"
            value={formData.precioCompra}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Precio Venta"
            name="precioVenta"
            type="number"
            value={formData.precioVenta}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Descuento"
            name="descuento"
            type="number"
            value={formData.descuento}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Detalles"
            name="detalles"
            value={formData.detalles}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            name="imagen"
            onChange={handleChange}
            style={{ display: "block", marginTop: "16px" }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="outlined" 
            color="primary" 
            fullWidth 
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegistrarProducto;
