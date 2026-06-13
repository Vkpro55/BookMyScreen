import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import SeatLayout from "./pages/SeatLayout";
import Checkout from "./pages/Checkout";
import { useLoadUser } from "./hooks/useLoader";
import FullScreenLoader from "./components/shared/FullScreenLoader";
// import PrivateLayout from "./layouts/PrivateLayout";

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootLayout />}>
      <Route index={true} element={<Home />} />
      <Route path="movies" element={<Movies />} />
      <Route
        path="movies/:state/:movieName/:id/ticket"
        element={<MovieDetails />}
      />
      {/* <Route element={<PrivateLayout />}> */}
      <Route path="profile/:id/" element={<Profile />} />
      <Route
        path="movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout"
        element={<SeatLayout />}
      />
      {/* </Route> */}
      <Route path="shows/:showId/:state/checkout" element={<Checkout />} />
    </Route>
  </>,
);

const router = createBrowserRouter(routes);

function App() {

  const { isLoading } = useLoadUser();

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
