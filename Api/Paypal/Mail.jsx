import urlBackend from "../UrlBackend";


async function sendMailPayer(id){
    const restul=await fetch(urlBackend+"mail/new/"+id,{
        method:'GET'
    })
    return restul;
}


async function downloadPdfPayer(id){

    const result=await fetch(urlBackend+"mail/pdf/payer/"+id,{
        method:'GET',
        
    })
    return result

}

export {sendMailPayer,downloadPdfPayer}
