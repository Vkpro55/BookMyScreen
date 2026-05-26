import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import { RouterProvider } from "react-router/dom";

import "./App.css";
import RootLayout from "./layouts/RootLayout";

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootLayout />} >
      <Route index={true} element=<div>HomePage</div> />
    </Route>
  </>
);

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
