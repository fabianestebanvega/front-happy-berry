import Head from "next/head";
import Login from "@/View/Login/Login";
import ProductoView from "@/View/Cliente/Producto/ProductoView";

export default function cart() {
    return (
        <>
            <Head>
                <title>Producto - Happy Berry</title>
            </Head>

            
           <ProductoView/>
            

        </>
    );
}
