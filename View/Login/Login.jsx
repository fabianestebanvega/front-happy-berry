import { apiIniciarSesion } from "@/Api/Inicio/Login";
import { CircularProgress, Grid, Button, TextField, Typography, Box } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      email,
      password,
    };
    apiIniciarSesion(data)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          let token = data.data;
          localStorage.setItem("token", token);
          const usuario = JSON.parse(JSON.stringify(parseJwt(token)));
          const rol = usuario?.roles[0]?.nombre?.split("_")[1].toLowerCase();
          localStorage.setItem("data", JSON.stringify(usuario));
          localStorage.setItem("modulo", rol);
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
        setErrorMessage(e.mensaje);
      })
      .finally(() => {
        setIsLoading(false);
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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="gray.100">
      <Grid container component="main" maxWidth="md" bgcolor="white" boxShadow={3} borderRadius={2} overflow="hidden">
        <Grid item xs={12} md={6} display={{ xs: 'none', md: 'block' }}>
          <img
            src="/images/happy/happy-berry.jpeg"
            alt="Login"
             className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          />
        </Grid>
        <Grid item xs={12} md={6} p={4} display="flex" flexDirection="column" justifyContent="center">
          <Typography component="h1" variant="h5" textAlign="center">
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleLogin} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Button href="#" variant="text" color="primary">
                  ¿Olvidaste tu contraseña?
                </Button>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
              </Button>
            </Box>
            {errorMessage && (
              <Box mt={2}>
                <Typography variant="body2" color="error" align="center">
                  {errorMessage}
                </Typography>
              </Box>
            )}
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
