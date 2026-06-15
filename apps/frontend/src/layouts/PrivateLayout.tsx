import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import FullScreenLoader from "../components/shared/FullScreenLoader";

function PrivateLayout() {
  const { auth } = useAuth();

  if (auth === null) {
    return <FullScreenLoader />;
  }

  return auth ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateLayout;