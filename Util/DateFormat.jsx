const convertirFormatoFecha = (fechaString) => {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const fecha = new Date(fechaString);
  const fechaFormateada = fecha.toLocaleDateString("en-US", options);
  return fechaFormateada;
};

export { convertirFormatoFecha };
