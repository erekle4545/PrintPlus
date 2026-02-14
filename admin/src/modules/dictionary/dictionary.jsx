import React, { useEffect, useState, useContext, useMemo, useCallback, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Button,
    Box,
    TextField,
    Paper,
    Stack,
    InputAdornment,
} from "@mui/material";
import Swal from "sweetalert2";

import { Context } from "../../store/context/context";
import LangData from "../../language/langs/formLangData.json";
import useHttp from "../../store/hooks/http/useHttp";
import { Add, Search, Translate } from "@mui/icons-material";

export default function Dictionary() {
    const http = useHttp();
    const { state } = useContext(Context);

    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [languagesLookup, setLanguagesLookup] = useState({});
    const [loading, setLoading] = useState(false);

    const [selectedIds, setSelectedIds] = useState([]);

    // Pagination (server-side)
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 50,
    });

    // Date filter state
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");

    // Search state
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const searchTimerRef = useRef(null);

    const translate = useCallback(
        (key) =>
            LangData[key]?.[state.lang.code] ??
            LangData[key]?.[localStorage.getItem("lang")],
        [state.lang.code]
    );

    // Load languages
    const loadLanguages = useCallback(() => {
        http.get("languages").then((res) => {
            const obj = {};
            res.data.data.forEach((x) => {
                obj[x.id] = x.label;
            });
            setLanguagesLookup(obj);
        });
    }, []);

    // Load rows with server-side pagination & search
    const loadData = useCallback(() => {
        setLoading(true);

        const params = {
            page: paginationModel.page + 1, // Laravel is 1-based
            per_page: paginationModel.pageSize,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (date1) params.date_from = date1;
        if (date2) params.date_to = date2;

        http.get("dictionary", { params })
            .then((res) => {
                const data = res.data;
                const arr = (data.data || []).map((item) => ({
                    id: item.id,
                    word: item.word,
                    value: item.info?.value,
                    language_id: item.info?.language_id,
                    created_at: item.created_at
                        ? new Date(item.created_at).toLocaleDateString("ka-GE", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "",
                }));
                setRows(arr);
                setRowCount(data.total || 0);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [paginationModel, debouncedSearch, date1, date2]);

    useEffect(() => {
        loadLanguages();
    }, []);

    // Reload when pagination, search or dates change
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Debounced search
    const handleSearchChange = useCallback((e) => {
        const val = e.target.value;
        setSearchText(val);

        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            setDebouncedSearch(val.trim());
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }, 400);
    }, []);

    // CREATE
    const createRow = useCallback(async (row) => {
        try {
            const res = await http.post("dictionary", row);

            if (res.status === 208) {
                Swal.fire("ყურადღება", res.data.message || "ეს სიტყვა უკვე ნათარგმნია არჩეულ ენაზე", "warning");
                return;
            }

            loadData();
            Swal.fire("წარმატება", "ჩანაწერი დაემატა!", "success");
        } catch (e) {
            if (e?.response?.status === 208) {
                Swal.fire("ყურადღება", e.response.data.message || "ეს სიტყვა უკვე ნათარგმნია არჩეულ ენაზე", "warning");
                return;
            }
            Swal.fire("გაუქმებულია", "ვერ დაემატა!", "error");
        }
    }, [loadData]);

    // UPDATE
    const updateRow = useCallback(async (row) => {
        try {
            await http.put(`dictionary/update/${row.id}`, row);
            setRows((prev) => prev.map((x) => (x.id === row.id ? row : x)));
        } catch (e) {
            Swal.fire("შეცდომა", "ვერ განახლდა!", "error");
        }
    }, []);

    // DELETE
    const deleteRows = useCallback(async (ids) => {
        for (let id of ids) {
            try {
                await http.delete("dictionary/delete/" + id);
            } catch {
                // ignore per-id error
            }
        }
        setSelectedIds([]);
        loadData();
    }, [loadData]);

    // Columns
    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 80 },
            {
                field: "word",
                headerName: "Abbr",
                flex: 1,
                editable: true,
            },
            {
                field: "value",
                headerName: "Word",
                flex: 1,
                editable: true,
            },
            {
                field: "language_id",
                headerName: "Language",
                flex: 1,
                editable: true,
                type: "singleSelect",
                valueOptions: Object.entries(languagesLookup).map(
                    ([id, label]) => ({
                        value: Number(id),
                        label,
                    })
                ),
            },
            {
                field: "created_at",
                headerName: "Created",
                width: 170,
            },
            {
                field: "actions",
                headerName: "",
                width: 120,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <button
                        className="btn btn-sm btn-outline-primary rounded-3"
                        title="სხვა ენაზე თარგმნა"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTranslate(params.row);
                        }}
                    >
                        <Translate fontSize="small" />{" "}
                        <span style={{ fontSize: 12 }}>თარგმნა</span>
                    </button>
                ),
            },
        ],
        [languagesLookup]
    );

    // Handle create dialog
    const handleCreate = useCallback(() => {
        const langOptionsHtml = Object.entries(languagesLookup)
            .map(([id, label]) => `<option value="${id}">${label}</option>`)
            .join("");

        Swal.fire({
            title: "ახალი ჩანაწერი",
            html: `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <input id="w1" class="swal2-input" placeholder="Abbr (აბრევიატურა)">
                    <input id="w2" class="swal2-input" placeholder="Word (სიტყვა)">
                    <select id="lang" class="swal2-select">
                        ${langOptionsHtml}
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "შენახვა",
            cancelButtonText: "გაუქმება",
            preConfirm: () => {
                const word = document.getElementById("w1").value.trim();
                const value = document.getElementById("w2").value.trim();
                const lang = document.getElementById("lang").value;

                if (!word || !value || !lang) {
                    Swal.showValidationMessage("შეავსე ყველა ველი!");
                    return false;
                }

                return {
                    word,
                    value,
                    language_id: Number(lang),
                };
            },
        }).then((res) => {
            if (res.isConfirmed && res.value) {
                createRow(res.value);
            }
        });
    }, [languagesLookup, createRow]);

    // Handle translate
    const handleTranslate = useCallback(
        (row) => {
            http.get("dictionary/languages-for-word", { params: { word: row.word } })
                .then((res) => {
                    const existingLangIds = res.data || [];
                    const availableLangs = Object.entries(languagesLookup).filter(
                        ([id]) => !existingLangIds.includes(Number(id))
                    );

                    if (availableLangs.length === 0) {
                        Swal.fire("ინფორმაცია", "ეს აბრევიატურა უკვე ყველა ენაზეა ნათარგმნი!", "info");
                        return;
                    }

                    const langOptionsHtml = availableLangs
                        .map(([id, label]) => `<option value="${id}">${label}</option>`)
                        .join("");

                    Swal.fire({
                        title: `"${row.word}" - სხვა ენაზე თარგმნა`,
                        html: `
                            <div style="display:flex;flex-direction:column;gap:8px;">
                                <input id="w1" class="swal2-input" value="${row.word}" disabled
                                       style="background:#f0f0f0;color:#666;">
                                <input id="w2" class="swal2-input" placeholder="თარგმანი">
                                <select id="lang" class="swal2-select">
                                    ${langOptionsHtml}
                                </select>
                            </div>
                        `,
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "შენახვა",
                        cancelButtonText: "გაუქმება",
                        preConfirm: () => {
                            const value = document.getElementById("w2").value.trim();
                            const lang = document.getElementById("lang").value;

                            if (!value || !lang) {
                                Swal.showValidationMessage("შეავსე ყველა ველი!");
                                return false;
                            }

                            return {
                                id: row.id,
                                word: row.word,
                                value,
                                language_id: Number(lang),
                            };
                        },
                    }).then((res) => {
                        if (res.isConfirmed && res.value) {
                            createRow(res.value);
                        }
                    });
                })
                .catch(() => {
                    Swal.fire("შეცდომა", "ენების ჩატვირთვა ვერ მოხერხდა", "error");
                });
        },
        [languagesLookup, createRow]
    );

    // Handle delete selected
    const handleDeleteSelected = useCallback(() => {
        if (!selectedIds.length) return;

        Swal.fire({
            icon: "warning",
            title: "დარწმუნებული ხარ?",
            text: "მონიშნული ჩანაწერები წაიშლება!",
            showCancelButton: true,
            confirmButtonText: "დიახ, წაშლა",
            cancelButtonText: "გაუქმება",
        }).then((res) => {
            if (res.isConfirmed) deleteRows(selectedIds);
        });
    }, [selectedIds, deleteRows]);

    // Clear all filters
    const handleClearFilters = useCallback(() => {
        setDate1("");
        setDate2("");
        setSearchText("");
        setDebouncedSearch("");
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, []);

    return (
        <Box sx={{ width: "100%" }} className="card">
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <div className="d-flex justify-content-between gap-3 align-items-center">
                    <div>
                        <h2 className="title_font m-1">
                            {translate("dictionary_title") || "ლექსიკონი"}
                        </h2>
                    </div>
                    <div className="d-flex justify-content-between gap-3 align-items-center">
                        {selectedIds.length > 0 && (
                            <button
                                className="btn text_font btn-danger rounded-3"
                                onClick={handleDeleteSelected}
                            >
                                მონიშნულის წაშლა
                            </button>
                        )}
                        <button
                            className="btn text_font btn-light rounded-3"
                            onClick={handleCreate}
                        >
                            <Add />
                            დამატება
                        </button>
                    </div>
                </div>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    flexWrap="wrap"
                >
                    <TextField
                        size="small"
                        placeholder="ძებნა..."
                        value={searchText}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 200 }}
                    />
                    <TextField
                        type="date"
                        label="Begin"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={date1}
                        onChange={(e) => setDate1(e.target.value)}
                    />
                    <TextField
                        type="date"
                        label="End"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={date2}
                        onChange={(e) => setDate2(e.target.value)}
                    />
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={handleClearFilters}
                    >
                        გასუფთავება
                    </Button>
                    <Button variant="outlined" onClick={loadData}>
                        განახლება
                    </Button>
                </Stack>
            </Paper>

            <Box sx={{ height: 650, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={rowCount}
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[25, 50, 100]}
                    disableRowSelectionOnClick={false}
                    checkboxSelection
                    processRowUpdate={(newRow) => {
                        updateRow(newRow);
                        return newRow;
                    }}
                    loading={loading}
                    onRowSelectionModelChange={(ids) => {
                        setSelectedIds(ids);
                    }}
                    onProcessRowUpdateError={() =>
                        Swal.fire("შეცდომა", "ვერ განახლდა!", "error")
                    }
                    sx={{
                        borderRadius: 2,
                        boxShadow: 2,
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            fontWeight: 600,
                        },
                        "& .MuiDataGrid-row:nth-of-type(2n)": {
                            backgroundColor: "#fafafa",
                        },
                    }}
                />
            </Box>
        </Box>
    );
}