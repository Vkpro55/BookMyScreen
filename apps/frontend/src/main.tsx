import { createRoot } from "react-dom/client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./index.css";
import App from "./App.tsx";
import { LocationProvider } from "./context/LocationContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";
import { SeatContextProvider } from "./context/SeatContext.tsx";
import { SockerProvider } from "./context/SocketContext.tsx";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
    },
  },
});

createRoot(rootEl).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LocationProvider>
        <SeatContextProvider>
          <SockerProvider>
            <App />
          </SockerProvider>
        </SeatContextProvider>
      </LocationProvider>
    </AuthProvider>
  </QueryClientProvider>
);
