import React from "react"; // Importa React
import { useUserContext } from "@/components/Context/UseContext";
import LayoutEffect from "@/components/LayoutEffect";
import SectionWrapper from "@/components/SectionWrapper";
import { useEffect, useState } from "react";
import ModalProduct from "../../../components/ui/Modal/ModalProduct";
import AddShoppingCartSharpIcon from "@mui/icons-material/AddShoppingCartSharp";
import OpenInNewSharpIcon from "@mui/icons-material/OpenInNewSharp";
import Link from "next/link";
import { useRouter } from "next/router";
import Categories from "../index/Categories";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
const Item = () => {
  const router = useRouter();
  const { id } = router.query;
  const [itemActual, setItemActual] = useState([]);
  // Obtener la ubicación actual
  const { plan300, features, cart, setCart, plans } = useUserContext();
  useEffect(() => {
    if (id == 300) {
      setItemActual(plan300);
    } else {
      // Verifica si el producto ya está en el carrito

      const existingProduct = plans.find((item) => item.id == id);
      if (existingProduct) {
        setItemActual(existingProduct);
      }
    }
  }, [id, plan300, plans]);

  useEffect(() => {
    // Guarda el carrito en el localStorage cada vez que se actualiza
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddCart = () => {
    // Verifica si el producto ya está en el carrito

    const existingProduct = cart.find((item) => item.id === itemActual.id);
    if (existingProduct) {
      console.log(existingProduct);
      // Si el producto ya está en el carrito, actualiza la cantidad
      const updatedCart = cart.map((item) =>
        item.id === itemActual.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      toggle();
    } else {
      // Si el producto no está en el carrito, agrégalo con cantidad 1
      setCart([...cart, { ...itemActual, quantity: 1 }]);
      toggle();
    }
  };
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const team = [
    {
      avatar:
        "https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=685&q=80",
      name: "Martiana dialan",
      title: "Product designer",
      desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry. Lorem Ipsum has been the industry's standard dummy",
      linkedin: "javascript:void(0)",
      twitter: "javascript:void(0)",
      github: "javascript:void(0)",
    },
  ];
  return (
    <>
      <div className="relative max-w-xl mx-auto text-center">
        <h2 className="text-gray-50 text-3xl font-semibold sm:text-4xl">
          {itemActual.name}
        </h2>
      </div>
      <div className="relative max-w-5xl mx-auto text-center text-gray-200 mt-3 ">
        <p className="w-full">{itemActual.desc}</p>
      </div>

      <SectionWrapper className="relative py-14">
        <LayoutEffect
          className="duration-1000 delay-300"
          isInviewState={{
            trueState: "opacity-1",
            falseState: "opacity-0",
          }}
        >
          <div className="max-w-screen-xl mx-auto text-gray-600 md:px-8 text-white">
            <section className="mt-6 mx-auto max-w-screen-lg pb-12 px-4 items-center lg:flex md:px-8 ">
              <div className="flex-1 text-center mt-7 lg:mt-0 lg:ml-3">
                <img
                  src={`/images/Macros/${itemActual.img}`}
                  className="w-full mx-auto sm:w-10/12  lg:w-full"
                />
                <div className="p-4 py-8 border-b md:p-8">
                  <div className="justify-between flex">
                    <div className="max-w-xs">
                      <span className="text-2xl text-gray-100 font-semibold sm:text-3xl">
                        {itemActual.name}
                      </span>
                    </div>
                    <div className="flex-none text-gray-100 text-2xl font-semibold sm:text-3xl">
                      ${parseFloat(itemActual.price).toFixed(2)} /
                      <span className="text-xl text-red-700 font-bold line-through">
                        ${parseFloat(itemActual.priceOld).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddCart}
                    className="mt-4 px-3 py-3 border rounded-lg w-full font-semibold text-sm duration-150 text-white bg-green-600 hover:bg-green-500 active:bg-green-700"
                  >
                    <AddShoppingCartSharpIcon />
                    Add Cart
                  </button>
                </div>
                <ul className="p-4 space-y-3 sm:grid sm:grid-cols-2 md:block md:p-8 lg:grid text-center">
                  <div className="pb-2 col-span-2 text-gray-100 font-medium">
                    <p className="text-xl">Features</p>
                  </div>
                  {itemActual?.features?.map((featureItem, idx) => (
                    <li key={idx} className="flex items-center gap-5">
                      <VerifiedSharpIcon className="h-7 w-7 text-xl text-green-500 hover:text-gray-100 " />
                      {featureItem.name}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </LayoutEffect>
      </SectionWrapper>
      <section className="">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-xl mx-auto sm:text-center">
            <h3 className="text-gray-100 text-3xl font-semibold sm:text-4xl">
              Our Macros
            </h3>
          </div>
          <div className="mt-8">
            <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {plans.map((item, idx) => (
                <>
                {itemActual.id!==item.id &&(
                  <li key={idx}>
                  <div className="w-full h-60 sm:h-52 md:h-56">
                    <Link
                      href={`/excel-specialist/product/item/${item.id}?name=${item.name}&price=${item.price}&priceOld=${item.priceOld}`}
                    >
                      <img
                        src={`/images/Macros/${item.img}`}
                        className="w-full h-full object-cover object-center shadow-md rounded-xl"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="mt-4">
                    <a
                      className="text-lg text-gray-300 font-semibold"
                      href={`/excel-specialist/product/item/${item.id}?name=${item.name}&price=${item.price}&priceOld=${item.priceOld}`}
                    >
                      {item.name}
                    </a>
                    <p className="text-gray-400">{item.desc.slice(0, 80)}...</p>
                  </div>
                </li>
                )}
                </>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {id == 300 && <Categories />}
      <ModalProduct modal={modal} toggle={toggle} />
    </>
  );
};

export default Item;
