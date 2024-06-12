import { apiListadoCategorias } from "@/Api/Categoria/Categoria";
import { apiListadoArticulos } from "@/Api/Producto/Producto";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [modulo, setModulo] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando,setCargando]=useState(false)
  useEffect(() => {
    // Verificar si estamos en un entorno del navegador
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("token") || [];
      if(token.length>0){
        const user = JSON.parse(JSON.stringify(parseJwt(token)));
        const rol = user?.roles[0]?.nombre?.split("_")[1]?.toLowerCase();
        setUsuario(user);
        setModulo(rol);
      }
  
    }
  }, []);

  const [categorias, setCategorias] = useState([]);
  const listadoProductos = async () => {
    try {
      setCargando(true);
      const response = await apiListadoArticulos();
      const data = await response.json();
      console.log(data);
      setProductos(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };
  
  const listadoCategorias = async () => {
    try {
      const response = await apiListadoCategorias();
      const data = await response.json();
      console.log(data)
      setCategorias(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    listadoProductos()
    listadoCategorias()
  }, []);

  //Pasos del carrrito
  const [steps, setStep] = useState({
    stepsItems: ["Productos", "Resumen", "Informacion", "Confirmar"],
    currentStep: 2,
  });

  const [cart, setCart] = useState(() => {
    // Comprueba si `window` está definido antes de acceder a `localStorage`
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart")) || [];
    }
    return [];
  });
  const addToCart = (item) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find((cartItem) => cartItem.id === item.id);

      if (itemInCart) {
        // Verificar que la cantidadLlevar sea menor a la cantidad del producto en el inventario
        if (itemInCart.cantidadLlevar < item.cantidad) {
          return prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, cantidadLlevar: cartItem.cantidadLlevar + 1 }
              : cartItem
          );
        } else {
          alert("No puedes agregar más de este producto.");
          return prevCart;
        }
      }

      return [...prevCart, { ...item, cantidadLlevar: 1 }];
    });
    console.log(cart)
  };
  const [payer, setPayer] = useState({});

  const [orderDto, setOrderDto] = useState({});
  const [payerDto, setPayerDto] = useState({});
  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  return (
    <UserContext.Provider
      value={{
        cargando,setCargando,
        usuario,setUsuario,modulo,setModulo,
        productos,setProductos,
        categorias,
        cart,
        setCart,
        addToCart,
        steps,
        setStep,
        payer,
        setPayer,
        orderDto,
        setOrderDto,
        payerDto,
        setPayerDto,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
