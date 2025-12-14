import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Context } from "../../store/context/context";

const ProtectedRoute = () => {
    const { state } = useContext(Context);
    const location = useLocation();
    const token = localStorage.getItem('token');



    const isAuthenticated = token && state.auth;

    // Not authenticated → go to /login
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Authenticated → render nested routes
    return <Outlet />;
};

export default ProtectedRoute;
