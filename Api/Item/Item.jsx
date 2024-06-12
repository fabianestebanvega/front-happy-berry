import urlBackend from "../UrlBackend";

async function downloadItemKey(key){
    const result=await fetch(urlBackend+"item/download?key="+key,{
        method:'GET',
       
    })
    return result;
}
export {downloadItemKey}