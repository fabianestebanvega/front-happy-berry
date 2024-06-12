import urlBackend from "../UrlBackend";

async function verificarEmail(email) {
  const result = await fetch(urlBackend + "user/email/"+email, {
    method: "GET",
  });
  return result;
}

async function verificarCodeApi(uuid,code) {
    const result = await fetch(urlBackend + "user/security/"+uuid+"/"+code, {
      method: "GET",
    });
    return result;
  }

export { verificarEmail,verificarCodeApi };
