// components/ProductosAdmin.js

import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import RegistrarProducto from './Components/RegistrarProducto';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserContext } from '@/components/Context/UseContext';

const ProductosAdmin = () => {
  const { productos } = useUserContext();
  const [vistaRegistrar, setVistaRegistrar] = useState(false);
  const toggleVistaRegistrar = () => {
    setVistaRegistrar(!vistaRegistrar);
  };

  return (
    <div className="w-full mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <Typography variant="h4" component="h3" className="text-gray-800 font-bold sm:text-2xl">
            Productos
          </Typography>
        </div>
        <div className="mt-3 md:mt-0">
          {vistaRegistrar ? (
            <Button variant="outlined" color="error" onClick={toggleVistaRegistrar}>
              <ArrowBackIcon /> Volver
            </Button>
          ) : (
            <Button variant="outlined" color="success" onClick={toggleVistaRegistrar}>
              <AddCircleOutlineIcon /> Registrar
            </Button>
          )}
        </div>
      </div>
      {vistaRegistrar ? (
        <RegistrarProducto toggleVistaRegistrar={toggleVistaRegistrar} />
      ) : (
        <TableContainer component={Paper} className="mt-12 shadow-sm border rounded-lg">
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Imagen</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Precio Compra</TableCell>
                <TableCell>Precio Venta</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Estado</TableCell>
              
                <TableCell>Fecha Registro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>
                    <img src={producto.imagen} alt={producto.modelo} style={{ width: '50px', height: '50px' }} />
                  </TableCell>
                  <TableCell>{producto.categoria.nombre}</TableCell>
                  <TableCell>{producto.modelo}</TableCell>
                  <TableCell>{producto.marca}</TableCell>
                  <TableCell>{producto.cantidad}</TableCell>
                  <TableCell>{producto.color}</TableCell>
                  <TableCell>{producto.precioCompra}</TableCell>
                  <TableCell>{producto.precioVenta}</TableCell>
                  <TableCell>{producto.descuento}</TableCell>
                  <TableCell>{producto.estado ? 'Publico' : 'Privado'}</TableCell>
                  
                  <TableCell>{new Date(producto.fechaResgistro).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ProductosAdmin;
