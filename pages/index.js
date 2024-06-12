import Head from "next/head";
import ProductosGrid from "@/View/Cliente/ProductosGrid";
export default function Contact() {


    return (
        <>
            <Head>
                <title>Happy Berry</title>
            </Head>



            <main className="py-14 bg-gray-300 min-h-screen">
                <ProductosGrid />

            </main>



        </>
    );
}
