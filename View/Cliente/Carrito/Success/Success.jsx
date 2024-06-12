import { downloadItemKey } from "@/Api/Item/Item";
import { listaItems, payPaypalConfirmar } from "@/Api/Paypal/Paypal";
import { useUserContext } from "@/components/Context/UseContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DownloadForOfflineSharpIcon from "@mui/icons-material/DownloadForOfflineSharp";
import { downloadPdfPayer, sendMailPayer } from "@/Api/Paypal/Mail";
import { convertirFormatoFecha } from "@/Util/DateFormat";

import EmailSharpIcon from "@mui/icons-material/EmailSharp";
import PhoneAndroidSharpIcon from "@mui/icons-material/PhoneAndroidSharp";
import RoomSharpIcon from "@mui/icons-material/RoomSharp";
import SecuritySharpIcon from "@mui/icons-material/SecuritySharp";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import PaymentSharpIcon from "@mui/icons-material/PaymentSharp";
import Link from "next/link";
const Success = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Context
  const { cart, setCart, setStep, steps, payer, setPayer } = useUserContext();
  const [fechaPayer, setFechaPayer] = useState("");
  const [mail, setMail] = useState(false);
  
  useEffect(() => {
    
   
    if (payer.state==="COMPLETED") {
      const fechaFormateada = convertirFormatoFecha(payer?.fecha);
      setFechaPayer(fechaFormateada);
      
      //setLoading(true);
      setStep((prevSteps) => ({
        ...prevSteps,
        currentStep: 5,
      }));

      setMail(payer?.sendEmail);
       
      
    }

    // Puedes realizar lógica adicional aquí, como enviar los valores a un servidor, etc.
  }, [payer]); // Asegúrate de que la función se ejecute cuando cambien los valores en la URL

  const downloadPayerPDF = () => {
    setLoading(true);
    downloadPdfPayer(payer?.id)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bill-excel-specilitllc.pdf";
        document.body.appendChild(a);
        a.click();
      })
      .catch((e) => {
        console.log(e);
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  

  const downloadItem = async (item) => {
    try {
      setLoading(true);
      const response = await downloadItemKey(item.id);

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.planId.name + "item.zip";
        document.body.appendChild(a);
        a.click();
        setLoading(false);
        // Actualiza la propiedad 'payer' después de la descarga
        setPayer({
          ...payer,
          downloadCount: (payer.downloadCount || 0) + 1,
        });
      } else {
        setLoading(false);
        console.log("error buscando imagen");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {steps.currentStep > 4 && (
        <>
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="items-start justify-between md:flex">
              {loading && (
                <div className="overlay">
                  <div className="spinner " aria-hidden="true"></div>
                </div>
              )}
            </div>
            <h1 className="mt-3 text-gray-200  text-center text-2xl font-extrabold">
            PURCHASE SUCCESSFUL
            </h1>
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 mb-4 lg:pr-4">
                <h3 className="mt-6 text-gray-300 text-xl font-extrabold ">Contac Information</h3>
                <ul className="mt-4 flex flex-wrap gap-x-12 gap-y-6 items-center lg:gap-x-24">
                <li key={"Address"}>
                    <h4 className="text-gray-100 font-medium">Name's</h4>
                    <div className="mt-3 flex items-center gap-x-3">
                      <div className="flex-none text-gray-400">
                        <RoomSharpIcon className="text-green-800" />
                      </div>
                      <p className="text-white">
                        {payer?.order?.usuarioId?.firstName} {payer?.order?.usuarioId?.lastName}
                      </p>
                    </div>
                  </li>
                  <li key={"Email"}>
                    <h4 className="text-gray-100  font-medium">Email</h4>
                    <div className="mt-3 flex items-center gap-x-3">
                      <div className="flex-none text-gray-400">
                        <EmailSharpIcon className="text-green-800" />
                      </div>
                      <p className="text-white">{payer?.order?.usuarioId?.email}</p>
                    </div>
                  </li>
                  <li key={"Phone"}>
                    <h4 className="text-gray-100  font-medium">Phone</h4>
                    <div className="mt-3 flex items-center gap-x-3">
                      <div className="flex-none text-gray-400">
                        <PhoneAndroidSharpIcon className="text-green-800" />
                      </div>
                      <p className="text-white">{payer?.order?.usuarioId?.phone}</p>
                    </div>
                  </li>
                  
                </ul>
              </div>

              <div className="w-full lg:w-1/2 mb-4 lg:pr-4">
                <h3 className="mt-6 text-gray-300 text-xl font-extrabold ">Payment Information</h3>
                <ul className="mt-4 flex flex-wrap gap-x-12 gap-y-6 items-center lg:gap-x-24">
                  {/* <li key={"State"}>
                    <h4 className="text-gray-100 font-medium">Status</h4>
                    <div className="mt-3 flex items-center gap-x-3">
                      <div className="flex-none text-gray-400">
                        <CheckCircleOutlineSharpIcon className="text-green-800" />
                      </div>
                      <p className="text-white">{payer?.state}</p>
                    </div>
                  </li> */}
                  <li key={"Address"}>
                    <h4 className="text-gray-100  font-medium">PCI-DSS</h4>
                    <div className="mt-3 flex items-center gap-x-3">
                      <div className="flex-none text-gray-400">
                        <SecuritySharpIcon className="text-green-800" />
                      </div>
                      <p className="text-white">{payer?.paymentId}</p>
                    </div>
                  </li>
                
                  <li key={"Download"}>
                    <h4 className="text-gray-100  font-medium">Invoice</h4>
                    <div
                      className="mt-3 flex items-center gap-x-3 hover:bg-green-700"
                      title="Download"
                      
                    >
                      <div className="flex-none text-gray-400">
                        <DownloadForOfflineSharpIcon className="text-green-800" />
                      </div>

                      <button onClick={() => downloadPayerPDF(payer?.id)} className="text-white">Download PDF </button>
                    </div>
                  </li>
                  <li key={"Method"}>
                    <h4 className="text-gray-100  font-medium">Payment Method</h4>
                    <div className="mt-3 flex items-center gap-x-3">
                      <div className="flex-none text-gray-400">
                        <PaymentSharpIcon className="text-green-800" />
                      </div>
                      <p className="text-white">{payer?.order?.method}</p>
                    </div>
                  </li>
                  
                </ul>
              </div>
            </div>
            <h3 className="mt-3 text-gray-300 text-xl font-extrabold">
              Purchased Products
            </h3>
            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
              <table className="w-full table-auto text-sm text-center">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="py-3 px-6">Item</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6">Quantity</th>
                    <th className="py-3 px-6">Sub Total</th>

                    <th className="py-3 px-6"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y">
                  {payer?.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="flex items-center gap-x-3 py-3 px-6 whitespace-nowrap">
                        <img
                          src={`/images/Macros/${item.planId.img}`}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <span className="block text-gray-100 text-sm font-medium">
                            {item.planId.name}
                          </span>
                          <span className="block text-gray-500 text-xs">
                            US2024EJK{idx}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                        $ {parseFloat(item.price).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                        {item.quantity}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                        $ {parseFloat(item?.price * item?.quantity).toFixed(2)}
                      </td>
                      <td className="text-right px-6 whitespace-nowrap">
                        {item?.download < item?.quantity ? (
                          <button
                            onClick={() => downloadItem(item)}
                            type="button"
                            className="py-2 px-3 font-medium text-green-600 hover:text-green-600 duration-150 hover:bg-gray-50 rounded-lg"
                          >
                            <DownloadForOfflineSharpIcon /> Download{" "}
                            <small>({item?.download}) </small>
                          </button>
                        ) : (
                          <p>Limit {item?.quantity} download</p>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="flex items-center gap-x-3 py-3 px-6 whitespace-nowrap">
                      <div>
                        <span className="block text-gray-100 text-sm font-medium"></span>
                        <span className="block text-gray-500 text-xs"></span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100"></td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                      <h3>TOTAL</h3>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                      $ {parseFloat(payer?.order?.total).toFixed(2)} USD
                    </td>
                    <td className="text-right px-6 whitespace-nowrap"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <section className="py-14">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
              <div className="max-w-lg flex justify-between items-center">
                {/* <h3 className="mt-3 text-gray-300 text-xl font-extrabold">
                  TRANSACTION
                </h3> */}
                <button>
                  {/* <h3 type="button"
                title="download proof of payment"
                 className="mt-3 text-gray-300 text-xl font-extrabold hover:text-green-600 duration-150 hover:bg-gray-50 " onClick={downloadPayerPDF}>
                  <DownloadForOfflineSharpIcon /> PDF </h3> */}
                </button>
              </div>

              {/* <div className="mt-1 divide-y sm:mt-20">
                {faqsList.map((list, idx) => (
                  <div key={idx} className="py-5 gap-x-12 first:pt-0 sm:flex">
                    <div className="max-w-sm pt-8 pb-6 sm:pt-0 lg:flex-grow">
                      <h4 className="text-gray-100 font-bold">{list.label}</h4>
                    </div>
                    <ul className="flex-1 space-y-6 sm:last:pb-6 sm:space-y-8">
                      {list.qas.map((item, idx) => (
                        <li key={idx}>
                          <summary className="flex items-center justify-between font-semibold text-gray-100">
                            {item.q}
                          </summary>
                          <p
                            dangerouslySetInnerHTML={{ __html: item.a }}
                            className="mt-3 text-gray-200 leading-relaxed"
                          ></p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div> */}
              <h3 className="mt-3 text-gray-300  text-xl font-extrabold">
                Customer
              </h3>
              <div className="text-white">
                <p className="mt-3">
                  {" "}
                  - The registered email {payer?.order?.usuarioId.email} sent a
                  summary of the purchase with the digital invoice
                </p>
              </div>

              <div className="text-white">
                <p className="mt-3">
                  {" "}
                  - If you have questions or have any problems with the
                  information you register,{" "}
                  <Link
                    href="/excel-specialist/contact"
                    target="_blank"
                    className="text-blue-600"
                  >
                    contact support
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Success;
