const Payment = () => {
  return (
    <div className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="mt-6">
          <ul className="flex gap-x-10 gap-y-6 flex-wrap items-center justify-center md:gap-x-16">
            {/* LOGO 1 */}
            <li>
              <img src="/images/Payment/paypal.svg" width="173" alt="" />
            </li>

            {/* LOGO 2 */}
            <li>
              <img src="/images/Payment/visa.svg" width="119" alt="" />
            </li>

            {/* LOGO 3 */}
            <li>
              <img src="/images/Payment/mastercard.png" width="115" alt="" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Payment;
