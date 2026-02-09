// useGlobalRequestLang.js
import { useContext, useEffect } from "react";
import { Context } from "../../context/context";
import useHttp from "../http/useHttp";

const useGlobalRequestLang = () => {
    const { state, dispatch } = useContext(Context);
    const http = useHttp();

    useEffect(() => {
        if (!state.auth) return;

        dispatch({ type: "LOADING", payload: true });

        http.get("languages")
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "FORM_LANG", payload: response.data });

                    const defaultLang = response.data.data.find(
                        (item) => item.default === 1
                    );

                    if (defaultLang) {
                        dispatch({
                            type: "FORM_ACTIVE_LANG",
                            payload: {
                                activeLangId: defaultLang.id,
                                code: defaultLang.code,
                                label: defaultLang.label,
                            },
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err.response);
            })
            .finally(() => {
                dispatch({ type: "LOADING", payload: false });
            });
    }, [state.auth]);
};

export default useGlobalRequestLang;