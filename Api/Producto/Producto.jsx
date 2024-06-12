import urlBackend from "../urlBackend";

async function apiListadoArticulos(){
    const result=await fetch(urlBackend+"producto",{
        method:'GET',
     
    })
    return result;
}

async function apiSaveArticulo(articulo) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"producto/save",
      {
        method: "POST",
        body:articulo,
        headers:{
            "Authorization":"Bearer "+token,
        }
      }
    );
    return result;
  }

  export {apiListadoArticulos ,apiSaveArticulo}