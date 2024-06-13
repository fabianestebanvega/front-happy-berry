import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import NavHeader from "../NavHeader";
import NavLink from "../NavLink";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import ShopIcon from "@mui/icons-material/Shop";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Badge } from "@mui/material";
import { useUserContext } from "@/components/Context/UseContext";
import Image from "next/image";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import MenuIcon from '@mui/icons-material/Menu';
const Navbar = () => {
  const [state, setState] = useState(false);
  const menuBtnEl = useRef();
  const { cart ,usuario,modulo,setUsuario,setModulo} = useUserContext();
  const [items, setItems] = useState(0);
  const router = useRouter();

  const cerrarSesion = () => {
    localStorage.clear();
    setUsuario(null)
    setModulo(null)
    router.push("/login/iniciar-sesion");
  };
  useEffect(() => {
    let subItems = 0;
    cart?.map((item) => {
      subItems += item.cantidadLlevar;
    });

    setItems(subItems);
  }, [cart]);
  const navigation = [
    { name: "Inicio", href: "/", icon: <HomeIcon /> },

 
    {
      name: "Categorias",
      href: "/",
      icon: <FindInPageIcon />,
    },
    {
      name: "Productos",
      href: "/",
      icon: <ShopIcon />,
    },
    // {
    //   name: "Macros",
    //   href: "/excel-specialist#macros",
    //   icon: <FilePresentIcon />,
    // },

    // { name: "Testimonials", href: "/#testimonials",icon:<SpeakerNotesIcon/> },
    // { name: "FAQs", href: "/#faqs",icon:<ContactSupportIcon/> },
    // { name: "Contact", href: "/contact" ,icon:<ContactMailIcon/>},
  ];

  useEffect(() => {
    document.onclick = (e) => {
      const target = e.target;
      if (!menuBtnEl.current.contains(target)) setState(false);
    };
  }, []);

  return (
    <header className="relative">
      <div className="custom-screen md:hidden">
        <NavHeader
          menuBtnEl={menuBtnEl}
          state={state}
          onClick={() => setState(!state)}
        />
      </div>
      <nav
        className={`pb-5 md:text-sm md:static md:block bg-white  ${
          state
            ? " absolute z-20 top-0 inset-x-0 rounded-b-2xl shadow-xl "
            : "hidden"
        }`}
      >
        <div className="custom-screen items-center md:flex">
          <NavHeader state={state} onClick={() => setState(!state)} />
          <div
            className={`flex-1 items-center mt-8 text-gray-900 md:font-medium md:mt-0 md:flex ${
              state ? "block" : "hidden"
            } `}
          >
            <ul className="flex-1 justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
              {navigation.map((item, idx) => {
                return (
                  <li key={idx} className="hover:text-blue-700">
                    <Link
                      href={item.href}
                      className="block font-semibold text-lg"
                    >
                      {item.icon} <span className="mt-3">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
             {usuario !=null ? (
              <>
              <Link
              href={`/${modulo}/inicio`}
              className="block hover:text-blue-700 font-semibold text-lg"
            >
              <MenuIcon /> 
            </Link>
              <button
              onClick={cerrarSesion}
              className="block hover:text-red-700 font-semibold text-lg"
            >
              <AccountCircleIcon /> <span className="text-red-700">Salir</span>
            </button>
              </>
              

             ):(
              
              <Link
              href="/login/iniciar-sesion"
              className="block hover:text-blue-700 font-semibold text-lg"
            >
              <AccountCircleIcon /> Login
            </Link>
             )}
              <NavLink
                href="/carrito/productos"
                className="flex items-center  justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 active:bg-success-300 md:inline-flex"
              >
                <Badge badgeContent={items} color="success">
                  <ShoppingCartIcon />
                </Badge>
                <KeyboardArrowRightIcon />
              </NavLink>
              
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
