import { useUserContext } from "@/components/Context/UseContext";
import { useEffect, useState } from "react";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import * as Dialog from "@radix-ui/react-dialog";
import InfoIcon from "@mui/icons-material/Info";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, Tooltip } from "@mui/material";
import App from "../../../../client/App";
const Pay = () => {
  const [loading, setLoading] = useState(false);
  // Context
  const { cart, setCart, setStep, steps, orderDto } = useUserContext();

  //Variables con los Valores del summary
  const [total, setTotal] = useState(0);
  const [totalOld, setTotalOld] = useState(0);
  const [items, setItems] = useState(0);
  const [discount, setDiscount] = useState(0);
  useEffect(() => {
    // Guarda el carrito en el localStorage cada vez que se actualiza
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  //Cargo los valores al summary
  useEffect(() => {
    // Calculate the total price when the cart changes

    let subTotal = 0;
    let subTotalOld = 0;
    let subItems = 0;
    cart.map((item) => {
      subTotal += item.price * item.quantity;
      subTotalOld += item.priceOld * item.quantity;
      subItems += item.quantity;
    });
    // Redondear los totales a dos decimales
    const roundedSubTotal = subTotal.toFixed(2);
    const roundedSubTotalOld = subTotalOld.toFixed(2);
    setTotal(roundedSubTotal);
    setTotalOld(roundedSubTotalOld);
    setDiscount(parseFloat(roundedSubTotalOld - roundedSubTotal).toFixed(2));
    setItems(subItems);
  }, [cart]);

  //Guarda el id del item a eliminar
  const [deleteId, setDeleteId] = useState(0);
  const [mensaje, setMensaje] = useState({
    texto: "Order details",
    color: "",
  });

  //Modal eliminar producto
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

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
      {steps.currentStep == 4 && (
        <>
          {loading && (
            <div className="overlay">
              <div className="spinner " aria-hidden="true"></div>
            </div>
          )}
          {items > 0 && cart.length > 0 ? (
            <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
              <div class="mt-6 h-full rounded-lg  border text-white p-6 shadow-md md:mt-0 md:w-1/3">
                <div
                  class={`  mb-2 flex justify-between rounded-md  border  bg-gray-900`}
                >
                  <div className="flex justify-between py-3">
                    <div className="flex">
                      <div>
                        <WavingHandIcon />
                      </div>
                      <div className="self-center ml-3">
                        <span
                          className={`text-${mensaje.color}-600 mt-1 font-bold`}
                        >
                          {mensaje.texto}
                        </span>
                      </div>
                    </div>
                    <button className="self-start text-green-500">
                      <div>{mensaje.icon}</div>
                    </button>
                  </div>
                </div>
                <div class="mb-2 flex justify-between">
                  <p class="text-white-700">Subtotal</p>
                  <p class="text-white-900 font-bold">${totalOld}</p>
                </div>
                <div class="flex mb-2 justify-between">
                  <p class="text-white-700">Discount</p>
                  <p class="text-white-700 font-bold">- ${discount}</p>
                </div>
                {/* <div class="flex justify-between">
              <p class="text-white-700">pay</p>
              <p class="text-white-700 font-bold">${total}.00</p>
            </div> */}
                <hr class="my-4" />
                <div class="flex justify-between">
                  <p class="text-lg font-bold">Total</p>
                  <div class="">
                    <p class="mb-1 text-lg font-bold">${total} USD</p>
                    <p class="text-sm text-gray-500">Items : {items}</p>
                  </div>
                </div>
              </div>
              <div class=" bg-gray-100  h-full rounded-lg border text-white p-3  md:w-2/3">
                <h1 className="text-center text-gray-900  text-xl font-bold mt-3">
                  PAYMENT METHODS
                </h1>
                <div className="mt-3">
                  <App orderDto={orderDto} />
                </div>
              </div>
            </div>
          ) : (
            <h1 class="mb-10 text-center text-white text-2xl font-bold">
              Empty Cart <Battery0BarIcon />
            </h1>
          )}
          <h1 className="text-center text-white text-xl font-bold mt-3">
            PRODUCTS
          </h1>
          {items > 0 && cart.length > 0 && (
            <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 mt-6">
              <div class="rounded-lg md:w-full">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    class="justify-between text-white mb-6 rounded-lg border p-6 shadow-md sm:flex sm:justify-start"
                  >
                    <img
                      src={`/images/Macros/${item.img}`}
                      alt="product-image"
                      class="w-full rounded-lg sm:w-40"
                    />

                    <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      <div class="mt-5 sm:mt-0">
                        <h2 class="text-lg font-bold text-white text-gray-900">
                          {item.name}
                        </h2>
                        <p class="mt-1 text-xs text-gray-200">
                          Item :{" "}
                          <span className="text-xs text-gray-100 font-bold ">
                            ${parseFloat(item.price).toFixed(2)}
                          </span>
                        </p>
                        <p class="mt-1 text-xs text-gray-200">
                          Price Old :{" "}
                          <span className="text-xs text-gray-300 font-bold text-red-700 line-through">
                            ${parseFloat(item.priceOld).toFixed(2)}
                          </span>
                        </p>
                      </div>
                      <div class="mt-4 flex justify-between text-gray-900 sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                        <div class="flex items-center border-gray-100">
                          <span
                            class="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 "
                            title="Remove"
                          >
                            Quantity
                          </span>
                          <input
                            class="h-8 w-8 border bg-white text-center text-xs outline-none"
                            type="number"
                            value={item.quantity}
                            min="1"
                            disabled
                          />
                        </div>
                        <div class="flex font-bold items-center text-white space-x-4">
                          <p class="text-sm">
                            ${parseFloat(item.price * item.quantity).toFixed(2)}
                          </p>

                          {/* <button >
                            <ClearIcon />
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Pay;
