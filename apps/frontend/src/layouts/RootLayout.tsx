import { Outlet, useMatch } from "react-router";
import Footer from "../components/shared/Footer";
import Header from "../components/shared/Header";

function RootLayout() {
  const isSeatLayoutPage = useMatch('movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout');

  return (
    <div className="flex flex-col min-h-screen">
      {!isSeatLayoutPage && <Header />}
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      {!isSeatLayoutPage && <Footer />}
    </div>
  );
}

export default RootLayout;
