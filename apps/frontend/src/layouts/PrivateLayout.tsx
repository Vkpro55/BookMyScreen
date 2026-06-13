import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

function PrivateLayout() {
    const { auth } = useAuth();
    return auth ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateLayout