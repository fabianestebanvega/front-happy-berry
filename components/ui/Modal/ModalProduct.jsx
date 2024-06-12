import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { useUserContext } from "@/components/Context/UseContext";
import Link from "next/link";

const ModalProduct = ({ modal, toggle }) => {
  const { cart } = useUserContext();
  return (
    <Dialog.Root open={modal} onClose={toggle}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40 " />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4">
          <div className="bg-gray-900 text-gray-100 rounded-md  shadow-lg px-4 py-6">
            <div className=" flex items-center justify-center  w-12 h-12 mx-auto bg-green-700 rounded-full">
              <DownloadDoneIcon className="text-gray-100" />
            </div>
            <Dialog.Title className="text-lg font-medium text-white text-center mt-3">
              {" "}
              successfully added!
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm leading-relaxed text-center text-gray-500">
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <ul className="mt-12 divide-y">
                  <p className="text-gray-300">Products in the cart</p>
                  {cart.map((item, idx) => (
                    <li
                      key={idx}
                      className="py-5 flex items-start justify-between"
                    >
                      <div className="flex gap-3">
                        <img
                          src={`/images/Macros/${item.img}`}
                          className="flex-none w-12 h-12 rounded-full"
                        />
                        <div>
                          <span className="block text-sm text-white font-semibold">
                            {item.name}
                          </span>
                          <span className="block text-sm text-white">
                            Items: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <a
                        href="javascript:void(0)"
                        className="text-gray-700 text-sm rounded-lg px-3 py-2 duration-150 bg-white hover:bg-gray-100"
                      >
                        $ {parseFloat(item.price * item.quantity).toFixed(2)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Dialog.Description>

            <div className="items-center gap-2 mt-3 text-sm sm:flex">
              <Dialog.Close asChild>
                <button className="w-full mt-2 p-2.5 flex-1 text-white bg-green-600 rounded-md outline-none ring-offset-2 ring-green-600 focus:ring-2">
                  <Link href="/excel-specialist/cart">Go to my cart</Link>
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  onClick={toggle}
                  className="w-full mt-2 p-2.5 flex-1 text-white rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                  aria-label="Close"
                >
                  Keep buying
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ModalProduct;
