import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import urlBackend from "@/Api/UrlBackend";
import { useUserContext } from "@/components/Context/UseContext";
import { sendMailPayer } from "@/Api/Paypal/Mail";

// Renders errors or successfull transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}

function PayPal({ orderDto }) {
  //Sppiner
  const [loading, setLoading] = useState(false);
  const { setStep, steps, payer, setPayer } = useUserContext();

  const [ordenData, setOrdenData] = useState(null); // Data returned by the server for creating
  //AZIYAH7c4NmKL0l8DRsl_UsMjXS9MsGDFgPQpK-vm9RBk9pCNtSIssAloJnhXxS7fmPjidBOuk0QZlY3
  const initialOptions = {
    "client-id":
      "AZIYAH7c4NmKL0l8DRsl_UsMjXS9MsGDFgPQpK-vm9RBk9pCNtSIssAloJnhXxS7fmPjidBOuk0QZlY3",
    "enable-funding": "venmo,card",
    "disable-funding": "paylater",
    "data-sdk-integration-source": "integrationbuilder_sc",
    locale: "en_US",
  };

  const [message, setMessage] = useState("");
  const cart = [
    {
      intent: "CAPTURE",
      value: orderDto?.total,
    },
  ];
  return (
    <div className="App">
      {loading && (
        <div className="overlay">
          <div className="spinner " aria-hidden="true"></div>
        </div>
      )}
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}
          createOrder={async () => {
            try {
              setLoading(true);
              const response = await fetch(urlBackend + "api/orders", {
                method: "POST",
                body: JSON.stringify(cart),
                headers: {
                  "Content-type": "application/json",
                },
              });

              const orderData = await response.json();
              
              setOrdenData(orderData);
              if (orderData.id) {
                setLoading(false);
                return orderData.id;
              } else {
                setLoading(false);
                console.error("error");
              }
            } catch (error) {
              setLoading(false);
              console.error(error);
              setMessage(`Could not initiate PayPal Checkout...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(
                `${urlBackend}api/orders/${data.orderID}/capture`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(orderDto),
                }
              );

              const orderData = await response.json();
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you message
              
              if (orderData.success) {
                setPayer(orderData.data);
                setLoading(true);
                sendMailPayer(orderData.data?.id)
                  .then((res) => res.json())
                  .then((data) => {
                    setPayer((prevData) => ({
                      ...prevData,
                      ["sendEmail"]: data.data,
                    }));
                  })
                  .catch((e) => {
                    console.log(e);
                  });
                setTimeout(() => {
                  setStep((prevSteps) => ({
                    ...prevSteps,
                    currentStep: 5,
                  }));
                  setLoading(false);
                }, 500);
              } else {
                alert("Error con el pago");
              }
              // if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              //   // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
              //   return actions.restart();
              // } else if (errorDetail) {
              //   // (2) Other non-recoverable errors -> Show a failure message
              //   throw new Error(
              //     `${errorDetail.description} (${orderData.debug_id})`,
              //   );
              // } else {
              //   // (3) Successful transaction -> Show confirmation or thank you message
              //   // Or go to another URL:  actions.redirect('thank_you.html');
              //   const transaction =
              //     orderData.purchase_units[0].payments.captures[0];
              //   setMessage(
              //     `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`,
              //   );
              //   console.log(
              //     "Capture result",
              //     orderData,
              //     JSON.stringify(orderData, null, 2),
              //   );
              // }
            } catch (error) {
              console.error(error);
              setMessage(
                `Sorry, your transaction could not be processed...${error}`
              );
            }
          }}
        />
      </PayPalScriptProvider>
      {/* <Message content={message} /> */}
    </div>
  );
}

export default PayPal;
