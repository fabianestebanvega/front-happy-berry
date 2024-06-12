import Head from "next/head"
import Footer from "./ui/Footer"
import Navbar from "./ui/Navbar"
import Banner from "./ui/Banner"
import { UserProvider } from "./Context/UseContext"
const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <title>Happy Berry</title>
                <meta name='description' content="Gain control of your business's growth with Mailgo's comprehensive marketing, automation, and email marketing platform." />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/images/happy/happy-berry-logo.jpeg' />
            </Head>
            <UserProvider>
            <Banner/>
            <Navbar />
            <main>{children}</main>
            </UserProvider>
            <Footer />
        </>
    )
}

export default Layout