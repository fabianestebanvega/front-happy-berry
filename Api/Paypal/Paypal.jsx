import urlBackend from "../UrlBackend";

const payPaypal = async (order) => {
  const restul = await fetch(urlBackend + "pay", {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      "Content-type": "application/json",
    },
  });
  return restul;
};


const findByIdPayment = async (pay) => {
    
    const restul = await fetch(urlBackend + "paypal/pay", {
      method: "POST",
      body:JSON.stringify(pay),
      headers: {
        "Content-type": "application/json"
      },
     
    });
    return restul;
  };


  const listaItems = async (id) => {
    const restul = await fetch(urlBackend + "lista/"+id+"/items", {
      method: "GET",
    });
    return restul;
  };

  
export {payPaypal,findByIdPayment,listaItems}
