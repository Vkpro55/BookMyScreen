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

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootLayout />}>
      <Route index={true} element={<Home />} />
      <Route path="movies" element={<Movies />} />
    </Route>
  </>,
);

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
