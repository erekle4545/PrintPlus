// useAuth.js
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/context";
import useHttp from "./useHttp";

const useAuth = () => {
    const http = useHttp();
    const { dispatch } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            dispatch({ type: "AUTH", payload: false });
            navigate("/login");
            return;
        }

        http.get("user")
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "ACCESS_TOKEN", payload: token });
                    dispatch({ type: "AUTH", payload: true });
                } else {
                    throw new Error("Unexpected status");
                }
            })
            .catch((err) => {
                dispatch({ type: "AUTH", payload: false });
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useAuth;