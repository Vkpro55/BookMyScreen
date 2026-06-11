import { Outlet, useMatch } from "react-router";
import Footer from "../components/shared/Footer";
import Header from "../components/shared/Header";

function RootLayout() {
  const isSeatLayoutPage = useMatch('movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout');
  const isCheckoutPage = useMatch('shows/:showId/:state/checkout');

  return (
    <div className="flex flex-col min-h-screen">
      {!isSeatLayoutPage && !isCheckoutPage && <Header />}
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      {!isSeatLayoutPage && !isCheckoutPage && < Footer />}
    </div>
  );
}

export default RootLayout;
