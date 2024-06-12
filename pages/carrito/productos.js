import Head from "next/head";
import Cart from "@/View/Cliente/Carrito/Cart";
import Summary from "@/View/Cliente/Carrito/Summary";
import Checkout from "@/View/Cliente/Carrito/Checkout";
import Payment from "@/View/Cliente/Carrito/Payment";
export default function Contact() {


    return (
        <>
            <Head>
                <title>Carrito - Happy Berry</title>
            </Head>



            <main className="w-full py-14 bg-gray-300 min-h-screen">
            <Cart />
            <hr class="mt-3" />
            <br />
            <Summary/>
            <Checkout/>
            {/* <Pay/>
            <Success/> */}
            <Payment/>

            </main>
           



        </>
    );
}
