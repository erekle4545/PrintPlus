import React, { useEffect, useState, useContext, useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
    Button,
    Box,
    TextField,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import Swal from "sweetalert2";

import { Context } from "../../store/context/context";
import LangData from "../../language/langs/formLangData.json";
import useHttp from "../../store/hooks/http/useHttp";
import {Add, AddBox, AddIcCall} from "@mui/icons-material";

export default function Dictionary() {
    const http = useHttp();
    const { state } = useContext(Context);

    const [rows, setRows] = useState([]);
    const [languagesLookup, setLanguagesLookup] = useState({});
    const [loading, setLoading] = useState(false);

    // selected rows
    const [selectedIds, setSelectedIds] = useState([]);

    // Date filter state
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");

    const translate = (key) =>
        LangData[key]?.[state.lang.code] ??
        LangData[key]?.[localStorage.getItem("lang")];

    // Load languages
    const loadLanguages = () => {
        http.get("languages").then((res) => {
            const obj = {};
            res.data.data.forEach((x) => {
                obj[x.id] = x.label;
            });
            setLanguagesLookup(obj);
        });
    };

    // Load rows
    const loadData = () => {
        setLoading(true);
        http.get("dictionary").then((res) => {
            const arr = res.data.map((item) => ({
                id: item.id,
                word: item.word,
                value: item.info.value,
                language_id: item.info.language_id,
                created_at: item.created_at,
            }));
            setRows(arr);
        }).finally(()=>{
            setLoading(false);
        });
    };

    useEffect(() => {
        loadLanguages();
        loadData();
    }, []);

    // CREATE
    const createRow = async (row) => {
        try {
            const res = await http.post("dictionary", row);
            setRows((prev) => [
                { ...row, id: res.data.id, created_at: res.data.created_at },
                ...prev,
            ]);
        } catch (e) {
            Swal.fire("გაუქმებულია", "ვერ დაემატა!", "error");
        }
    };

    // UPDATE
    const updateRow = async (row) => {
        console.log(row);
        try {
            await http.put(`dictionary/update/${row.id}`, row);
            setRows((prev) =>
                prev.map((x) => (x.id === row.id ? row : x))
            );
        } catch (e) {
            Swal.fire("შეცდომა", "ვერ განახლდა!", "error");
        }
    };

    // DELETE
    const deleteRows = async (ids) => {
        for (let id of ids) {
            try {
                await http.delete("dictionary/delete/" + id);
            } catch {
                // ignore per-id error
            }
        }
        setRows((prev) => prev.filter((x) => !ids.includes(x.id)));
        setSelectedIds([]); // clear selection after delete
    };

    // Columns (memoized so they recalc only when languages change)
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
        ],
        [languagesLookup]
    );

    // Filter by date
    const filteredRows = useMemo(
        () =>
            rows.filter((x) => {
                if (!date1 && !date2) return true;
                return (
                    (!date1 || x.created_at >= date1) &&
                    (!date2 || x.created_at <= date2)
                );
            }),
        [rows, date1, date2]
    );

    // Handle create dialog
    const handleCreate = () => {
        // build options HTML for languages
        const langOptionsHtml = Object.entries(languagesLookup)
            .map(
                ([id, label]) =>
                    `<option value="${id}">${label}</option>`
            )
            .join("");

        Swal.fire({
            title: "ახალი ჩანაწერი",
            html: `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <input id="w1" class="swal2-input" placeholder="Abbr">
                    <input id="w2" class="swal2-input" placeholder="Word">
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
                const word = document
                    .getElementById("w1")
                    .value.trim();
                const value = document
                    .getElementById("w2")
                    .value.trim();
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
    };

    // Handle delete selected
    const handleDeleteSelected = () => {
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
    };

    return (
        <Box sx={{ width: "100%" }} className="card">
            {/* Header + filters */}
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
                <div className={'d-flex justify-content-between gap-3 align-items-center'}>
                    <div>
                        <h2 className={'title_font m-1'}  >
                            {translate("dictionary_title") || "ლექსიკონი"}
                        </h2>
                    </div>
                    {/* Actions */}
                    <div className="d-flex justify-content-between gap-3 align-items-center">


                        {/* Delete button – only when there is selection */}
                        {selectedIds.length > 0 && (
                            <button
                                className={"btn text_font btn-danger rounded-3"}
                                onClick={handleDeleteSelected}
                            >
                                მონიშნულის წაშლა
                            </button>
                        )}

                        <button
                            className={"btn text_font btn-light rounded-3"}
                            onClick={handleCreate}
                        ><Add/>
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
                        onClick={() => {
                            setDate1("");
                            setDate2("");
                        }}
                    >
                        გასუფთავება
                    </Button>

                    <Button variant="outlined" onClick={loadData}>
                        განახლება
                    </Button>
                </Stack>
            </Paper>

            {/* DataGrid */}
            <Box sx={{ height: 650, width: "100%" }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}

                    disableRowSelectionOnClick={false}
                    checkboxSelection
                    pageSizeOptions={[5, 10, 20, 50]}
                    // slots={{ toolbar: GridToolbar }}
                    processRowUpdate={(newRow) => {
                        updateRow(newRow);
                        return newRow;
                    }}
                    loading={loading}
                    onRowSelectionModelChange={(ids) => {
                        // ids is an array of selected row ids
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
