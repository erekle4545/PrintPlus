import React, { useEffect, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../../store/context/context";
import { useLocation, useNavigate } from "react-router-dom";
import useHttp from "../../store/hooks/http/useHttp";
import LangData from "../../language/langs/loginLang.json";
import toast from "react-hot-toast";

const Login = () => {
    const http = useHttp();
    const { state, dispatch } = useContext(Context);

    const [loginState, setLoginState] = useState({});
    const [loginErrors, setLoginErrors] = useState({
        email: null,
        password: null,
        message: null
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const location = useLocation();

    const translate = (key) => {
        return (
            LangData[key]?.[state.lang.code] ??
            LangData[key]?.[localStorage.getItem("lang")]
        );
    };

    // ---------------------------
    // LOGIN → API
    // ---------------------------
    const checkAuth = (data) => {
        http.post("login", data)
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "AUTH", payload: true });
                    dispatch({ type: "USER", payload: response.data.user });

                    toast.success(translate("authorizationSuccessfully"));

                    localStorage.setItem("token", response.data.token);
                    dispatch({ type: "ACCESS_TOKEN", payload: response.data.token });

                    navigate("/dashboard");
                } else {
                    toast.error(translate("authorizationFailed"));
                    setLoginState({
                        text: translate("emailOrPasswordIsIncorrect")
                    });
                }
            })
            .catch((err) => {
                const res = err.response?.data || {};
                setLoginErrors({
                    email: res.errors?.email || null,
                    password: res.errors?.password || null,
                    message: res.message || res.error || null
                });
            });
    };

    // ---------------------------
    // LOAD EFFECTS
    // ---------------------------
    useEffect(() => {
        if (!localStorage.getItem("lang")) {
            localStorage.setItem("lang", "GE");
            window.location.reload();
        }

        if (location.pathname === "/login" && state.auth === true) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <main className="main h-100 w-100">
            <div className="container h-100">
                <div className="row h-100 mt-5">
                    <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">

                            <div className="text-center mt-4"></div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="m-sm-4">
                                        <div className="text-center">
                                            <h1 className="h2 title_font">ავტორიზაცია</h1>

                                            {loginErrors.message && (
                                                <p style={{ color: "red" }}>{loginErrors.message}</p>
                                            )}
                                        </div>

                                        {loginState.text && (
                                            <small>
                                                <p style={{ color: "red" }}>{loginState.text}</p>
                                            </small>
                                        )}

                                        {/* FORM */}
                                        <form onSubmit={handleSubmit(checkAuth)}>
                                            {/* EMAIL */}
                                            <div className="mb-3 title_font">
                                                <label>{translate("email")}</label>
                                                <input
                                                    className="form-control form-control-lg text_font"
                                                    type="email"
                                                    placeholder={translate("enterEmail")}
                                                    {...register("email", {
                                                        required: translate("emailIsRequired"),
                                                        pattern: /^\S+@\S+$/i
                                                    })}
                                                />

                                                <small>
                                                    {errors.email && (
                                                        <p style={{ color: "red" }}>
                                                            {translate("pleaseEnterAnEmail")}
                                                        </p>
                                                    )}

                                                    {loginErrors.email && (
                                                        <p style={{ color: "red" }}>
                                                            {translate("emailCouldNotBeFound")}
                                                        </p>
                                                    )}
                                                </small>
                                            </div>

                                            {/* PASSWORD */}
                                            <div className="mb-3 title_font">
                                                <label>{translate("password")}</label>

                                                <input
                                                    className="form-control form-control-lg text_font"
                                                    type="password"
                                                    placeholder={translate("enterPassword")}
                                                    {...register("password", {
                                                        required: translate("passwordIsRequired"),
                                                        minLength: {
                                                            value: 8,
                                                            message: translate("passwordMust")
                                                        }
                                                    })}
                                                />

                                                <small>
                                                    {errors.password && (
                                                        <p style={{ color: "red" }}>
                                                            {errors.password.message}
                                                        </p>
                                                    )}

                                                    {loginErrors.password && (
                                                        <p style={{ color: "red" }}>
                                                            {translate("notMatch")}
                                                        </p>
                                                    )}
                                                </small>
                                            </div>

                                            {/* REMEMBER ME */}
                                            <div>
                                                <div className="form-check align-items-center">
                                                    <input
                                                        id="customControlInline"
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        {...register("remember", { value: 1 })}
                                                    />
                                                    <label
                                                        className="form-check-label text-small text_font"
                                                        htmlFor="customControlInline"
                                                    >
                                                        {translate("rememberPassword")}
                                                    </label>
                                                </div>
                                            </div>

                                            {/* SUBMIT */}
                                            <div className="text-center mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-lg btn-dark title_font"
                                                >
                                                    {translate("login")}
                                                </button>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
