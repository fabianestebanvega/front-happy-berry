import { useUserContext } from "@/components/Context/UseContext";
import { useEffect, useState } from "react";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import * as Dialog from "@radix-ui/react-dialog";
import InfoIcon from "@mui/icons-material/Info";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, Tooltip, CircularProgress, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";

const Summary = () => {
  const [loading, setLoading] = useState(false);
  const { cart, setCart, setStep, steps } = useUserContext();

  const [total, setTotal] = useState(0);
  const [totalOld, setTotalOld] = useState(0);
  const [items, setItems] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [deleteId, setDeleteId] = useState(0);
  const [mensaje, setMensaje] = useState({
    texto: "Resumen Carrito",
    color: "gray",
  });

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let subTotal = 0;
    let subTotalOld = 0;
    let subItems = 0;
    cart.forEach((item) => {
      subTotal += item.precioVenta * item.cantidadLlevar;
      subTotalOld += item.precioVenta * item.cantidadLlevar;
      subItems += item.cantidadLlevar;
    });
    setTotal(subTotal.toFixed(2));
    setTotalOld(subTotalOld.toFixed(2));
    setDiscount((subTotalOld - subTotal).toFixed(2));
    setItems(subItems);
  }, [cart]);

  const addItem = (id) => {
    const existingProduct = cart.find((item) => item.id === id);
    if (
      existingProduct &&
      existingProduct.cantidadLlevar < existingProduct.cantidad
    ) {
      const updatedCart = cart.map((item) =>
        item.id === id
          ? { ...item, cantidadLlevar: item.cantidadLlevar + 1 }
          : item
      );
      setCart(updatedCart);
      setMensaje({
        texto: "Added item",
        color: "green",
        icon: <CheckCircleOutlineIcon className="text-green-600" />,
      });
    } else {
      alert("No puedes agregar más de este producto.");
    }
  };

  const removeItem = (id) => {
    const existingProduct = cart.find((item) => item.id === id);
    if (existingProduct) {
      if (existingProduct.cantidadLlevar > 1) {
        const updatedCart = cart.map((item) =>
          item.id === id
            ? { ...item, cantidadLlevar: item.cantidadLlevar - 1 }
            : item
        );
        setCart(updatedCart);
        setMensaje({
          texto: "Subtracted item",
          color: "red",
          icon: <CheckCircleOutlineIcon className="text-red-600" />,
        });
      } else {
        setDeleteId(id);
        toggle();
      }
    }
  };

  const deleteItem = () => {
    const updatedCart = cart.filter((item) => item.id !== deleteId);
    setCart(updatedCart);
    toggle();
    setMensaje({
      texto: "Item removed",
      color: "red",
      icon: <CheckCircleOutlineIcon className="text-red-600" />,
    });
  };

  const removeItemButton = (id) => {
    setDeleteId(id);
    toggle();
  };

  const checkout = () => {
    setLoading(true);
    setTimeout(() => {
      setStep((prevSteps) => ({
        ...prevSteps,
        currentStep: 3,
      }));
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {steps.currentStep <= 2 && (
        <>
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
              <CircularProgress />
            </div>
          )}
          {items > 0 && cart.length > 0 ? (
            <Grid container spacing={4} padding={2}>
              <Grid item xs={12} lg={9}>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-white mb-4 rounded-lg border p-4 shadow-md flex"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-1/3">
                      <img
                        src={item.imagen}
                        alt="product-image"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="ml-4 w-2/3">
                      <h2 className="text-lg font-bold text-gray-900">{item.marca}</h2>
                      <p className="mt-1 text-sm text-gray-900">
                        Precio:{" "}
                        <span className="text-gray-900 font-bold">
                          ${parseFloat(item.precioVenta).toFixed(2)}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        Descuento:{" "}
                        <span className="text-red-700 font-bold line-through">
                          {parseFloat(item.descuento)} %
                        </span>
                      </p>
                      <div className="mt-4 flex items-center">
                        <span
                          onClick={() => removeItem(item.id)}
                          className="cursor-pointer rounded bg-gray-100 py-1 px-3.5 duration-100 hover:bg-red-500 hover:text-white"
                          title="Remove"
                        >
                          -
                        </span>
                        <input
                          className="mx-2 w-12 border text-center text-sm outline-none"
                          type="number"
                          value={item.cantidadLlevar}
                          min="1"
                          readOnly
                        />
                        <span
                          onClick={() => addItem(item.id)}
                          className="cursor-pointer rounded bg-gray-100 py-1 px-3.5 duration-100 hover:bg-green-500 hover:text-white"
                          title="Add"
                        >
                          +
                        </span>
                        <Tooltip
                          title="Delete"
                          onClick={() => removeItemButton(item.id)}
                          className="ml-4 cursor-pointer duration-100 hover:bg-red-500 hover:text-white"
                        >
                          <IconButton>
                            <ClearIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div className="mt-2 text-sm font-bold text-gray-900">
                        ${parseFloat(item.precioVenta * item.cantidadLlevar).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Grid>
              <Grid item xs={12} lg={3}>
                <div className="bg-white rounded-lg border p-4 shadow-md">
                  <div className="mb-2 flex justify-between rounded-md border bg-gray-900 p-2">
                    <div className="flex items-center">
                      <WavingHandIcon className="text-white" />
                      <span className="ml-2 text-white font-bold">
                        {mensaje.texto}
                      </span>
                    </div>
                    <div className="text-green-500">{mensaje.icon}</div>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <p className="text-gray-700">Subtotal</p>
                    <p className="text-gray-900 font-bold">${totalOld}</p>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <p className="text-gray-700">Descuento</p>
                    <p className="text-gray-900 font-bold">- ${discount}</p>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <p className="text-lg font-bold">Total</p>
                    <div>
                      <p className="text-lg font-bold">${total}</p>
                      <p className="text-sm text-gray-500">Items : {items}</p>
                    </div>
                  </div>
                  <Button
                    onClick={checkout}
                    variant="outlined"
                    color="success"
                    className="mt-4 w-full"
                  >
                    Comprar
                  </Button>
                </div>
              </Grid>
            </Grid>
          ) : (
            <h1 className="text-center text-gray-900 text-2xl font-bold">
              Carrito vacío <Battery0BarIcon />
            </h1>
          )}
        </>
      )}

      <Dialog.Root open={modal} onOpenChange={toggle}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
            <div className="bg-gray-900 text-gray-500 rounded-md shadow-lg px-4 py-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <InfoIcon className="text-red-500 text-6xl font-bold" />
              </div>
              <Dialog.Title className="text-2xl font-bold text-white text-center mt-3">
               Quirar producto del carrito?
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-center text-gray-500"></Dialog.Description>
              <div className="items-center gap-2 mt-3 text-sm sm:flex">
                <Dialog.Close asChild>
                  <Button
                    onClick={deleteItem}
                    variant="contained"
                    color="secondary"
                    fullWidth
                  >
                    Quitar
                  </Button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Button
                    onClick={toggle}
                    variant="outlined"
                    fullWidth
                    className="mt-2 sm:mt-0"
                  >
                    Segir comprando
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default Summary;
