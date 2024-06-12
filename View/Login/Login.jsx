import { apiIniciarSesion } from "@/Api/Inicio/Login";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true)
    //setloading(true)
    const data = {
      email,
      password,
    };
    apiIniciarSesion(data)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          // let modulo = localStorage.getItem("modulo")
          let token = data.data;
          localStorage.setItem("token", token);
          const usuario = JSON.parse(JSON.stringify(parseJwt(token)));
          const rol = usuario?.roles[0]?.nombre?.split("_")[1].toLowerCase();
          localStorage.setItem("data", JSON.stringify(usuario));
          localStorage.setItem("modulo", rol);
          console.log(usuario);
          console.log(rol);
          window.location.href = "/" + rol + "/inicio";
        } else {
          let msg = data?.mensaje;
          if (msg === "Bad credentials") {
            msg = "Contraseña Incorrecta";
          }

          setErrorMessage(msg);
        }
      })
      .catch((e) => {
        console.log(e);
        setErrorMessage(e.mensaje);
      })
      .finally((f) => {
        // setloading(false)
        setIsLoading(false)
      });
  };

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
    <div className="p-5 flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
        <div className="md:w-1/2 w-full">
          <img
            src="/images/happy/happy-berry.jpeg"
            alt="Login"
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          />
        </div>
        <div className="md:w-1/2 w-full p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Iniciar Sesión
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* <input
                  type="checkbox"
                  id="remember_me"
                  name="remember_me"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Recuérdame
                </label> */}
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isLoading}
            >
                 {isLoading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
                
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
