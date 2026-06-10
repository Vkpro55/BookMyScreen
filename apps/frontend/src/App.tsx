import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import { RouterProvider } from "react-router/dom";

import "./App.css";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import SeatLayout from "./pages/SeatLayout";

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootLayout />}>
      <Route index={true} element={<Home />} />
      <Route path="movies" element={<Movies />} />
      <Route path="movies/:state/:movieName/:id/ticket" element={<MovieDetails />} />
      <Route path="profile" element={<Profile />} />
      <Route path="movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout" element={<SeatLayout />} />
    </Route>
  </>,
);

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
