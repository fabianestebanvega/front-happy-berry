import urlBackend from "../urlBackend";

async function apiListadoCategorias(){
    const result=await fetch(urlBackend+"categoria",{
        method:'GET',
       
    })
    return result;
}

export {apiListadoCategorias}
