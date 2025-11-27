import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../../../store/context/context";

// Routing
import { Link, useNavigate, useParams } from "react-router-dom";

// Hooks
import useHttp from "../../../store/hooks/http/useHttp";
import { useForm } from "react-hook-form";

// MUI v5
import {
    Box,
    Switch,
    CircularProgress,
    TextField
} from "@mui/material";

// Mix
import {
    checkTranslate,
    slugGenerate,
    translate
} from "../../../store/hooks/useMix";

import {
    deleteAlert,
    errorAlerts
} from "../../../store/hooks/global/useAlert";

import UseFormLang from "../../../store/hooks/global/useFormLang";
import UseFileManager from "../../../store/hooks/global/useFileManager";
import UseAddedBar from "../../../store/hooks/components/useAddedBar";
import UseButtonBar from "../../../store/hooks/global/useButtonBar";

import TipTapEditor from "../../../components/TipTapEditor/TipTapEditor.jsx";
import toast from "react-hot-toast";

const CreateTeam = () => {
    const http = useHttp();
    const params = useParams();
    const navigate = useNavigate();
    const { state } = useContext(Context);

    // Editor
    const editor = useRef(null);
    const [text, setText] = useState("");

    // Tabs
    const [tabs, setTabs] = useState({
        tab_1: true,
        tab_2: false
    });

    // Page states
    const [pageStatus, setPageStatus] = useState(true);
    const [pageErrors, setPageErrors] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);

    // File manager
    const [updatedCovers, setUpdatedCovers] = useState([]);
    const [coverTypes, setCoverTypes] = useState([]);
    const [teamQty, setTeamQty] = useState(0);

    const [loading, setLoading] = useState(false);

    // Form Hook
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors }
    } = useForm();

    const resets = () => {
        reset({
            title: "",
            slug: "",
            description: ""
        });
        setText("");
    };

    // Load config
    const getPageConfig = () => {
        http
            .get("options/team")
            .then((response) => {
                if (response.status === 200) {
                    setCoverTypes(response.data.data.coverTypes);
                    setTeamQty(response.data.data.team_count);
                }
            })
            .catch((err) => console.log(err.response));

        if (!params.id) resets();
    };

    // Load edit page
    const getEditData = () => {
        setLoading(true);

        http
            .get(`team/${params.id}`, {
                params: {
                    language_id: state.form_active_lang.activeLangId || null
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    const d = response.data.data;

                    setPageErrors(
                        d.info.language_id !==
                        state.form_active_lang.activeLangId
                    );

                    setValue("title", d.info.title);
                    setValue(
                        "created_at",
                        new Date(d.created_at).toISOString().substring(0, 10)
                    );
                    setValue("slug", d.info.slug);
                    setValue("description", d.info.description);
                    setText(d.info.text);

                    setPageStatus(d.status === 1);

                    setUpdatedCovers(d.info.covers);
                }
            })
            .catch((err) => console.log(err.response))
            .finally(() => setLoading(false));
    };

    // Create / Update
    const create = (data) => {
        const payload = {
            ...data,
            language_id: state.form_active_lang.activeLangId ?? 1,
            status: pageStatus ? 1 : 2,
            cover_id: Array.isArray(state.selected_covers)
                ? state.selected_covers.map((e) => e.id)
                : null,
            cover_type: Array.isArray(state.selected_covers)
                ? state.selected_covers.map((e) => e.coverType)
                : null,
            text,
            data: "0"
        };

        if (params.id) {
            // UPDATE
            http
                .post(`team/update/${params.id}`, payload)
                .then((response) => {
                    if (response.status === 200) {
                        setAddSuccess(true);
                        toast.success("Team Updated!");
                    }
                })
                .catch((err) => {
                    errorAlerts(
                        err.response.status,
                        err.response.statusText,
                        err.response.data.errors
                    );
                });
        } else {
            // CREATE
            http
                .post("team", payload)
                .then((response) => {
                    if (response.status === 200) {
                        setAddSuccess(true);
                        toast.success("Team Created!");
                        navigate(`/team/edit/${response.data.id}`);
                    }
                })
                .catch((err) => {
                    errorAlerts(
                        err.response.status,
                        err.response.statusText,
                        err.response.data.errors
                    );
                });
        }
    };

    // useEffect
    useEffect(() => {
        getPageConfig();
        if (params.id) getEditData();
    }, [addSuccess, state.form_active_lang, params.id]);

    return (
        <>
            <div className="col-md-12 col-xl-12 bg-w">
                <form className="row" onSubmit={handleSubmit(create)}>
                    <div className="col-md-9 col-xl-9">
                        <div className="card">
                            <div className="card-header lite-background">
                                <div className="row justify-content-between">
                                    <div className="col-md-4">
                                        <h5 className="card-title mb-0">
                                            <Box component="span">
                                                <img
                                                    width="20"
                                                    src={`https://flagcdn.com/w20/${
                                                        state.form_active_lang.code ===
                                                        "KA"
                                                            ? "ge"
                                                            : state.form_active_lang.code?.toLowerCase()
                                                    }.png`}
                                                />
                                            </Box>

                                            {params.id
                                                ? translate(
                                                    "editPage",
                                                    state.lang.code
                                                )
                                                : translate(
                                                    "addTeam",
                                                    state.lang.code
                                                )}
                                        </h5>
                                    </div>

                                    <div className="col-md-8 text-right">
                                        <ul className="nav lang">
                                            <UseFormLang
                                                leave={
                                                    params.id ||
                                                    localStorage.getItem(
                                                        "sureAlert"
                                                    ) === "1"
                                                        ? null
                                                        : true
                                                }
                                            />
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Translation Warning */}
                            {checkTranslate(
                                pageErrors,
                                params.id,
                                state.form_active_lang.label
                            )}

                            {/* TAB CONTENT */}
                            <div className="tab-pane" style={{ display: tabs.tab_1 ? "block" : "none" }}>
                                {loading && params.id ? (
                                    <div className="text-center p-5">
                                        <CircularProgress />
                                        <p>Loading Data...</p>
                                    </div>
                                ) : (
                                    <div className="card-body">
                                        <div className="row">
                                            {/* LEFT */}
                                            <div className="col-8">
                                                <div className="mb-3">
                                                    <label className="pb-2 font_form_title">
                                                        {translate("name", state.lang.code)}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control p-2"
                                                        onKeyUp={(e) =>
                                                            setValue(
                                                                "slug",
                                                                slugGenerate(e.target.value)
                                                            )
                                                        }
                                                        {...register("title", {
                                                            required: "სახელის შეყვანა აუცილებელია"
                                                        })}
                                                    />
                                                    {errors.title && (
                                                        <div className="form-error-messages-text">
                                                            {errors.title.message}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <label className="pb-2 font_form_title">
                                                        {translate("slug", state.lang.code)}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control p-2"
                                                        {...register("slug", {
                                                            required: "ბმულის მითითება აუცილებელია"
                                                        })}
                                                    />
                                                    {errors.slug && (
                                                        <div className="form-error-messages-text">
                                                            {errors.slug.message}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <label className="pb-2 font_form_title">
                                                        {translate("description", state.lang.code)}
                                                    </label>
                                                    <textarea
                                                        className="form-control p-2"
                                                        {...register("description")}
                                                    ></textarea>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="pb-2 font_form_title">
                                                        {translate("text", state.lang.code)}
                                                    </label>
                                                    <TipTapEditor
                                                        content={text}
                                                        onChange={setText}
                                                    />
                                                </div>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="col-4">
                                                <div className="mb-3">
                                                    <TextField
                                                        {...register("created_at", {
                                                            required: "თარიღი აუცილებელია"
                                                        })}
                                                        size="small"
                                                        type="date"
                                                        fullWidth
                                                        label="თარიღი"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    {errors.created_at && (
                                                        <div className="form-error-messages-text">
                                                            {errors.created_at.message}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="col-md-3 col-xl-3 my-left-side-toolbar">
                        <div className="card lite-background">
                            <div
                                className="card-header"
                                style={{ borderBottom: "1px dashed #a2a2a2" }}
                            >
                                <UseButtonBar />
                            </div>

                            <div
                                className="card-header"
                                style={{
                                    borderBottom: "1px dashed #a2a2a2",
                                    background: "#fff"
                                }}
                            >
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <div className="input-style-border-switch">
                                            <Switch
                                                id="toAction"
                                                checked={pageStatus}
                                                onChange={(e) =>
                                                    setPageStatus(e.target.checked)
                                                }
                                            />
                                            <label
                                                htmlFor="toAction"
                                                className="pb-2 font_form_title"
                                            >
                                                Status
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Manager */}
                        <div className="mb-3">
                            <UseFileManager
                                coverTypes={coverTypes}
                                updateData={updatedCovers}
                            />
                        </div>

                        <div className="card" style={{ background: "#f9f9f9" }}>
                            <UseAddedBar
                                name={"team"}
                                deleteUrl={"team/delete"}
                                getUrl={"team/side"}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateTeam;
