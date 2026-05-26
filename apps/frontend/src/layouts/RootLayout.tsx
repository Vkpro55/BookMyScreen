import { Outlet } from "react-router"
import Footer from "../components/shared/Footer"
import Header from "../components/shared/Header"

function RootLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default RootLayout
