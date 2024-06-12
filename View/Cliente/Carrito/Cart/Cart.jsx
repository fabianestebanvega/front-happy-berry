import { useUserContext } from "@/components/Context/UseContext";
import { Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckIcon from "@mui/icons-material/Check";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useRouter } from "next/router";
import { findByIdPayment } from "@/Api/Paypal/Paypal";
const Cart = () => {
  //Sppiner
  const [loading, setLoading] = useState(false);
  const { cart, steps, setStep, setPayer, payer } = useUserContext();
  const router = useRouter();
  useEffect(() => {
    const { success, paymentId } = router.query;
    if (success) {
      setLoading(true)
      const payment = {
        paymentId,
      };
      findByIdPayment(payment)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPayer(data.data);
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(final=>{
          setLoading(false)
        })
        

      setStep((prevSteps) => ({
        ...prevSteps,
        currentStep: 5,
      }));
    } else {
      setTimeout(() => {
        if (cart.length === 0) {
          setStep((prevSteps) => ({
            ...prevSteps,
            currentStep: 1,
          }));
        } else {
          setStep((prevSteps) => ({
            ...prevSteps,
            currentStep: 2,
          }));
        }
      }, 50);
    }
  }, [cart, router.query]);

  return (
    <>
      <h1 class="mb-10 text-center text-gray-900 text-2xl font-bold">
        {steps.stepsItems[steps.currentStep - 1]}
      </h1>
      {loading && (
        <div className="overlay">
          <div className="spinner " aria-hidden="true"></div>
        </div>
      )}
      <div className="max-w-2xl mx-auto px-4 md:px-0 ">
        <Stepper alternativeLabel activeStep={1}>
          {steps.stepsItems.map((label, idx) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={() => (
                  <>
                    {steps.currentStep > idx + 1 ? (
                      <TaskAltIcon />
                    ) : null || steps.currentStep === idx + 1 ? (
                      <RadioButtonCheckedIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </>
                )}
                className={`text-2xl font-bold ${
                  steps.currentStep > idx + 1
                    ? "text-green-600 border-green-600"
                    : "" || steps.currentStep == idx + 1
                    ? "border-green-600 text-gray-500 "
                    : "text-gray-400"
                }`}
              >
                <h3
                  className={` ${
                    steps.currentStep > idx + 1
                      ? "text-green-600 border-green-600 font-bold"
                      : "" || steps.currentStep == idx + 1
                      ? "border-green-600 text-gray-500 font-bold"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </h3>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </>
  );
};
export default Cart;

