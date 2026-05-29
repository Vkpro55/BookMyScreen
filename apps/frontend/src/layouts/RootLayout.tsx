import { Outlet } from "react-router";
import Footer from "../components/shared/Footer";
import Header from "../components/shared/Header";

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
